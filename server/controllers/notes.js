const Job = require('../../database/models/job');
const parse = require('co-body');

module.exports.addNote = function* addNote() {
  const note = yield parse(this);
  try {
    const job = yield Job.get(note.jobID).run();
    if (job) {
      job.notes.push(note.text.noteTxt);
      yield job.save();
      this.status = 200;
    }
  } catch (e) {
    console.error(e);
  }
};

module.exports.deleteNote = function* deleteNote() {
  const jobID = this.params.id;
  const noteIndex = this.params.noteid;
  try {
    const job = yield Job.get(jobID).run();
    job.notes.splice(noteIndex, 1);
    yield job.save();
    this.status = 200;
  } catch (e) {
    console.error(e);
  }
};
