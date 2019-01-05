'use strict';
const crypto = require('crypto');
const Evernote = require('evernote');
const secret = require('../config/secret');
const {SANDBOX} = require('../config/app-config');

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
    const authenticatedClient = new Evernote.Client({
      token: oauthToken,
      sandbox: SANDBOX, 
      china: false,
    });
    const userStore = authenticatedClient.getUserStore();
    // return promise with user object
    return userStore.getUser();
  }

  createTodaysNoteWithImage (oauthToken, data) {
    return new Promise((resolve, reject) => {
      const authenticatedClient = new Evernote.Client({
        token: oauthToken,
        sandbox: SANDBOX,
        china: false,
      });
      const noteStore = authenticatedClient.getNoteStore();
      noteStore.listNotebooks().then((notebooks) => {
        const diary = notebooks.find((notebook) => {
          return notebook.name === 'Diary';
        });
        const noteData = {
          title: 'Todays image note',
          body: 'Hi! This is today.\n Foo Bar.',
          body2: 'Nothing.',
          file: data
        };
        this.makeImageNote(noteStore, noteData, diary).then(resolve, reject);
      }, reject);

    });
  }

  makeImageNote(noteStore, noteData, parentNotebook) {
    // Create resource
    const dataBuf = noteData.file.buffer;
    const hexHash = crypto.createHash('md5').update(dataBuf).digest('hex');

    const data = new Evernote.Types.Data();
    data.body = dataBuf;
    data.size = noteData.file.size;
    const resource = new Evernote.Types.Resource();
    resource.mime = noteData.file.mimetype;
    resource.data = data;
    const attr = new Evernote.Types.ResourceAttributes();
    attr.fileName = noteData.file.originalname;
    resource.attributes = attr;

    // - Search a note of today
    // - If the note was found
    //     - Get the body
    //     - Make new media
    //     - Make new <en-media/> tag of the media
    //     - Make date string of the media
    //     - Merge new tag and date into the body
    // - Else
    //     - Create new note

    // Create body
    let nBody = '<?xml version="1.0" encoding="UTF-8"?>';
    nBody += '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">';
    nBody += '<en-note>';
    nBody += noteData.body;
    nBody += '<br/>';
    nBody += new Date(noteData.file.lastModified).toString();
    nBody += '<div><en-media'
    nBody += ' hash="';
    nBody += hexHash;
    nBody += '"';
    nBody += ' type="';
    nBody += resource.mime;
    nBody += '"';
    nBody += ' /></div>';
    nBody += noteData.body2;
    nBody += "</en-note>";
    console.log(nBody);

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
}

const evernoteService = new EvernoteService();

module.exports = evernoteService;
