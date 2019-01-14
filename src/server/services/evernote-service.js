'use strict';
const crypto = require('crypto');
const Evernote = require('evernote');
const moment = require('moment');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const secret = require('../config/secret');
const dateService = require('./date-service');
const {SANDBOX, NOTEBOOK_NAME} = require('../config/app-config');
const authOptBase = {
  sandbox: SANDBOX,
  china: false
};

class EvernoteService {
  constructor() {
    // initialize OAuth
    this.client = new Evernote.Client({
      consumerKey: secret.evernote.consumerKey,
      consumerSecret: secret.evernote.consumerSecret,
      sandbox: SANDBOX, 
      china: false, // change to true if you wish to connect to YXBJ - most of you won't
    });
  }
  getRequestToken(callbackUrl) {
    return new Promise((resolve, reject) => {
      this.client.getRequestToken(callbackUrl, (error, oauthToken, oauthTokenSecret) => {
        if (error) {
          reject(error);
        } else {
          const authorizeUrl = this.client.getAuthorizeUrl(oauthToken)
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
            resolve(oauthToken);
          }
        });
    });
  }
  getUser (oauthToken) {
    const authOpt = Object.assign({}, authOptBase, {token: oauthToken});
    const authenticatedClient = new Evernote.Client(authOpt);
    const userStore = authenticatedClient.getUserStore();
    // return promise with user object
    return userStore.getUser();
  }

  getNoteStore (oauthToken) {
    if (!this.noteStore) {
      const authOpt = Object.assign({}, authOptBase, {token: oauthToken});
      const authenticatedClient = new Evernote.Client(authOpt);
      this.noteStore = authenticatedClient.getNoteStore();
    }
    return this.noteStore;
  }

  getDiaryNotebook (oauthToken, noteStore) {
    return new Promise((resolve, reject) => {
      if (!noteStore) {
        noteStore = this.getNoteStore(oauthToken);
      }
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
      const noteStore = this.getNoteStore(oauthToken);
      this.getDiaryNotebook(oauthToken).then((notebook) => {
        this.makeImageNote(oauthToken, notebook, data).then(resolve, reject);
      });
    });
  }

  makeImageNote(oauthToken, parentNotebook, file) {
    // - Search a note of today
    // - If the note was found
    //     - Get the body
    //     - Make new media
    //     - Make new <en-media/> tag of the media
    //     - Make date string of the media
    //     - Merge new tag and date into the body
    // - Else
    //     - Create new note

    return new Promise((resolve, reject) => {
      const newMoment = moment(file.lastModified);
      const title = newMoment.format('YYYY-MM-DD');

      const noteStore = this.getNoteStore(oauthToken);
      evernoteService.searchNotesWithTitle(noteStore, title).then((res) => {
        // Create resource
        const dataBuf = file.buffer;
        const hexHash = crypto.createHash('md5').update(dataBuf).digest('hex');

        const data = new Evernote.Types.Data();
        data.body = dataBuf;
        data.size = file.size;
        const resource = new Evernote.Types.Resource();
        resource.mime = file.mimetype;
        resource.data = data;
        const attr = new Evernote.Types.ResourceAttributes();
        attr.fileName = file.originalname;
        resource.attributes = attr;

        // Create body
        const nMedia = `<en-media hash="${hexHash}" type="${resource.mime}" />`;

        const notes = res.notes;
        if (notes && notes[0]) {
          // Already the note exists
          const theNote = notes[0];
          const noteStore = this.getNoteStore(oauthToken);
          noteStore.getNoteContent(theNote.guid).then((content) => {
            const dom = new JSDOM(content);
            const $times = dom.window.document.querySelectorAll('p[title="time"]');
            let hmsTimes = [];
            for (let i = 0, l = $times.length; i<l; i++) {
              hmsTimes.push($times[i].textContent);
            }
            // 新しいエントリーを挿入すべきノート中の位置
            const index = dateService.getIndexOfInsertPosition(hmsTimes, file.lastModified);
            // 新しいノードを作る
            const parentNode = dom.window.document.querySelector('en-note');
            const newTime = newMoment.format('HH:mm:ss');
            const newNode = dom.window.document.createElement('div');
            const newTimeNode = dom.window.document.createElement('p');
            const newMediaNode = dom.window.document.createElement('p');
            newNode.setAttribute('title', 'section');
            newTimeNode.setAttribute('title', 'time')
            newMediaNode.setAttribute('title', 'media')
            newTimeNode.innerHTML = newTime;
            newMediaNode.innerHTML = nMedia;
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

            // update content
            let nBody = '<?xml version="1.0" encoding="UTF-8"?>';
            nBody += '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">';
            nBody += dom.window.document.body.innerHTML;
            console.log(nBody);

            // Create note object
            const newNote = new Evernote.Types.Note();
            newNote.title = theNote.title;
            newNote.content = nBody;
            newNote.resources = theNote.resources.concat(resource);
            newNote.guid = theNote.guid;

            // Update the note
            noteStore.updateNote(newNote).then(resolve, reject);
          }, reject)
        } else {
          // Make new note

          // Make new body
          let nBody = '<?xml version="1.0" encoding="UTF-8"?>';
          nBody += '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">';
          nBody += '<en-note>';
          nBody += '<div title="section">';
          nBody += `<p title="time">${newMoment.format('HH:mm:ss')}</p>`;
          nBody += `<p title="media">${nMedia}</p>`;
          nBody += '</div>';
          nBody += "</en-note>";

          // Create note object
          const ourNote = new Evernote.Types.Note();
          ourNote.title = `${newMoment.format('YYYY-MM-DD')} [${newMoment.format('ddd').toUpperCase()}]`;
          ourNote.content = nBody;
          ourNote.resources = [resource];

          // parentNotebook is optional; if omitted, default notebook is used
          if (parentNotebook && parentNotebook.guid) {
            ourNote.notebookGuid = parentNotebook.guid;
          }

          // Attempt to create note in Evernote account (returns a Promise)
          noteStore.createNote(ourNote).then(resolve, reject);
        }
      }, reject);
    });
  }
}

const evernoteService = new EvernoteService();

module.exports = evernoteService;
