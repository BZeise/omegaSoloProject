var express = require('express');
var router = express.Router();

var quizInProgress = false;

router.get('/', function(req, res) {
    // console.log('hit in quiz.js GET, setting quizInProgress to true');
    res.send(quizInProgress);
    quizInProgress = true;
});

router.post('/', function(req, res) {
    // console.log('hit in quiz.js POST, setting quizInProgress to false');
    res.sendStatus(200);
    quizInProgress = false;
});

module.exports = router;
