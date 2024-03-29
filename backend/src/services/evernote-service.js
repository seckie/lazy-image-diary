'use strict';
const crypto = require('crypto');
const Evernote = require('evernote');
const moment = require('moment');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const secret = require('../config/secret');
const dateService = require('./date-service');
const { SANDBOX, NOTEBOOK_NAME } = require('../config/app-config');

class EvernoteService {
  constructor() {
    this.AUTH_OPT_BASE = {
      sandbox: SANDBOX,
      china: false // change to true if you wish to connect to YXBJ - most of you won't
    };
    // initialize OAuth
    const initializeOpt = Object.assign({}, this.AUTH_OPT_BASE, {
      consumerKey: secret.evernote.consumerKey,
      consumerSecret: secret.evernote.consumerSecret
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
      this.client.getAccessToken(
        req.query.oauthToken,
        req.query.oauthTokenSecret,
        req.query.oauth_verifier,
        (error, accessToken, oauthTokenSecret, results) => {
          if (error) {
            reject(error);
          } else if (!accessToken) {
            reject({ message: 'No token' });
          } else {
            this.authenticatedClient = this.getAuthenticatedClient(accessToken);
            resolve(accessToken);
          }
        }
      );
    });
  }

  getAuthenticatedClient(accessToken) {
    if (!this.authenticatedClient) {
      if (!accessToken) {
        throw new Error('No auth information to use getUser()');
      }
      const authOpt = Object.assign({}, this.AUTH_OPT_BASE, { token: accessToken });
      this.authenticatedClient = new Evernote.Client(authOpt);
    }
    return this.authenticatedClient;
  }

  getUser() {
    const userStore = this.authenticatedClient.getUserStore();
    return userStore.getUser();
  }

  getNoteStore() {
    if (!this.authenticatedClient) {
      throw new Error('You have to login');
    }
    if (!this.noteStore) {
      this.noteStore = this.authenticatedClient.getNoteStore();
    }
    return this.noteStore;
  }

  getDiaryNotebook() {
    return new Promise((resolve, reject) => {
      const noteStore = this.getNoteStore();
      noteStore.listNotebooks().then((notebooks) => {
        const diary = notebooks.find((notebook) => {
          return notebook.name === NOTEBOOK_NAME;
        });
        if (diary) {
          resolve(diary);
        } else {
          reject({ message: 'No "Diary" notebook was found.' });
        }
      }, reject);
    });
  }

