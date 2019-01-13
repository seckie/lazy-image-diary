'use strict';
const moment = require('moment');
const _ = require('lodash');

const dateService = {
  getIndexOfInsertPosition (hmsTimes, momentValue) {
    if (!_.isArray(hmsTimes)) {
      throw new Error('"hmsTimes" argument must be an array');
    }
    const newMoment = moment(momentValue);
    if (!newMoment.isValid() || momentValue === undefined) {
      throw new Error('"momentValue" argument must be valid format for moment.js');
    }
    let index = hmsTimes.length;
    for (let i = 0, l = hmsTimes.length; i<l; i++) {
      const m = this.makeNewMomentFromHMS(hmsTimes[i]);
      if (newMoment.valueOf() < m.valueOf()) {
        index = i;
        break;
      }
    }
    return index;
  },

  makeNewMomentFromHMS (hms) {
    const m = moment();
    const hmsArray = hms.split(':');
    if (!hmsArray[1] || !hmsArray[2]) {
      throw new Error('"hms" argument must be valid "HH:mm:ss" format for moment.js');
    }
    m.hours(hmsArray[0]);
    m.minutes(hmsArray[1]);
    m.seconds(hmsArray[2]);
    return m;
  }
};

module.exports = dateService;
