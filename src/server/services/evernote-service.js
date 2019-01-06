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
    return noteStore.findNotesMetadata(filter, 0, 100, spec);
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
    const noteData = {
      title: 'Todays image note',
      body: 'Hi! This is today.\n Foo Bar.',
      body2: 'Nothing.',
      file: file
    };

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
          const noteStore = this.getNoteStore(oauthToken);
          const guid = notes[0].guid;
          noteStore.getNoteContent(guid).then((content) => {
            const dom = new JSDOM(content);
            const $times = dom.window.document.querySelectorAll('p.time');
            let hmsTimes = [];
            for (let i = 0, l = $times.length; i<l; i++) {
              hmsTimes.push($times.textContent);
            }
            const index = dateService.getIndexOfInsertPosition(hmsTimes, file.lastModified);

            const targetNode = $times[index];
            const parentNode = dom.window.document.querySelector('en-note');
            const newTime = newMoment.format('HH:mm:ss');
            const newNode = dom.window.document.createElement('div');
            const newTimeNode = dom.window.document.createElement('p');
            const newMediaNode = dom.window.document.createElement('p');
            newNode.className = 'section';
            newTimeNode.innerHTML = newTime;
            newMediaNode.innerHTML = nMedia;
            newNode.appendChild(newTimeNode);
            newNode.appendChild(newMediaNode);
            parentNode.insertBefore(newNode, targetNode);

            // update content
            let nBody = '<?xml version="1.0" encoding="UTF-8"?>';
            nBody += '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">';
            nBody += dom.window.document.body.innerHTML;
            // Update the note
            // ...
            // ...
          }, reject)
        } else {
          // Make new note

          // Make new body
          let nBody = '<?xml version="1.0" encoding="UTF-8"?>';
          nBody += '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">';
          nBody += '<en-note>';
          nBody += '<div class="section">';
          nBody += `<p class="time">${d.format('HH:mm:ss')}</p>`;
          nBody += `<p>${nMedia}</p>`;
          nBody += '</div>';
          nBody += "</en-note>";

          // Create note object
          const ourNote = new Evernote.Types.Note();
          ourNote.title = noteData.title;
          ourNote.content = nBody;
          ourNote.resources = [resource];

          // parentNotebook is optional; if omitted, default notebook is used
          if (parentNotebook && parentNotebook.guid) {
            ourNote.notebookGuid = parentNotebook.guid;
          }

          // Attempt to create note in Evernote account (returns a Promise)
          return noteStore.createNote(ourNote);
        }
        resolve(notes);
      }, reject);
    });
  }
}

const evernoteService = new EvernoteService();

module.exports = evernoteService;
