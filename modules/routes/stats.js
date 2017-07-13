var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var user = require('../user');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// post call to get currentUser
router.put('/', function(req, res) {
  // Find the existing resource by Mongo _id
  user.findById(req.body._id, function(err, stats) {
    // console.log('req.body._id is:', req.body._id);
    // Handle any possible database errors
    if (err) {
      res.status(500).send(err);
    } else {
      // console.log('in stats.js, "stats" return is:', stats);
      // Update each attribute with any possible attribute that may have been submitted in the body of the request
      // If that attribute isn't in the request body, default back to whatever it was before.
      stats.correctAnswers += req.body.userStats.correctAnswers;
      stats.totalAnswers += req.body.userStats.totalAnswers;
      stats.wonQuizzes += req.body.userStats.wonQuizzes;
      stats.totalQuizzes += req.body.userStats.totalQuizzes;
      // console.log('in stats.js, "stats after change is"', stats);

      // Save the updated document back to the database
      stats.save(function(err, stats) {
        if (err) {
          res.status(500).send(err);
        }
        res.send(stats);
      });
    }
  });
});

module.exports = router;
