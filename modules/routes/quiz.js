var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
// var user = require('../user');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var quizInProgress = false;

router.get('/', function(req, res) {
    console.log('hit in quiz.js GET, setting quizInProgress to true');
    res.send(quizInProgress);
    quizInProgress = true;
});

router.post('/', function(req, res) {
    console.log('hit in quiz.js POST, setting quizInProgress to false');
    res.sendStatus(200);
    quizInProgress = false;
});

module.exports = router;
