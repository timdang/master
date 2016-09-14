const thinky = require('../thinkylocal');

const type = thinky.type;

const User = thinky.createModel('User', {
  id: type.string(),
  username: type.string(),
  email: type.string(),
  userID: type.string(),
  refreshToken: type.string(),
  accessToken: type.string(),

});

module.exports = User;

// Job required here to avoid circular reference
const Job = require('./job');

User.hasMany(Job, 'jobs', 'id', 'idUser');
