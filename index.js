var http = require('http');
var express = require('express');
var routes = require('./routes');
var path = require('path');
var app = express();
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({extended: true })); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'iloveswahikaka' })); // session secret
app.use(passport.initialize());
app.use(session({cookie: { maxAge: 60000 }}));
app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);
app.get('/home', routes.home);
app.get('/home/show/:id', routes.show);
app.get('/home/delete/:id', routes.delete);
app.get('/login', routes.login);
app.get('/register', routes.register);
app.post('/register', routes.register.send);

//REST-API
app.get('/wahis', routes.wahis);
app.get('/wahis/:id', routes.wahis.show);
//update, save_edit
app.post('/wahis/edit/:id', routes.wahis.save_edit);
app.get('/wahis/delete/:id', routes.wahis.delete);

app.get('*', function(req, res) {
	res.send("Incorrect route");
});

var server = app.listen(3000, function() {
	console.log("listening");
});