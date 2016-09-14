// const User = require('../../database/models/user');
const parse = require('co-body');
const http = require('http');

module.exports.deleteUser = function* deleteUser(next) {
  try {
    const user = yield parse(this);
    if ((user === null) || (user.id === null)) {
      throw new Error('The user must have a field "id".');
    }
    // const result = yield User.get(user.id).delete().run();
  } catch (e) {
    this.status = 500;
    this.body = e.message || http.STATUS_CODES[this.status];
  }
  yield next;
};
