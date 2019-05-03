'use strict';
const crypto = require('crypto');
const Evernote = require('evernote');
const moment = require('moment');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const secret = require('../config/secret');
const dateService = require('./date-service');
const {SANDBOX, NOTEBOOK_NAME} = require('../config/app-config');

class EvernoteService {
  constructor() {
    this.AUTH_OPT_BASE = {
      sandbox: SANDBOX,
      china: false // change to true if you wish to connect to YXBJ - most of you won't
    };
    // initialize OAuth
    const initializeOpt = Object.assign({}, this.AUTH_OPT_BASE, {
      consumerKey: secret.evernote.consumerKey,
      consumerSecret: secret.evernote.consumerSecret,
    });
    this.client = new Evernote.Client(initializeOpt);
  }
  getRequestToken(callbackUrl) {
    return new Promise((resolve, reject) => {
      this.client.getRequestToken(callbackUrl, (error, oauthToken, oauthTokenSecret) => {
        if (error) {
          reject(error);
        } else {
          const authorizeUrl = this.client.getAuthorizeUrl(oauthToken);
          const result = {
            oauthToken: oauthToken,
            oauthTokenSecret: oauthTokenSecret,
            authorizeUrl: authorizeUrl
          };
          resolve(result);
        }
      });
    });
  }
  getAccessToken(req) {
    return new Promise((resolve, reject) => {
      this.client.getAccessToken(req.session.oauthToken,
        req.session.oauthTokenSecret,
        req.query.oauth_verifier,
        (error, oauthToken, oauthTokenSecret, results) => {
          if (error) {
            reject(error);
          } else if (!oauthToken) {
            reject({message: 'No token'});
          } else {
            this.authenticatedClient = this.getAuthenticatedClient(oauthToken);
            resolve(oauthToken);
          }
        });
    });
  }

  getAuthenticatedClient (oauthToken) {
    if (!this.authenticatedClient) {
      if (!oauthToken) {
        throw new Error('No auth information to use getUser()');
      }
      const authOpt = Object.assign({}, this.AUTH_OPT_BASE, {token: oauthToken});
      this.authenticatedClient = new Evernote.Client(authOpt);
    }
    return this.authenticatedClient;
  }

  getUser () {
    const userStore = this.authenticatedClient.getUserStore();
    return userStore.getUser();
  }

  getNoteStore () {
    if (!this.noteStore) {
      this.noteStore = this.authenticatedClient.getNoteStore();
    }
    return this.noteStore;
  }

  getDiaryNotebook () {
    return new Promise((resolve, reject) => {
      const noteStore = this.getNoteStore();
      noteStore.listNotebooks().then((notebooks) => {
        const diary = notebooks.find((notebook) => {
          return notebook.name === NOTEBOOK_NAME;
        });
        if (diary) {
          resolve(diary);
        } else {
          reject({message: 'No "Diary" notebook was found.'});
        }
      }, reject);
    })
  }

  searchNotesWithTitle (noteStore, title) {
    return new Promise((resolve, reject) => {
      const filter = new Evernote.NoteStore.NoteFilter({
        words: `notebook:${NOTEBOOK_NAME} intitle:${title}`
      });
      const spec = new Evernote.NoteStore.NotesMetadataResultSpec({
        includeTitle: true,
        includeContentLength: false,
        includeCreated: true,
        includeUpdated: true,
        includeDeleted: false,
        includeUpdateSequenceNum: false,
        includeNotebookGuid: true,
        includeTagGuids: false,
        includeAttributes: true,
        includeLargestResourceMime: false,
        includeLargestResourceSize: false,
      });
      noteStore.findNotesMetadata(filter, 0, 100, spec).then((res) => {
        const promises = res.notes.map((note) => {
          return new Promise((resolve2, reject2) => {
            noteStore.getNote(note.guid, false, true, false, false).then((noteData) => {
              console.log(noteData);
              note.resources = noteData.resources;
              resolve2(note);
            }, reject2);
          });
        });
        Promise.all(promises).then((notes) => {
          res.notes = notes;
          resolve(res);
        }, reject);
      });
    });
  }

  createTodaysNoteWithImage (oauthToken, data) {
    return new Promise((resolve, reject) => {
      const noteStore = this.getNoteStore();
      this.getDiaryNotebook().then((notebook) => {
        this._makeImageNote(oauthToken, notebook, data).then(resolve, reject);
      });
    });
  }

