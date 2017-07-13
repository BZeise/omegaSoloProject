var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var user = require('../user');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

function finisherInfo(username, score, time) {
    this.username = username;
    this.score = score;
    this.time = time;
}

var leaderboardArray = [];

router.get('/', function(req, res) {
    res.send(leaderboardArray);
});

router.post('/', function(req, res) {
  // console.log('in leaderboard.js, leaderboardArray is: ', leaderboardArray);
    leaderboardArray.push(req.body);
    res.send(leaderboardArray);
  // console.log('after push, leaderboardArray is: ', leaderboardArray);
});

router.delete('/', function(req, res) {
    leaderboardArray = [];
    res.sendStatus(200);
});

module.exports = router;
