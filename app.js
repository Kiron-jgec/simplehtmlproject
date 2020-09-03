var createError = require('http-errors');
var express = require('express');
var multer = require('multer');
var bodyParser=require('body-parser');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser=require('body-parser');
var upload= require("express-fileupload");
var session =require('express-session');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(upload());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()).use(bodyParser.urlencoded({extended:true}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(session({
  secret: 'MQz_x2^=&f*pa5@BzpSB',
  resave: false,
  saveUninitialized: true,
 
}));

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





//Image upload









module.exports = app;
