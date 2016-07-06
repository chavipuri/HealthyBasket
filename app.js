var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var ibmdb = require('ibm_db');
//Chitra's
var session = require('express-session');
var config = require('./config/oauth')
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// Passport session setup.
passport.serializeUser(function(user, done) {
done(null, user);
});

passport.deserializeUser(function(obj, done) {
done(null, obj);
});

// config
passport.use(new FacebookStrategy({
 clientID: config.facebook.clientID,
 clientSecret: config.facebook.clientSecret,
 callbackURL: config.facebook.callbackURL
},
function(accessToken, refreshToken, profile, done) {
 process.nextTick(function () {
   return done(null, profile);
 });
}
));

// config
passport.use(new TwitterStrategy({
 consumerKey: config.twitter.consumerKey,
 consumerSecret: config.twitter.consumerSecret,
 callbackURL: config.twitter.callbackURL
},
function(accessToken, refreshToken, profile, done) {
 process.nextTick(function () {
   return done(null, profile);
 });
}
));

//Chitra's


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
//Chitra's
//app.use(express.session());
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(passport.initialize());
app.use(passport.session());
//Chitra's
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
var db2;


// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

if (process.env.VCAP_SERVICES) {
    var env = JSON.parse(process.env.VCAP_SERVICES);
    db2 = env['sqldb'][0].credentials;
}
else {
   db2 = {
        db: "BLUDB",
        hostname: "xxxx",
        port: 50000,
        username: "xxx",
        password: "xxx"
     };
}

var connString = "DRIVER={DB2};DATABASE=" + db2.db + ";UID=" + db2.username + ";PWD=" + db2.password + ";HOSTNAME=" + db2.hostname + ";port=" + db2.port;

app.get('/', routes.index);
app.get('/index', routes.index);

app.post('/search', routes.search(ibmdb,connString)); 
app.get('/search', routes.search(ibmdb,connString));

app.post('/menu/:name', routes.menu(ibmdb,connString));
app.get('/menu/:name', routes.menu(ibmdb,connString));

app.get('/checkout', routes.checkout);
app.post('/checkout', routes.checkout);
//app.post('/checkout', routes.insertpayment(ibmdb,connString));
app.get('/finalpage', routes.finalpage);
app.post('/finalpage', routes.insertpayment(ibmdb,connString));


app.get('/aboutus', routes.about);
app.get('/contact', routes.contact);

//Chitra's
var sess;
app.get('/signup', routes.signup(ibmdb,connString));
app.post('/signup', routes.insert(ibmdb,connString));
app.get('/signin', routes.signin(ibmdb,connString));
app.post('/signin', routes.verify(ibmdb,connString));
app.get('/auth/facebook',
passport.authenticate('facebook'),
function(req, res){
});
app.get('/auth/facebook/callback',
passport.authenticate('facebook', { failureRedirect: '/' }),
function(req, res) {
	sess=req.session;  
 	var user = req.user;
 	var username = user.displayName;
 	sess.username = username;
 res.redirect('/checkout');
});

app.get('/auth/twitter',
passport.authenticate('twitter'),
function(req, res){
});
app.get('/auth/twitter/callback',
passport.authenticate('twitter', { failureRedirect: '/' }),
function(req, res) {
	sess=req.session;  
 	var user = req.user;
 	var username = user.displayName;
 	sess.username = username;
 res.redirect('/checkout');
});


app.get('/logout', function(req, res){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
  // destroy the user's session to log them out                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
  // will be re-created next request 
   req.logout();
  req.session.destroy(function(){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
    res.redirect('/');                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
  });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
});              

//Chitra's

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port' + app.get('port'));
});

 