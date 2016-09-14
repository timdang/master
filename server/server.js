const koa = require('koa');
const path = require('path');
const spa = require('koa-spa');
const session = require('koa-session');
const passport = require('./controllers/auth');
const routes = require('./routes/routes');

const app = koa();

app.keys = ['secret'];
app.use(session(app));

// Initialize Auth must be before routes(app)
app.use(passport.initialize());
app.use(passport.session());
routes(app);

// Serve up react SPA
app.use(spa(path.join(__dirname, '../dist'), {
  index: 'index.html',
  404: '404.html',
  routeBase: '/',
}));

const thePort = process.env.PORT || 3000;
app.listen(thePort);
