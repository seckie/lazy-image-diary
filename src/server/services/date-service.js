'use strict';
const moment = require('moment');

const dateService = {
  getIndexOfInsertPosition (hmsTimes, value) {
    const newMoment = moment(value);
    let index = hmsTimes.length;
    for (let i = 0, l = hmsTimes.length; i<l; i++) {
      const hms = hmsTimes[i].split(':');
      const m = moment();
      m.hours(hms[0]);
      m.seconds(hms[1]);
      m.minutes(hms[2]);
      if (newMoment.valueOf() < m.valueOf()) {
        index = i;
        break;
      }
    }
    return index;
  }
};

module.exports = dateService;
