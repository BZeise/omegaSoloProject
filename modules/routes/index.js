var express = require('express');
var router = express.Router();
var path = require('path');
// var bcrypt = require('bcrypt');  // did this fail to install?
var bodyParser = require('body-parser');
// var user = require('../user'); // add in user route

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

router.get('/', function(req, res) {
    console.log('base url hit');
    res.sendFile(path.resolve('public/views/index.html'));
});

// router.post('/', function(req, res) {
//     user.findOne({
//         username: req.body.username
//     }, function(err, user) {
//         if (err) {
//             res.send('we don\'t got it');
//         } else {
//             if (user != undefined) {
//                 bcrypt.compare(req.body.password, user.password, function(err, isMatch) {
//                     if (err) {
//                         res.send('we don\'t got it');
//                     } else {
//                         if (isMatch) {
//                             res.send('we got it');
//                         } else {
//                             res.send('we don\'t got it');
//                         }
//                     }
//                 });
//             } else {
//                 res.send('we don\'t got it');
//             }
//         }
//     });
// });  ---- USE THIS TO LOG IN?

module.exports = router;
