const thinky = require('../thinkylocal');

const type = thinky.type;

const Job = thinky.createModel('Job', {
  id: type.string(),
  title: type.string(),
  company: type.string(),
  location: type.string(),
  type: type.string(),
  description: type.string(),
  url: type.string(),
  contact: type.array(),
  idUser: type.string(),
  notes: type.array(),
});

module.exports = Job;

// User required here to avoid circular reference
const User = require('./user');

Job.belongsTo(User, 'user', 'idUser', 'id');
