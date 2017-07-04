// console.log( 'gameController.js loaded' );

// declare app
var app = angular.module('myApp', ['ngRoute']);

// declare config for ngRoute to show different pages
app.config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: "views/partials/game.html",
        controller: "GameController"
    // }).when('/register', {
    //     templateUrl: "views/partials/register.html",
    //     controller: "GameController"
    // }).when('/loggedIn', {
    //     templateUrl: "views/partials/loggedIn.html",
    //     controller: "GameController"
    });
});

// declare controller
app.controller('GameController', GameController);

function GameController(GameService) {  // add in , $location eventually
  var vm = this;

  currentQuestion = 0;

  vm.showQuestions = function() {
    // console.log( 'in showQuestions' );
    GameService.getQuestions().then(function(response){
      vm.questionsArray = GameService.theQuestions;
      console.log('vm.questionsArray is: ', vm.questionsArray);

      // just picking one question for now, forcing type: "multiple"
      // need to figure out how to iterate through, one at a time
      currentQuestion = -1;
      vm.nextQuestion();

    });
  }; // end showQuestions

  vm.answer = function(answer) {
    if (answer == vm.qTS.correct_answer) {
      vm.correct();
      vm.nextQuestion();
    } else {
      vm.incorrect();
      vm.nextQuestion();
    }
  }; // end answer

  vm.nextQuestion = function() {
    // increment question counter
    currentQuestion++;
    if (currentQuestion == vm.questionsArray.length) {
      console.log("End of game!");
      vm.qTS = {};
    } else {
      // take the next question from the provided array
      // vm.qts = vm.questionToShow
      vm.qTS = vm.questionsArray[currentQuestion];

      // declare possibleAnswers, which will be all answers correct or not
      vm.qTS.possibleAnswers = vm.qTS.incorrect_answers;
      vm.qTS.possibleAnswers.push(vm.qTS.correct_answer);

      // shuffles the order to hide the correct_answer
      vm.qTS.possibleAnswers.sort(function() {
        return 0.5 - Math.random();
      });
    }
    // vm.reload();
  }; // end vm.nextQuestion

  vm.correct = function() {
    console.log("You're right!");
    // increment current game stats
    // increment user stats
  };

  vm.incorrect = function() {
    console.log("Sorry, incorrect!");
    // increment current game stats (just totals)
    // increment user stats (just totals)
  };

  // vm.showSearch = function() {
  //   console.log( 'in showSearch' );
  //   GameService.getSearch(vm.searchInput).then(function(response){
  //     // console.log('in GameService.getSearch, response it:', response);
  //     vm.questionsArray = GameService.searchGif;
  //
  //   });
  // };

}
