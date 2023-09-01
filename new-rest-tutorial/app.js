var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const uuidv4 = require('uuid').v4; //after  npm install uuid

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


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

app.use('/', indexRouter);
// app.use('/users', usersRouter);

//TUTORIAL CODE

//resource

let users = {
  1: {
    id: '1',
    username: 'Robin Wieruch',
  },
  2: {
    id: '2',
    username: 'Dave Davids',
  },
};

let messages = {
  1: {
    id: '1',
    text: 'Hello World',
    userId: '1',
  },
  2: {
    id: '2',
    text: 'By World',
    userId: '2',
  },
};

//middleware to determine what user is sending messages
app.use((req, res, next) => {
  req.me = users[1];
  next();
});
//route to get the pseudo authenticated user
app.get('/session', (req, res) => {
  return res.send(users[req.me.id]);
});

app.get('/users', (req, res) => {
  return res.send(Object.values(users));
});

app.get('/users/:userId', (req, res) => {
  return res.send(users[req.params.userId]);
});

/*
conversion for some types:
const date = Date.parse(req.body.date);
const count = Number(req.body.count);
 */

app.get('/messages', (req, res) => {
  return res.send(Object.values(messages));
});

app.get('/messages/:messageId', (req, res) => {
  return res.send(messages[req.params.messageId]);
});

app.post('/messages', (req, res) => {
  const id = uuidv4();
  const message = {
    id,
    text: req.body.text,
    userId: req.me.id,
  };

  messages[id] = message;

  return res.send(message);
});

app.delete('/messages/:messageId', (req, res) => {
  const {
    [req.params.messageId]: message,
    ...otherMessages
  } = messages;

  messages = otherMessages;

  return res.send(message);
});

app.post('/users', (req, res) => {
  return res.send('Received a POST HTTP method queen');
});

//making put and delete restful 
app.put('/users/:userId', (req, res) => {
  return res.send(
    `PUT HTTP method on user/${req.params.userId} resource`,
  );
});

app.delete('/users/:userId', (req, res) => {
  return res.send(
    `DELETE HTTP method on user/${req.params.userId} resource`,
  );
});

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
