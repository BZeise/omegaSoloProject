var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var user = require('../user');


router.use(bodyParser.urlencoded( {extended: true} ) );
router.use(bodyParser.json());

// mongoose.connect( 'localhost:27017/LightningRound' );

// var userSchema = new mongoose.Schema({
//   username: String,
//   password: String,
//   totalQuizzes: { type: Number, default: 0 },
//   wonQuizzes: { type: Number, default: 0 },
//   totalAnswers: { type: Number, default: 0 },
//   correctAnswers: { type: Number, default: 0 }
// });
//
// var userModel = mongoose.model( 'userModel', userSchema);
//
router.get('/', function(req, res) {
    console.log('in users.js, get to /, req.body is:', req.body);
    console.log('in users.js, get to /, user.userModel is:', user);
    user.find().then(function(response) {
        res.send(response);
    });
});

// module.exports = userModel;
module.exports = router;
// module.exports = exportThese;