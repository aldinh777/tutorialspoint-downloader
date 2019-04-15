var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var childProcess = require('child_process');
var debug = require('debug')('tutorialsdownloader:wget');

var indexRouter = require('./routes/index');

var app = express();
var wgetBusy = false;
var wgetClose = (code)=> {
  wgetBusy = false;
  debug("Closed With Code : "+code);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use((req, res, next) => {
  const match = req.url.match(/(.+)\@(.+)/);
  if (match) {
    debug("new URL " + match[1]);
	req.url = match[1];
  }
  next();
});
app.use(express.static(path.join(__dirname, 'www.tutorialspoint.com'), {
  index: ['index.html', 'index.htm'],
  lastModified: true
}));

app.use('/', indexRouter);

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
    debug('status : busy | wgetBusy:'+wgetBusy);
  }
  else {
    const wgetQuery = 'wget --no-check-certificate -np -r -p -k -U "Mozilla Firefox" -e robots=off https://www.tutorialspoint.com';
    const path = (req.path[req.path.length - 1] == '/') ? req.path + 'index.htm' : req.path;
    debug('status : file | wgetBusy:' + wgetBusy);
	debug('cmd : ' + wgetQuery + path)
    childProcess.exec(wgetQuery + path).on('close', ()=> {
      childProcess.exec('ruby bin/wgetfixer.rb ' + req.path, (err, stdout, stderr) => {
		  if (err) {
			debug(`exec error: ${error}`);
			return;
		  }
		  debug(`stdout: ${stdout}`);
		  debug(`stderr: ${stderr}`);  
	  }).on('close', wgetClose);
    });
    wgetBusy = true;
  }

  // render the error page
  res.status(err.status || 500);
  res.render('error', {error: err});
});

module.exports = app;
