var express = require( 'express' );
var router = express.Router();
var bcrypt = require( 'bcrypt' );
var bodyParser = require( 'body-parser' );
var user = require( '../user' );

router.use( bodyParser.urlencoded( { extended: true } ) );
router.use( bodyParser.json() );

router.post('/', function( req, res) {
  console.log('in register.js, post to /, req.body is:', req.body);
  bcrypt.genSalt(12, function( err, salt) {
    if ( err ) {
      res.sendStatus( 400 );
    } else {
      bcrypt.hash( req.body.password, salt, function ( err, hash ) {
        if ( err ) {
          res.sendStatus( 400 );
        } else {
          var newUser = {
            username: req.body.username,
            password: hash
          };
          console.log('newUser is:', newUser);
          user(newUser).save();
          res.sendStatus( 201 );
        }
      });
    }
  });
});

module.exports = router;
