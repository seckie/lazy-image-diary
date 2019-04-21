const request = require('supertest');
const evernoteService = require('../../src/server/services/evernote-service');
const Evernote = require('evernote');

describe('evernote-service.js', () => {
  const OAUTH_TOKEN = 'oauthToken';
  const OAUTH_TOKEN_SECRET = 'oauthTokenSecret';
  const AUTHORIZED_URL = 'authorizedUrl';
  let originalClient;

  beforeEach(() => {
    originalClient = evernoteService.client;
    // Mock
    evernoteService.client.getAuthorizeUrl = (oauthToken) => {
      return AUTHORIZED_URL;
    };
  });
  afterEach(() => {
    // Resume client
    evernoteService.client = originalClient;
  });
  describe('getRequestToken()', () => {
    it('resolve', (cb) => {
      // Mock
      evernoteService.client.getRequestToken = jest.fn((cbUrl, callback) => {
        callback(null, OAUTH_TOKEN, OAUTH_TOKEN_SECRET);
      });

      const cbUrl = 'http://localhost:9999/foo';
      evernoteService.getRequestToken(cbUrl).then((result) => {
        expect(result.oauthToken).toBe(OAUTH_TOKEN);
        expect(result.oauthTokenSecret).toBe(OAUTH_TOKEN_SECRET);
        expect(result.authorizeUrl).toBe(AUTHORIZED_URL);
        cb();
      })
    });
    it('reject', (cb) => {
      // mock
      evernoteService.client.getRequestToken = (cbUrl, callback) => {
        const err = { statusCode: 400 };
        callback(err);
      };

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

  describe('getAuthenticatedClient()', () => {
    beforeEach(() => {
      // mock
      Evernote.Client = jest.fn().mockImplementation(() => {
        return {
          method1: function () { return 'foo'; }
        }
      });
      // reset client
      evernoteService.authenticatedClient = undefined;
    });

    it('return authenticatedClient with TOKEN argument', () => {
      const TOKEN = 'token';
      const authenticatedClient = evernoteService.getAuthenticatedClient(TOKEN);
      expect(authenticatedClient.method1()).toBe('foo');
    });
    it('throw exception without TOKEN argument', () => {
      expect(() => evernoteService.getAuthenticatedClient()).toThrow();
    });
    it('save authenticatedClient as its property', () => {
      const TOKEN = 'token';
      const authenticatedClient = evernoteService.getAuthenticatedClient(TOKEN);
      expect(evernoteService.getAuthenticatedClient()).toBe(authenticatedClient);
    });
  });

  describe('getUser()', () => {
    it('getRequestToken', () => {
      expect(1).toBe(1);
    });
  });

  xdescribe('getNoteStore()', () => {
    let originalNoteStore;
    beforeEach(() => {
      originalNoteStore = evernoteService.noteStore;
    });
    afterEach(() => {
      evernoteService.noteStore = originalNoteStore;
    });
    it('return existing noteBook', () => {
      const NOTE = { data: 'foo' };
      evernoteService.noteStore = NOTE;
      expect(evernoteService.getNoteStore(OAUTH_TOKEN)).toEqual(NOTE);
    });
    it('return NoteStore from authenticated client', () => {
      const noteStore = evernoteService.getNoteStore(OAUTH_TOKEN);
      const authOpt = Object.assign({}, evernoteService.AUTH_OPT_BASE, { token: OAUTH_TOKEN });
      const client = new Evernote.Client(authOpt);
      const expected = client.getNoteStore();
      expect(noteStore).toEqual(expected);
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
