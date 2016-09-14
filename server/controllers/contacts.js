const Job = require('../../database/models/job');
const parse = require('co-body');

module.exports.addContact = function* addContact() {
  const contact = yield parse(this);
  try {
    const job = yield Job.get(contact.jobID).run();
    if (job) {
      job.contacts.push({
        name: contact.text.name,
        email: contact.text.email,
        phone: contact.text.phone,
      });
      yield job.save();
      this.status = 200;
    }
  } catch (e) {
    console.error(e);
  }
};
