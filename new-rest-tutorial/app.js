var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const uuidv4 = require('uuid').v4; //after  npm install uuid
var { users, messages } = require('./models/index')

//npm install express-generator -g then express new-rest-tutorial --view=ejs

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// * Application-Level Middleware * //

// Third-Party Middleware

//app.use(cors());

// Built-In Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom Middleware

app.use((req, res, next) => {
  req.context = {
    models: {
      users,
      messages,
    },
    me: users[1],
  };
  next();
});


// * Routes * //
const newUserRouter =  require('./routes/newuser');
const messageRouter =  require('./routes/message');
const sessionRouter =  require('./routes/session');


app.use('/session', sessionRouter);
app.use('/users', newUserRouter);
app.use('/messages', messageRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;