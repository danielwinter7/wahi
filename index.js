var http = require('http');
var express = require('express');
var routes = require('./routes');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
//var session      = require('express-session');
var passwordHash = require('password-hash');

var app = express();

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({extended: true })); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
//app.use(session({ secret: 'ilovewahikaka' })); // session secret
//app.use(passport.initialize());
//app.use(session({cookie: { maxAge: 60000 }}));
app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);
app.get('/home', routes.home);
app.get('/home/show/:id', routes.show);
app.get('/home/delete/:id', routes.delete);
app.get('/login', routes.login);
app.get('/register', routes.register);
app.post('/register', routes.register.send);
app.post('/login', routes.login.send);

//REST-API

app.get('/api/wahis', routes.wahis);
app.get('/api/wahi/:id', routes.wahis.show);
app.get('/api/wahis/:email', routes.wahis.showUserWahis);
app.post('/api/wahis/add', routes.wahis.add);
app.post('/api/wahis/edit/:id', routes.wahis.save_edit);
app.get('/api/wahis/delete/:id', routes.wahis.delete);

app.get('/api/users', routes.users);
app.get('/api/user/:email', routes.users.show);
app.post('/api/users/add', routes.users.add);

app.get('/api/wahisteps/', routes.wahisteps);
app.post('/api/wahisteps/sum', routes.wahisteps.sum);
app.post('/api/wahisteps/add', routes.wahisteps.add);


app.get('/api/stepsbackup/', routes.stepsbackup);
app.post('/api/stepsbackup/add', routes.stepsbackup.add);
app.post('/api/stepsbackup/userDate', routes.stepsbackup.userDate);

app.get('*', function(req, res) {
	res.send("Incorrect route");
});

var server = app.listen(process.env.PORT || 3000, function() {
	console.log("listening");
});