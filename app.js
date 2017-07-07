var express = require( 'express' );
var app = express();
var index = require( './modules/routes/index' );
var register = require('./modules/routes/register' );
var users = require('./modules/routes/users' );
// add extra routes when needed

app.use(express.static('public'));
app.use( '/', index );
app.use( '/register', register );
app.use( '/users', users );

var port = process.env.PORT || 7878;

app.listen( port, function() {
  console.log( 'server up on port:', port);
});
