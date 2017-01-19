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
app.get('/wahis', routes.wahis);
app.get('/wahi/:id', routes.wahis.show);
app.get('/wahis/:email', routes.wahis.showUserWahis);
app.post('/wahis/add', routes.wahis.add);
app.post('/wahis/edit/:id', routes.wahis.save_edit);
app.get('/wahis/delete/:id', routes.wahis.delete);

app.get('/users', routes.users);
app.get('/user/:email', routes.users.show);
app.post('/users/add', routes.users.add);


//app.get('/wahisteps/', routes.wahisteps);
app.post('/wahisteps/sum', routes.wahisteps.sum);
app.post('/wahisteps/add', routes.wahisteps.add);


app.get('/stepsbackup/', routes.stepsbackup);
app.post('/stepsbackup/add', routes.stepsbackup.add);
app.post('/stepsbackup/userDate', routes.stepsbackup.userDate);

app.get('*', function(req, res) {
	res.send("Incorrect route");
});

var server = app.listen(process.env.PORT || 3000, function() {
	console.log("listening");
});