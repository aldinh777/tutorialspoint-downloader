var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var childProcess = require('child_process');

var indexRouter = require('./routes/index');
var chatRouter = require('./routes/chat');

var app = express();
var wgetBusy = false;
var wgetClose = (code)=> {
  wgetBusy = false;
  console.log("Wget Closed With Code : "+code);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'www.tutorialspoint.com'), {
  index: ['index.html', 'index.htm'],
  lastModified: true
}));
app.use('/LearningDir', express.static(path.join(__dirname, 'LearningDir')));

app.use('/', indexRouter);
app.use('/chat', chatRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Wget Integration
  if(wgetBusy) {
    console.log('Debug::busy wgetBusy:'+wgetBusy);
  }
  else if( req.path[req.path.length -1] == '/' ) {
    console.log('Debug::directory wgetBusy:'+wgetBusy);
    childProcess.exec('wget -np -r -p -k -U "Mozilla Firefox" -e robots=off https://www.tutorialspoint.com'+req.path+'index.htm').on('close', wgetClose);
    wgetBusy = true;
  }
  else {
    console.log('Debug::file wgetBusy:'+wgetBusy);
    childProcess.exec('wget -np -r -p -k -U "Mozilla Firefox" -e robots=off https://www.tutorialspoint.com'+req.path).on('close', wgetClose);
    wgetBusy = true;
  }

  // render the error page
  res.status(err.status || 500);
  res.render('error', {error: err});
});

module.exports = app;
