var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var user = require('../user');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// post call to get currentUser
router.put('/', function(req, res) {
  // This would likely be inside of a PUT request, since we're updating an existing document, hence the req.params.todoId.
  // Find the existing resource by ID

  console.log('here it is, req.params', req.params);
  // user.findById(req.params.todoId, function(err, stats) {
  //   console.log('req.params.todoId is:', req.params.todoId);
  //   // Handle any possible database errors
  //   if (err) {
  //     res.status(500).send(err);
  //   } else {
  //     // Update each attribute with any possible attribute that may have been submitted in the body of the request
  //     // If that attribute isn't in the request body, default back to whatever it was before.
  //     stats.correctAnswers = req.body.correctAnswers || stats.correctAnswers;
  //     stats.totalAnswers = req.body.totalAnswers || stats.totalAnswers;
  //     stats.wonQuizzes = req.body.wonQuizzes || stats.wonQuizzes;
  //     stats.totalQuizzes = req.body.totalQuizzes || stats.totalQuizzes;
  //
  //     // Save the updated document back to the database
  //     stats.save(function(err, stats) {
  //       if (err) {
  //         res.status(500).send(err);
  //       }
  //       res.send(stats);
  //     });
  //   }
  // });
});

module.exports = router;
