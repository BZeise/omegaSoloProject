// console.log( 'gameController.js loaded' );

// declare app
var app = angular.module('myApp', ['ngRoute']);

// declare config for ngRoute to show different pages
app.config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: "views/partials/landing.html",
        controller: "GameController"
    }).when('/login', {
        templateUrl: "views/partials/login.html",
        controller: "GameController"
    }).when('/register', {
        templateUrl: "views/partials/register.html",
        controller: "GameController"
    }).when('/game', {
        templateUrl: "views/partials/game.html",
        controller: "GameController"
    }).when('/gameLeader', {
        templateUrl: "views/partials/gameLeader.html",
        controller: "GameController"
    }).when('/gamePlayer', {
        templateUrl: "views/partials/gamePlayer.html",
        controller: "GameController"
    });
});

// declare controller
app.controller('GameController', GameController);

function GameController(GameService, $location) {
  var vm = this;

  currentQuestion = 0;
  score = 0;
  vm.gameInProgress = false;
  vm.userState = '';

  vm.beginGame = function() {
    // console.log( 'in beginGame' );
    GameService.getQuestions().then(function(response){
      vm.questionsArray = GameService.theQuestions;
      console.log('vm.questionsArray is: ', vm.questionsArray);

      // just picking one question for now, forcing type: "multiple"
      // need to figure out how to iterate through, one at a time
      currentQuestion = -1;
      vm.nextQuestion();
      vm.gameInProgress = true;
    });
  }; // end beginGame

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
      // use vm.go to go to another view probably
      vm.qTS.question = "Score: " + score + " / " + vm.questionsArray.length;
      vm.gameInProgress = false;
    } // end END GAME SCENARIO
    else {
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
    score++;
    // increment user stats
  };

  vm.incorrect = function() {
    console.log("Sorry, incorrect!");
    // increment current game stats (just totals)
    // increment user stats (just totals)
  };


  // general navigation function
  // contains logic to start game as GAMELEADER if no current game is open
  vm.go = function(path) {
    // if you're starting a game...
    if( path == '/start' ) {
      // and if a game is NOT already in progress...
      if ( vm.gameInProgress == false ) {
        // then go to Game Leader Screen
        $location.path('/gameLeader');
      } else {
        // else go to Game Player Screen
        $location.path('/gamePlayer');
      }
    } else {// if not starting a game, just go to path
      $location.path(path);
    }
  };

  vm.getOptions = function() {
    GameService.getCategories().then(function(response){
      vm.categories = GameService.theCategories;
    });
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
