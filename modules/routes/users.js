var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var user = require('../user');

router.use(bodyParser.urlencoded( {extended: true} ) );
router.use(bodyParser.json());

// post call to get currentUser
router.post('/', function(req, res) {
    user.findOne({
        username: req.body.username
    }).then(function(response) {
        res.send(response);
    });
});

module.exports = router;
