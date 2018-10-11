var express = require( 'express' );
var app = express();
var index = require( './modules/routes/index' );
var register = require('./modules/routes/register' );
var users = require('./modules/routes/users' );
var stats = require('./modules/routes/stats' );
var quiz = require('./modules/routes/quiz' );
var questions = require('./modules/routes/questions' );
var leaderboard = require('./modules/routes/leaderboard' );
// add extra routes when they are needed
// green boxes are nice

app.use(express.static('public'));
app.use( '/', index );
app.use( '/register', register );
app.use( '/users', users );
app.use( '/stats', stats );
app.use( '/quiz', quiz );
app.use( '/questions', questions );
app.use( '/leaderboard', leaderboard );

var port = process.env.PORT || 7878;

app.listen( port, function() {
  console.log( 'server up on port:', port );
});
