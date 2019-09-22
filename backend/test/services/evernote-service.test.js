const request = require('supertest');
const evernoteService = require('../../src/services/evernote-service');
const dateService = require('../../src/services/date-service');
const Evernote = require('evernote');
const { JSDOM } = require('jsdom');

describe('evernote-service.js', () => {
  const OAUTH_TOKEN = 'oauthToken';
  const OAUTH_TOKEN_SECRET = 'oauthTokenSecret';
  const AUTHORIZED_URL = 'authorizedUrl';
  let originalClient;

  beforeEach(() => {
    originalClient = evernoteService.client;
    // Mock
    evernoteService.client.getAuthorizeUrl = oauthToken => {
      return AUTHORIZED_URL;
    };
  });
  afterEach(() => {
    // Resume client
    evernoteService.client = originalClient;
  });
  describe('getRequestToken()', () => {
    it('resolve', cb => {
      // Mock
      evernoteService.client.getRequestToken = jest.fn((cbUrl, callback) => {
        callback(null, OAUTH_TOKEN, OAUTH_TOKEN_SECRET);
      });

      const cbUrl = 'http://localhost:9999/foo';
      evernoteService.getRequestToken(cbUrl).then(result => {
        expect(result.oauthToken).toBe(OAUTH_TOKEN);
        expect(result.oauthTokenSecret).toBe(OAUTH_TOKEN_SECRET);
        expect(result.authorizeUrl).toBe(AUTHORIZED_URL);
        cb();
      });
    });
    it('reject', cb => {
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
      const cb2 = jest.fn(err => {
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

    it('resolve', cb => {
      // Mocking
      evernoteService.client.getAccessToken = jest.fn((oauthToken, oauthTokenSecret, oauthVerifier, callback) => {
        const err = undefined;
        const result = {};
        callback(err, mockOauthToken, mockOauthTokenSecret, result);
      });

      evernoteService.getAccessToken(mockReq).then(oauthToken => {
        expect(oauthToken).toBe(mockOauthToken);
        cb();
      });
    });

    it('reject with error object', cb => {
      // Mocking
      evernoteService.client.getAccessToken = jest.fn((oauthToken, oauthTokenSecret, oauthVerifier, callback) => {
        const result = {};
        callback(mockErrorObject, mockOauthToken, mockOauthTokenSecret, result);
      });

      evernoteService.getAccessToken(mockReq).then(
        () => {},
        err => {
          expect(err).toEqual(mockErrorObject);
          cb();
        }
      );
    });

    it('reject without oauthToken', cb => {
      // Mocking
      evernoteService.client.getAccessToken = jest.fn((oauthToken, oauthTokenSecret, oauthVerifier, callback) => {
        const result = {};
        callback(undefined, undefined, mockOauthTokenSecret, result);
      });

      evernoteService.getAccessToken(mockReq).then(
        () => {},
        err => {
          expect(err).toEqual(mockErrorObjectNoToken);
          cb();
        }
      );
    });
  });

  describe('getAuthenticatedClient()', () => {
    beforeEach(() => {
      // mock
      Evernote.Client = jest.fn().mockImplementation(() => {
        return {
          method1: function() {
            return 'foo';
          }
        };
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

  describe('createImageNotes()', () => {
    const NOTEBOOK = {};
    const DATASET = ['foo', 'bar'];
    const LIST1 = ['list1'];
    const LIST2 = ['list2'];
    const SPLITED_LIST = [LIST1, LIST2];
    const VALUE = 'value1';
    beforeEach(() => {
      evernoteService.getDiaryNotebook = jest.fn(() => NOTEBOOK);
      evernoteService._makeImageNote = jest.fn(() => new Promise(resolve => resolve(VALUE)));
      dateService.splitDatasetByLastModified = jest.fn(() => SPLITED_LIST);
    });
    it('return promise', () => {
      expect(evernoteService.createImageNotes(OAUTH_TOKEN, DATASET) instanceof Promise).toBe(true);
    });
    it('call getDiaryNotebook()', async () => {
      await evernoteService.createImageNotes(OAUTH_TOKEN, DATASET);
      expect(evernoteService.getDiaryNotebook).toBeCalled();
    });
    it('call dateService.splitDatasetByLastModified()', async () => {
      await evernoteService.createImageNotes(OAUTH_TOKEN, DATASET);
      expect(dateService.splitDatasetByLastModified).toBeCalledWith(DATASET);
    });
    it('call _makeImateNote() with args', async () => {
      await evernoteService.createImageNotes(OAUTH_TOKEN, DATASET);
      expect(evernoteService._makeImageNote).nthCalledWith(1, OAUTH_TOKEN, NOTEBOOK, LIST1);
      expect(evernoteService._makeImageNote).nthCalledWith(2, OAUTH_TOKEN, NOTEBOOK, LIST2);
    });
    it('resolves with VALUES', async () => {
      const values = await evernoteService.createImageNotes(OAUTH_TOKEN, DATASET);
      const expected = [VALUE, VALUE];
      expect(values).toEqual(expected);
    });
  });

  describe('_makeImageNote()', () => {
    it('getRequestToken', () => {
      expect(1).toBe(1);
    });
  });

  describe('_makeResource', () => {
    const file = {
      buffer: 'abcdefg',
      size: 256,
      mimetype: 'image/png',
      originalname: 'something'
    };
    let result;
    beforeEach(() => {
      result = evernoteService._makeResource(file);
    });
    it('file.mimetype should be set into result.resource', () => {
      expect(result.resource.mime).toBe(file.mimetype);
    });
    it('file.buffer should be set into result.resource.data.body', () => {
      expect(result.resource.data.body).toEqual(file.buffer);
    });
    it('file.size should be set into result.resource.data.size', () => {
      expect(result.resource.data.size).toBe(file.size);
    });
    it('result.hexHash is string', () => {
      expect(typeof result.hexHash === 'string').toBe(true);
    });
  });

  describe('_makeNewEntryBodyString', () => {
    const RESOURCE = { mime: 'abc' };
    const HEX_HASH = 'abc';
    const resourceContainer = {
      resource: RESOURCE,
      hexHash: HEX_HASH
    };
    const containers = [resourceContainer];
    const timeString = '2019-04-01';
    it('return string', () => {
      const result = evernoteService._makeNewEntryBodyString(containers, timeString);
      expect(typeof result).toBe('string');
    });
    it('include "title" element', () => {
      const result = evernoteService._makeNewEntryBodyString(containers, timeString);
      expect(new RegExp(`<p title="time">${timeString}</p>`).test(result)).toBe(true);
    });
    it('include "media" element', () => {
      const result = evernoteService._makeNewEntryBodyString(containers, timeString);
      expect(
        new RegExp(`<p title="media"><en-media hash="${HEX_HASH}" type="${RESOURCE.mime}" /></p>`).test(result)
      ).toBe(true);
    });
  });

  describe('_makeNewDom', () => {
    const lastModified6AM = '2019-04-01T06:00:00';
    const lastModified9AM = '2019-04-01T09:00:00';
    const lastModified3PM = '2019-04-01T15:00:00';
    const timeString6AM = '06:00:00';
    const timeString8AM = '08:00:00';
    const timeString9AM = '09:00:00';
    const timeString11AM = '11:00:00';
    const timeString3PM = '15:00:00';
    const content = `<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">
    <en-note>
    <div title="section">
    <p title="time">${timeString8AM}</p>
    <p title="media"><en-media hash="hash1" type="mimestring" /></p>
    </div>
    <div title="section">
    <p title="time">${timeString11AM}</p>
    <p title="media"><en-media hash="hash2" type="mimestring" /></p>
    </div>
    </en-note>`;
    const mediaENML = `<en-media hash="hash2" type="mimestring" />`;
    let initialDom;
    beforeEach(() => {
      initialDom = new JSDOM(content);
    });
    it('return dom', () => {
      const dom = evernoteService._makeNewDom(initialDom, lastModified9AM, mediaENML);
      expect(typeof dom.window).toBe('object');
    });
    it('has updated sections', () => {
      const dom = evernoteService._makeNewDom(initialDom, lastModified9AM, mediaENML);
      const $sections = dom.window.document.querySelectorAll('[title="section"]');
      expect($sections.length).toBe(3);
    });
    describe('has updated "time" paragraph', () => {
      const getTimeElements = lastModified => {
        const dom = evernoteService._makeNewDom(initialDom, lastModified, mediaENML);
        return dom.window.document.querySelectorAll('[title="time"]');
      };
      it('9AM', () => {
        const $times = getTimeElements(lastModified9AM);
        expect($times[0].textContent).toBe(timeString8AM);
        expect($times[1].textContent).toBe(timeString9AM);
        expect($times[2].textContent).toBe(timeString11AM);
      });
      it('6AM', () => {
        const $times = getTimeElements(lastModified6AM);
        expect($times[0].textContent).toBe(timeString6AM);
        expect($times[1].textContent).toBe(timeString8AM);
        expect($times[2].textContent).toBe(timeString11AM);
      });
      it('3PM', () => {
        const $times = getTimeElements(lastModified3PM);
        expect($times[0].textContent).toBe(timeString8AM);
        expect($times[1].textContent).toBe(timeString11AM);
        expect($times[2].textContent).toBe(timeString3PM);
      });
    });
  });

  describe('_makeNewNode', () => {
    const CONTENT = '<div class="content"></div>';
    const dom = new JSDOM(CONTENT);
    const LAST_MODIFIED_6AM = '2019-04-01T06:00:00';
    const MEDIA_ENML = `<en-media hash="hash2" type="mimestring"></en-media>`;
    const newNode = evernoteService._makeNewNode(dom, LAST_MODIFIED_6AM, MEDIA_ENML);
    it('returned Node that has title="section" attribute', () => {
      expect(newNode.getAttribute('title')).toBe('section');
    });
    it('returned Node includes time node', () => {
      const expected = '<p title="time">06:00:00</p>';
      expect(newNode.querySelector('[title="time"]').outerHTML).toBe(expected);
    });
    it('returned Node includes media node', () => {
      const expected = `<p title="media">${MEDIA_ENML}</p>`;
      expect(newNode.querySelector('[title="media"]').outerHTML).toBe(expected);
    });
    it('returned Node includes media node', () => {
      const expected = `<p title="media">${MEDIA_ENML}</p>`;
      expect(newNode.querySelector('[title="media"]').outerHTML).toBe(expected);
    });
    it('returned Node includes br node', () => {
      expect(newNode.querySelectorAll('br').length).toBe(1);
    });
  });

  describe('_makeUpdatedNote', () => {
    const TITLE = 'title';
    const CONTENT = 'content';
    const RESOURCE = { id: 1 };
    const GUID = 'guid';
    const originalNote = new Evernote.Types.Note();
    originalNote.title = TITLE;
    originalNote.content = CONTENT;
    originalNote.resources = [RESOURCE];
    originalNote.guid = GUID;

    it('return mixed Note object', () => {
      const bodyContent = 'body';
      const body = `<p title="body">${bodyContent}</p>`;
      const resources = [{ id: 2 }];
      const result = evernoteService._makeUpdatedNote(originalNote, body, resources);
      expect(result.title).toBe(TITLE);
      expect(new RegExp(body).test(result.content)).toBe(true);
      expect(result.resources[0]).toEqual(RESOURCE);
      expect(result.resources[1]).toEqual(resources[0]);
      expect(result.guid).toEqual(GUID);
    });
    it("if originalNote doesn't have any resource, new note would have just one resource", () => {
      const body = 'body';
      const resources = [{ id: 2 }];
      const tempResource = originalNote.resources;
      originalNote.resources = undefined;
      const result = evernoteService._makeUpdatedNote(originalNote, body, resources);
      expect(result.resources).toEqual(resources);
      originalNote.resources = tempResource;
    });
  });

  describe('_removeUnnecessaryBreak', () => {
    it('remove "<hr>" and "<br>" before "</en-media>"', () => {
      const content = `
      abc<hr></en-media>
      ABC<hr/></en-media>
      abc<hr ></en-media>
      ABC<hr /></en-media>
      abc<br></en-media>
      ABC<br/></en-media>
      abc<br ></en-media>
      ABC<br /></en-media>
      abc<hr><br></en-media>
      ABC<hr/><br/></en-media>
      abc<hr ><br ></en-media>
      ABC<hr /><br /></en-media>
      `;
      const expected = `
      abc</en-media>
      ABC</en-media>
      abc</en-media>
      ABC</en-media>
      abc</en-media>
      ABC</en-media>
      abc</en-media>
      ABC</en-media>
      abc</en-media>
      ABC</en-media>
      abc</en-media>
      ABC</en-media>
      `;
      expect(evernoteService._removeUnnecessaryBreak(content)).toBe(expected);
    });
    it('remove "&nbsp;" before "</en-media>"', () => {
      const content = `abc&nbsp;&nbsp;</en-media>`;
      const expected = `abc</en-media>`;
      expect(evernoteService._removeUnnecessaryBreak(content)).toBe(expected);
    });
    it('remove close tag "</br>"', () => {
      const content = `abc<br></br>ABC<br></ br>`;
      const expected = `abc<br/>ABC<br/>`;
      expect(evernoteService._removeUnnecessaryBreak(content)).toBe(expected);
    });
    it('remove close tag "</hr>"', () => {
      const content = `abc<hr></hr>ABC<hr></ hr>`;
      const expected = `abc<hr/>ABC<hr/>`;
      expect(evernoteService._removeUnnecessaryBreak(content)).toBe(expected);
    });
  });
});
