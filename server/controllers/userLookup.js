const User = require('../../database/models/user');

// Decoding cookie and retrieving user from DB
module.exports.lookup = function* lookup() {
  const cookie = this.req.headers.cookie.split('=')[1].split(';')[0];
  const cookieBuffer = new Buffer(cookie, 'base64');
  const decodedCookie = JSON.parse(cookieBuffer.toString('utf8'));
  const findUser = decodedCookie.passport.user.userID;
  try {
    this.body = yield User.filter({
      userID: findUser,
    }).limit(1).run();
  } catch (e) {
    console.error(e);
  }
};
