var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var colletionRouter = require('./routes/collection')
var brandsRouter = require('./routes/brands')
var watchesRouter = require('./routes/watches')
var reviewsRouter = require('./routes/reviews')

app.use((cors))
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// MongoDB connection

mongoose.connect('mongodb://127.0.0.1:27017/ecommerce')
  .then(() => console.log('Connected!'))
  .catch((err) => console.error('Connection error:', err.message));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/brands', brandsRouter);
app.use('/collections', colletionRouter);
app.use('/watches', watchesRouter);
app.use('/reviews', reviewsRouter);

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
