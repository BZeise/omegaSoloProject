var express = require( 'express' );
var app = express();
var index = require( './modules/routes/index' );
var register = require('./modules/routes/register' );
// var items = require('./modules/routes/items' );
// add extra routes when needed

app.use(express.static('public'));
app.use( '/', index);
app.use( '/register', register);
// app.use( '/items', items);

var port = process.env.PORT || 7878;

app.listen( port, function() {
  console.log( 'server up on port:', port);
});
