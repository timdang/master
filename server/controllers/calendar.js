
const axios = require('axios');
const parse = require('co-body');


const formatDate = function formatDate(date) {
  const split = date.split('/');
  return `${split[2]}-${split[0]}-${split[1]}`;
};

module.exports.addEvent = function* addEvent() {
  const accessToken = this.req.user.accessToken;
  const body = yield parse(this);
  const date = formatDate(body.data.date);
  try {
    axios({
      method: 'post',
      url: `https://www.googleapis.com/calendar/v3/calendars/primary/events?access_token=${accessToken}`,
      data: {
        start: {
          date,
        },
        end: {
          date,
        },
        summary: body.data.text,
      },
    });
    this.status = 200;
  } catch (e) {
    console.log(e);
  }
};
