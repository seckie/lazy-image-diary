const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const path = require('path');
const session = require('express-session');

const secret = require('./config/secret.js');
const {MAX_REQUEST_SIZE} = require('./config/app-config');

const indexRouter = require('./routes/index');

const app = express();

// session
const sessionConfig = {
  secret: secret.session.secret,
  name: secret.session.name,
  resave: true,
  saveUninitialized: false
};
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sessionConfig.cookie = {
    secure: true // serve secure cookies
  };
}
app.use(session(sessionConfig));

// upload file size limit
const requestBodyConfig = {
  limit: MAX_REQUEST_SIZE,
  extended: true
};
app.use(bodyParser.json(requestBodyConfig));
app.use(bodyParser.urlencoded(requestBodyConfig));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', '..', 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
