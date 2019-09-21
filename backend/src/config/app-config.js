const appConfig = {
  SANDBOX: true, // change to false when you are ready to switch to production
  MAX_REQUEST_SIZE: 10000000,
  MAX_FILE_SIZE: 10000000,
  CALLBACK_URL: process.env.CALLBACK_URL || 'http://localhost:3001/oauth_callback',
  NOTEBOOK_NAME: 'Diary'
};

module.exports = appConfig;
