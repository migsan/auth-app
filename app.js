var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');

var mongoose = require('mongoose');
var passport = require('passport');

var routes = require('./routes');

require('./models/user');
require('./passport')(passport);

console.log(routes.index);

var port = process.env.PORT || '3000';

// connect to DB
mongoose.connect('mongodb://admin:pass@ds011389.mlab.com:11389/mongotutdb', ['auth-app'], function(err, res) {
    if ( err ) {
        throw err;
    }
    console.log('Connection successful to the db');
});

var app = express();


app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// Get to the root
app.get('/', routes.index);

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// Get to twitter auth
app.get('/auth/twitter', passport.authenticate('twitter'));
// Redirect when success on twitter login
app.get('/auth/twitter/callback', passport.authenticate('twitter',
  { successRedirect: '/', failureRedirect: '/login' }
));


app.listen(port);
console.log('Up and running on ' + port);
