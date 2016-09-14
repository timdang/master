const job = require('../controllers/jobs');
const user = require('../controllers/user');
const passport = require('../controllers/auth');
const userLookup = require('../controllers/userLookup');
const notes = require('../controllers/notes');
const contacts = require('../controllers/contacts');
const calendar = require('../controllers/calendar');
const router = require('koa-router')();

module.exports = function routes(app) {
  app.use(router.routes());

  // Job Search Routes
  router.get('/api/jobs/:source/:keywords/:city', job.list);
  router.get('/api/jobs/:source/:keywords', job.list);

  // DB Routes
  router.delete('/api/users/', user.deleteUser);
  router.post('/api/jobs/', job.addJob);
  router.get('/api/getjobs/:idUser', job.getJobs);
  router.delete('/api/jobs/:id', job.deleteJob);
  router.put('/api/jobs/', job.updateJob);
  router.get('/api/me', userLookup.lookup);
  router.post('/api/addnote', notes.addNote);
  router.post('/api/addcontact', contacts.addContact);
  router.delete('/api/deletenote/:id/:noteid', notes.deleteNote);

  // Google Calendar Route
  router.post('/api/calendar', calendar.addEvent);

  // Google Authentication Routes
  router.get('/auth/google', passport.authenticate('google', {
    scope: ['email', 'profile', 'https://www.googleapis.com/auth/calendar'],
    accessType: 'offline',
    approvalPrompt: 'force',
  }));
  router.get('/auth/google/callback',
    passport.authenticate('google', {
      successRedirect: '/dashboard',
      failureRedirect: '/',
    })
  );
  router.get('/logout', function () {
    this.session = null;
    this.redirect('/');
  });

  // Authenticating routes
  function* authed(next) {
    if (this.req.isAuthenticated()) {
      yield next;
    } else {
      this.redirect('/');
    }
  }

  router.get('/dashboard', authed, function* (next) {
    yield next;
  });
  router.get('/jobsearch', authed, function* (next) {
    yield next;
  });
  router.get('/addjob', authed, function* (next) {
    yield next;
  });
};
