const request = require('supertest');
const evernoteService = require('../../src/server/services/evernote-service');

describe('evernote-service.js', () => {
  let originalClient;
  beforeEach(() => {
    originalClient = evernoteService.client;
  });
  afterEach(() => {
    // Resume client
    evernoteService.client = originalClient;
  });
  describe('getRequestToken()', () => {
    it('resolve', (cb) => {
      const cbUrl = 'http://localhost:9999/foo';
      evernoteService.getRequestToken(cbUrl).then((result) => {
        expect(typeof result.oauthToken).toBe('string');
        expect(typeof result.oauthTokenSecret).toBe('string');
        expect(typeof result.authorizeUrl).toBe('string');
        cb();
      })
    });
    it('reject', (cb) => {
      const cbUrl = undefined;
      const cb1 = jest.fn(() => {
        expect(cb1).not.toHaveBeenCalled();
        cb();
      });
      const cb2 = jest.fn((err) => {
        expect(cb1).not.toHaveBeenCalled();
        expect(err.statusCode).toBe(400);
        cb();
      });
      evernoteService.getRequestToken(cbUrl).then(cb1, cb2);
    });
  });
  describe('getAccessToken()', () => {
    const mockReq = {
      session: {
        oauthToken: 'oauthTokenString',
        oauthTokenSecret: 'oauthTokenSecretString'
      },
      query: {
        oauth_verifier: 'verifierString'
      }
    };
    const mockOauthToken = 'oauthTokenString';
    const mockOauthTokenSecret = 'oauthTokenSecretString';
    const mockErrorObject = { message: 'error!' };
    const mockErrorObjectNoToken = { message: 'No token' };

    it('resolve', (cb) => {
      // Mocking
      evernoteService.client.getAccessToken = jest.fn((oauthToken, oauthTokenSecret, oauthVerifier, callback) => {
        const err = undefined;
        const result = {};
        callback(err, mockOauthToken, mockOauthTokenSecret, result);
      });

      evernoteService.getAccessToken(mockReq).then((oauthToken) => {
        expect(oauthToken).toBe(mockOauthToken);
        cb();
      });
    });

    it('reject with error object', (cb) => {
      // Mocking
      evernoteService.client.getAccessToken = jest.fn((oauthToken, oauthTokenSecret, oauthVerifier, callback) => {
        const result = {};
        callback(mockErrorObject, mockOauthToken, mockOauthTokenSecret, result);
      });

      evernoteService.getAccessToken(mockReq).then(() => {
      }, (err) => {
        expect(err).toEqual(mockErrorObject)
        cb();
      });
    })

    it('reject without oauthToken', (cb) => {
      // Mocking
      evernoteService.client.getAccessToken = jest.fn((oauthToken, oauthTokenSecret, oauthVerifier, callback) => {
        const result = {};
        callback(undefined, undefined, mockOauthTokenSecret, result);
      });

      evernoteService.getAccessToken(mockReq).then(() => {
      }, (err) => {
        expect(err).toEqual(mockErrorObjectNoToken)
        cb();
      });
    })
  });
  describe('getUser()', () => {
    it('getRequestToken', () => {
      expect(1).toBe(1);
    });
  });
  describe('getDiaryNotebook()', () => {
    it('getRequestToken', () => {
      expect(1).toBe(1);
    });
  });
  describe('searchNotesWithTitle()', () => {
    it('getRequestToken', () => {
      expect(1).toBe(1);
    });
  });
  describe('createTodaysNoteWithImage()', () => {
    it('getRequestToken', () => {
      expect(1).toBe(1);
    });
  });
  describe('makeImageNote()', () => {
    it('getRequestToken', () => {
      expect(1).toBe(1);
    });
  });
});