  searchNotesWithTitle(noteStore, title) {
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
        includeLargestResourceSize: false
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

  async createImageNotes(oauthToken, dataset) {
    const notebook = await this.getDiaryNotebook();
    const splitedDatasets = dateService.splitDatasetByLastModified(dataset);
    const promises = splitedDatasets.map((files) => this._makeImageNote(oauthToken, notebook, files));
    return Promise.all(promises);
  }

  _makeImageNote(oauthToken, parentNotebook, files) {
    //     - Make new media
    //     - Make new <en-media/> tag of the media
    //     - Make date string of the media
    //     - Merge new tag and date into the body
    // - Else
    //     - Create new note
    return new Promise((resolve, reject) => {
      const noteStore = this.getNoteStore();
      const date = moment(files[0].lastModified);
      const searchTitle = date.format('YYYY-MM-DD');
      const title = `${date.format('YYYY-MM-DD')} [${date.format('ddd').toUpperCase()}]`;
      // - Search a note of today
      evernoteService.searchNotesWithTitle(noteStore, searchTitle).then((res) => {
        const resourceContainers = files.map((file) => this._makeResource(file));
        const resources = resourceContainers.map((container) => container.resource);
        // Create body
        const notes = res.notes;
        // - If the note was found
        let theNote;
        if (notes && notes[0]) {
          theNote = notes.find((note) => note.title.indexOf(title) !== -1);
        }
        if (theNote) {
          // Already the note exists so update it
          const noteStore = this.getNoteStore();
          noteStore.getNoteContent(theNote.guid).then((content) => {
            const updatedDom = resourceContainers.reduce((dom, container, i) => {
              const { resource, hexHash } = container;
              const media = `<en-media hash="${hexHash}" type="${resource.mime}" />`;
              return this._makeNewDom(dom, files[i].lastModified, media);
            }, new JSDOM(content));
            console.log('updatedDom: ', updatedDom.window.document.body.innerHTML);
            const newNote = this._makeUpdatedNote(theNote, updatedDom.window.document.body.innerHTML, resources);
            noteStore.updateNote(newNote).then(resolve, reject);
          }, reject);
        } else {
          // Make new note
          const ourNote = new Evernote.Types.Note();
          const nBody = this._makeNewEntryBodyString(resourceContainers);
          ourNote.title = title;
          ourNote.content = nBody;
          ourNote.resources = resources;
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

    return {
      resource,
      hexHash,
      lastModified: file.lastModified
    };
  }

  _makeNewEntryBodyString(resourceContainers) {
    let nBody = `<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">
    <en-note>`;
    resourceContainers.forEach((container) => {
      const { resource, hexHash, lastModified } = container;
      const time = moment(lastModified).format('HH:mm:ss');
      nBody += `<div title="section">
        <p title="time">${time}</p>
        <p title="media"><en-media hash="${hexHash}" type="${resource.mime}" /></p>
        <br />
        </div>`;
    });
    nBody += `</en-note>`;
    return nBody;
  }

  _makeNewDom(dom, lastModified, mediaENML) {
    const $times = dom.window.document.querySelectorAll('p[title="time"]');
    let hmsTimes = [];
    for (let i = 0, l = $times.length; i < l; i++) {
      hmsTimes.push($times[i].textContent);
    }
    // 新しいエントリーを挿入すべきノート中の位置
    const index = dateService.getIndexOfInsertPosition(hmsTimes, lastModified);
    // 新しいノードを作る
    const newNode = this._makeNewNode(dom, lastModified, mediaENML);
    // ノードの挿入
    const parentNode = dom.window.document.querySelector('en-note');
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

  _makeNewNode(dom, lastModified, mediaENML) {
    const newNode = dom.window.document.createElement('div');
    const newTimeNode = dom.window.document.createElement('p');
    const newMediaNode = dom.window.document.createElement('p');
    const newBrNode = dom.window.document.createElement('br');
    newNode.setAttribute('title', 'section');
    newTimeNode.setAttribute('title', 'time');
    newMediaNode.setAttribute('title', 'media');
    newTimeNode.innerHTML = moment(lastModified).format('HH:mm:ss');
    newMediaNode.innerHTML = mediaENML;
    newNode.appendChild(newTimeNode);
    newNode.appendChild(newMediaNode);
    newNode.appendChild(newBrNode);
    return newNode;
  }

  _makeUpdatedNote(originalNote, bodyString, resources) {
    // update content
    let nBody = '<?xml version="1.0" encoding="UTF-8"?>';
    nBody += '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">';
    nBody += bodyString;
    nBody = this._removeUnnecessaryElements(nBody);

    // Create note object
    const newNote = new Evernote.Types.Note();
    newNote.title = originalNote.title;
    newNote.content = nBody;
    newNote.resources =
      originalNote.resources && originalNote.resources.length ? originalNote.resources.concat(resources) : resources;
    newNote.guid = originalNote.guid;
    return newNote;
  }

  _removeUnnecessaryElements(content) {
    return content
      .replace(/(<[hb]r[^>]*>)+<\/en-media>/gi, '</en-media>')
      .replace(/(&nbsp;)+<\/en-media>/gi, '</en-media>')
      .replace(/<\/en-todo>/gi, '')
      .replace(/<en-todo([^>]*)>/gi, '<en-todo$1 />')
      .replace(/<br>(<\/\s?br>)?/gi, '<br/>')
      .replace(/<hr>(<\/\s?hr>)?/gi, '<hr/>');
  }
}

const evernoteService = new EvernoteService();

module.exports = evernoteService;
