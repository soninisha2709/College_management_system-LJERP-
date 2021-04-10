var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//require('./src/db/conn');
var indexRouter = require('./routes/index');
var adminRouter = require('./routes/adminroutes');

const hbs = require('hbs');
const bodyParser = require('body-parser');
var app = express();


const templates_path = path.join(__dirname,'./templates/views');
const partialsFiles = path.join(__dirname,'./templates/partials');

// view engine setup
app.set('views', templates_path);
app.set('view engine', 'hbs');
hbs.registerPartials(partialsFiles);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '/public/')));

app.use('/', indexRouter);
app.use('/admin',adminRouter);


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
