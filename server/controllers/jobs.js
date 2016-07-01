'use strict';

const axios = require('axios');
const Job = require('../../database/models/job');
const User = require('../../database/models/user');
const parse = require('co-body');
const http = require('http');

module.exports.list = function*() {
  let jobs = [];
  // format the querey and result from github
  if (this.params.source === 'github') {
    let queryString = '?description=' + this.params.keywords;
    if (this.params.city) {
      queryString += '&location=' + this.params.city;
    }
    const unformattedJobs = yield axios.get('https://jobs.github.com/positions.json' + queryString);
    jobs = unformattedJobs.data;
  }

  // format the querey and result from usajobs
  if (this.params.source === 'usajobs') {
    let queryString = '?Keyword=' + this.params.keywords;
    if (this.params.city) {
      queryString += '&LocationName=' + this.params.city;
    }
    const unformattedJobs =
      yield axios.request({
        method: 'get',
        url: 'https://data.usajobs.gov/api/search' + queryString,
        headers: { 'Authorization-Key:': 'd6ofgumlbQCMXrWPB63mSLd3fbZyLyXjiI5Rx+GzHa4=' },
      });

    // matching object keys with github's results
    if (!!unformattedJobs.data.JobData) {
      jobs = unformattedJobs.data.JobData.map((object) => {
        return {
          id: object.DocumentID,
          title: object.JobTitle,
          company: object.OrganizationName,
          url: object.ApplyOnlineURL,
          description: object.JobSummary,
          location: object.Locations,
          type: object.WorkSchedule,
        };
      });
    }
  }
  this.status = 200;
  this.body = jobs;
};

module.exports.addJob = function*() {
  this.type = 'application/json';
  try {
    const jobData = yield parse(this);
    const job = new Job(jobData);
    const newJob = yield job.saveAll();
    this.status = 200;
    this.body = yield Job.get(newJob.id).getJoin({
      users: true,
    }).run();
  } catch (e) {
    this.status = 500;
    this.body = e.message || http.STATUS_CODES[this.status];
  }
};

module.exports.getJobs = function*() {
  const jobs = [];
  try {
    this.status = 200;
    this.body = yield User.get(this.params.idUser).getJoin({
      jobs,
    }).run().then(user => user.jobs);
  } catch (e) {
    // console.error('Could not get jobs.', e);
    this.status = 500;
    this.body = e.message || http.STATUS_CODES[this.status];
  }
};

module.exports.deleteJob = function*() {
  try {
    const jobToDelete = this.params.id;
    yield Job.get(jobToDelete).delete().run();
    console.log('Job deleted sucessfully.');
    this.status = 200;
    this.body = jobToDelete;
  } catch (e) {
    console.error('Sorry, could not find a job with that id.');
    this.status = 500;
    this.body = e.message || http.STATUS_CODES[this.status];
  }
};

module.exports.updateJob = function*() {
  try {
    // Would have to send id of job wanted to edit in
    const dataToUpdate = yield parse(this);
    const updatedJob = yield Job.get(dataToUpdate.id).run();
    yield updatedJob.merge(dataToUpdate).saveAll();
    console.log('Sucessfully updated Job');
  } catch (e) {
    console.error('Could not update job');
    this.status = 500;
    this.body = e.message || http.STATUS_CODES[this.status];
  }
};
