const request = require('supertest');
const dateService = require('../../src/server/services/date-service');
const moment = require('moment');

describe('date-service.js', () => {
  
  describe('getIndexOfInsertPosition()', () => {
    let suppressDeprecationWarningsDefault;
    beforeAll(() => {
      // supress moment.js console.warn
      suppressDeprecationWarningsDefault = moment.suppressDeprecationWarnings;
      moment.suppressDeprecationWarnings = true;
    });
    afterAll(() => {
      moment.suppressDeprecationWarnings = suppressDeprecationWarningsDefault;
    });
    it('hmsTimes argument should be array', () => {
      const arg2 = moment().valueOf();
      expect(() => {
        dateService.getIndexOfInsertPosition('foo', arg2);
      }).toThrow();
      expect(() => {
        dateService.getIndexOfInsertPosition(undefined, arg2);
      }).toThrow();
      expect(() => {
        dateService.getIndexOfInsertPosition([], arg2);
      }).not.toThrow();
    });
    it('momentValue argument should be valid date format for moment.js', () => {
      expect(() => {
        dateService.getIndexOfInsertPosition([]);
      }).toThrow();
      expect(() => {
        dateService.getIndexOfInsertPosition([], 'foo');
      }).toThrow();
    });
    it('return valid index', () => {
      const hmsArr1 = ['09:01:00', '10:10:00', '10:40:00'];
      const m = moment();
      m.hours(8);
      m.minutes(10);
      expect(dateService.getIndexOfInsertPosition(hmsArr1, m.valueOf())).toBe(0);
      const m2 = moment();
      m2.hours(9);
      m2.minutes(2);
      expect(dateService.getIndexOfInsertPosition(hmsArr1, m2.valueOf())).toBe(1);
      const m3 = moment();
      m3.hours(10);
      m3.minutes(20);
      expect(dateService.getIndexOfInsertPosition(hmsArr1, m3.valueOf())).toBe(2);
    });
  });

  describe('makeNewMomentFromHMS()', () => {
    it('argument should be valid date format for moment.js', () => {
      expect(() => {
        dateService.makeNewMomentFromHMS('foo');
      }).toThrow('"hms" argument must be valid "HH:mm:ss" format for moment.js');
    })
    it('return moment.js object of the argument', () => {
      expect(dateService.makeNewMomentFromHMS('10:05:01').format('HHmmss')).toBe('100501');
    })
  });
});
