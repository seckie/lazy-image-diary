const dateService = require('../../src/services/date-service');
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
    it('test return value: case 1', () => {
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
    it('test return value: case 2', () => {
      const hmsArr = ['09:00:10'];
      const m = moment();
      m.hours(9);
      m.minutes(0);
      m.seconds(9);
      expect(dateService.getIndexOfInsertPosition(hmsArr, m.valueOf())).toBe(0);
    });
    it('test return value: case 3', () => {
      const hmsArr = ['12:24:01', '12:24:06'];
      const m = moment(1547349848972);
      expect(dateService.getIndexOfInsertPosition(hmsArr, m.valueOf())).toBe(2);
    });
  });

  describe('makeNewMomentFromHMS()', () => {
    it('argument should be valid date format for moment.js', () => {
      const m = moment();
      expect(() => {
        dateService.makeHMSChangedNewMoment(m, 'foo');
      }).toThrow('"hms" argument must be valid "HH:mm:ss" format for moment.js');
    });
    it('return moment.js object of the argument', () => {
      const m = moment('2019-09-01');
      expect(dateService.makeHMSChangedNewMoment(m, '10:05:01').format('HHmmss')).toBe('100501');
      const m2 = moment('2019-09-01');
      m2.hours(12);
      m2.minutes(24);
      m2.seconds(1);
      expect(dateService.makeHMSChangedNewMoment(m, '12:24:01').valueOf()).toBe(m2.valueOf());
    });
  });

  describe('splitDatasetByLastModified()', () => {
    const FILE1 = { lastModified: new Date('2019-09-01T10:00:00').getTime() };
    const FILE2 = { lastModified: new Date('2019-09-01T11:00:00').getTime() };
    const FILE3 = { lastModified: new Date('2019-09-02').getTime() };
    const FILE4 = { lastModified: new Date('2019-09-03T08:00:00').getTime() };
    const FILE5 = { lastModified: new Date('2019-09-07').getTime() };
    const FILE6 = { lastModified: new Date('2019-09-03T14:00:00').getTime() };
    const dataset = [FILE1, FILE2, FILE3, FILE4, FILE5, FILE6];
    it('return splited array of dataset', () => {
      expect(dateService.splitDatasetByLastModified(dataset)).toEqual([
        [FILE1, FILE2],
        [FILE3],
        [FILE4, FILE6],
        [FILE5]
      ]);
    });
  });
});