  _makeImageNote(oauthToken, parentNotebook, file) {
    //     - Make new media
    //     - Make new <en-media/> tag of the media
    //     - Make date string of the media
    //     - Merge new tag and date into the body
    // - Else
    //     - Create new note
    return new Promise((resolve, reject) => {
      const noteStore = this.getNoteStore();
      const date = moment(file.lastModified);
      const searchTitle = date.format('YYYY-MM-DD');
      const title = `${date.format('YYYY-MM-DD')} [${date.format('ddd').toUpperCase()}]`
      // - Search a note of today
      evernoteService.searchNotesWithTitle(noteStore, searchTitle).then((res) => {
        const { resource, hexHash } = this._makeResource(file);
        // Create body
        const notes = res.notes;
        const timeString = date.format('HH:mm:ss');
        // - If the note was found
        let theNote;
        if (notes && notes[0]) {
          theNote = notes.find(note => note.title.indexOf(title) !== -1);
        }
        if (theNote) {
          // Already the note exists so update it
          const noteStore = this.getNoteStore();
          noteStore.getNoteContent(theNote.guid).then((content) => {
            const media = `<en-media hash="${hexHash}" type="${resource.mime}" />`;
            const dom = this._makeNewDom(content, file.lastModified, media);
            const newNote = this._makeUpdatedNote(theNote, dom.window.document.body.innerHTML, resource);
            noteStore.updateNote(newNote).then(resolve, reject);
          }, reject)
        } else {
          // Make new note
          const ourNote = new Evernote.Types.Note();
          const nBody = this._makeNewEntryBodyString(resource, hexHash, timeString);
          ourNote.title = title;
          ourNote.content = nBody;
          ourNote.resources = [resource];
          if (parentNotebook && parentNotebook.guid) {
            ourNote.notebookGuid = parentNotebook.guid;
          }
          noteStore.createNote(ourNote).then(resolve, reject);
        }
      }, reject);
    });
  }

  _makeResource(file) {
    const hexHash = crypto.createHash('md5').update(file.buffer).digest('hex');

    const data = new Evernote.Types.Data();
    data.body = file.buffer;
    data.size = file.size;
    const resource = new Evernote.Types.Resource();
    resource.mime = file.mimetype;
    resource.data = data;
    const attr = new Evernote.Types.ResourceAttributes();
    attr.fileName = file.originalname;
    resource.attributes = attr;

    return { resource, hexHash };
  }

  _makeNewEntryBodyString (resource, hexHash, timeString) {
    const nBody = `<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">
    <en-note>
    <div title="section">
    <p title="time">${timeString}</p>
    <p title="media"><en-media hash="${hexHash}" type="${resource.mime}" /></p>
    </div>
    </en-note>`
    return nBody;
  }

  _makeNewDom(content, lastModified, mediaENML) {
    const date = moment(lastModified);
    const dom = new JSDOM(content);
    const $times = dom.window.document.querySelectorAll('p[title="time"]');
    let hmsTimes = [];
    for (let i = 0, l = $times.length; i < l; i++) {
      hmsTimes.push($times[i].textContent);
    }
    // 新しいエントリーを挿入すべきノート中の位置
    const index = dateService.getIndexOfInsertPosition(hmsTimes, lastModified);
    // 新しいノードを作る
    const parentNode = dom.window.document.querySelector('en-note');
    const newNode = dom.window.document.createElement('div');
    const newTimeNode = dom.window.document.createElement('p');
    const newMediaNode = dom.window.document.createElement('p');
    newNode.setAttribute('title', 'section');
    newTimeNode.setAttribute('title', 'time')
    newMediaNode.setAttribute('title', 'media')
    newTimeNode.innerHTML = date.format('HH:mm:ss');
    newMediaNode.innerHTML = mediaENML;
    newNode.appendChild(newTimeNode);
    newNode.appendChild(newMediaNode);
    // ノードの挿入
    if ($times[index]) {
      // 途中に挿入
      const targetNode = $times[index].parentNode;
      parentNode.insertBefore(newNode, targetNode);
    } else {
      // 末尾へ挿入
      parentNode.appendChild(newNode);
    }
    return dom;
  }

  _makeUpdatedNote(originalNote, bodyString, resource) {
    // update content
    let nBody = '<?xml version="1.0" encoding="UTF-8"?>';
    nBody += '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">';
    nBody += bodyString;
    nBody = this._removeUnnecessaryBreak(nBody);

    // Create note object
    const newNote = new Evernote.Types.Note();
    newNote.title = originalNote.title;
    newNote.content = nBody;
    newNote.resources = originalNote.resources && originalNote.resources.length ? originalNote.resources.concat(resource) : [resource];
    newNote.guid = originalNote.guid;
    return newNote;
  }

  _removeUnnecessaryBreak (content) {
    return content
      .replace(/(<[hb]r[^>]*>)+<\/en-media>/gi, '</en-media>')
      .replace(/(&nbsp;)+<\/en-media>/gi, '</en-media>')
      .replace(/<br>(<\/\s?br>)?/gi, '<br/>')
      .replace(/<hr>(<\/\s?hr>)?/gi, '<hr/>');
  }
}


const evernoteService = new EvernoteService();

module.exports = evernoteService;
