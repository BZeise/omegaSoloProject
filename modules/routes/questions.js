var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
// var user = require('../user');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var questionsToShare = '';

router.get('/', function(req, res) {
    res.send(questionsToShare);
});

router.post('/', function(req, res) {
    questionsToShare = req.body;
    res.send(questionsToShare);
});

router.delete('/', function(req, res) {
    questionsToShare = '';
    res.sendStatus(200);
});

module.exports = router;
