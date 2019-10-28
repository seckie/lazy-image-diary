const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const evernoteService = require('../services/evernote-service.js');
const isAuthenticated = require('../middlewares/isAuthenticated');
const { MAX_FILE_SIZE, CALLBACK_URL } = require('../config/app-config');
const { MAX_UPLOAD_FILE_COUNT } = require('../../../config.json');

const multer = require('multer');
const storage = multer.memoryStorage(); // Don't use disk storage
const upload = multer({
  storage: storage,
  dest: 'uploads/',
  limits: {
    fileSize: MAX_FILE_SIZE
  }
}).array('fileData', MAX_UPLOAD_FILE_COUNT);

router.get('/oauth_signin', (req, res) => {
  const callbackUrl = req.query.callback_url || CALLBACK_URL;
  evernoteService.getRequestToken(callbackUrl).then(
    ({ oauthToken, oauthTokenSecret, authorizeUrl }) => {
      // req.session.oauthToken = oauthToken;
      // req.session.oauthTokenSecret = oauthTokenSecret;
      res.send({
        oauthToken: oauthToken,
        oauthTokenSecret: oauthTokenSecret,
        authorizeUrl: authorizeUrl
      });
    },
    error => {
      const err = createError(400, 'Failed to Evernote sign-in');
      res.send(error || err);
    }
  );
});

router.get('/oauth_callback', (req, res, next) => {
  evernoteService.getAccessToken(req).then(
    accessToken => {
      evernoteService.getUser(accessToken).then(
        user => {
          res.send({
            accessToken: accessToken,
            user: user
          });
        },
        error => {
          let message;
          switch (error.errorCode) {
            case 19:
              message =
                'Operation denied because the calling application has reached its hourly API call limit for this user.';
              break;
            default:
              message = 'evernoteService.getUser() failed';
          }
          console.log(message);
          res.status(400).send({
            message: message
          });
        }
      );
    },
    error => {
      console.log(error.message);
      res.status(400).send({
        message: error.message
      });
    }
  );
});

router.post(
  '/create_image_note',
  isAuthenticated,
  upload,
  (req, res, next) => {
    if (!req.body || !req.files) {
      console.log('No body or file');
      return res.status(400).send('No request body or file');
    }
    const token = req.headers.authorization.replace(/Bearer\s/, '') || req.session.oauthToken;
    const lastModifiedStrings = JSON.parse(req.body.fileLastModified);
    const dataset = req.files.map((file, i) => ({
      ...file,
      lastModified: parseInt(lastModifiedStrings[i], 10)
    }));
    evernoteService.createImageNotes(token, dataset).then(
      note => {
        res.send({
          success: true,
          note: note
        });
      },
      err => {
        res.status(400).send(err.message || err.parameter);
      }
    );
  },
  (err, req, res, next) => {
    // Upload error
    if (err) {
      res.status(400).send(err.message);
    }
  }
);

module.exports = router;
