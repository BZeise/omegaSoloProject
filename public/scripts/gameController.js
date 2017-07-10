// console.log( 'gameController.js loaded' );

// declare app
var app = angular.module('myApp', ['ngRoute', 'ngMaterial']);

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
  }).when('/gameEnd', {
    templateUrl: "views/partials/gameEnd.html",
    controller: "GameController"
  });
});

// declare controller
app.controller('GameController', GameController);

function GameController(GameService, $location) {
  var vm = this;

  // game operation variables
  vm.currentQuestion = 0;
  vm.score = 0;
  vm.gameInProgress = false;

  // game option variables
  vm.numQuestions = 10;
  vm.category = '';
  vm.difficulty = '';
  vm.type = '';
  vm.lastAnswerWasCorrect = '';
  vm.firstQuestion = true;

  // beginGame function gets questions based on selected options
  // then, launches game
  vm.beginGame = function() {
    // console.log( 'in beginGame' );

    // construct API string from selected options
    apiString = 'https://opentdb.com/api.php?amount=';
    apiString += vm.numQuestions;
    if (vm.category != '') {
      apiString += '&category=' + vm.category.id;
    }
    if (vm.difficulty != '') {
      apiString += '&difficulty=' + vm.difficulty;
    }
    if (vm.type != '') {
      apiString += '&type=' + vm.type;
    } // end apiString construction

    GameService.getQuestions(apiString).then(function(response) {
      vm.questionsArray = GameService.theQuestions;
      console.log('vm.questionsArray is: ', vm.questionsArray);

      // preps the next question
      vm.currentQuestion = -1;
      vm.nextQuestion();
      vm.gameInProgress = true;

      // timer
      vm.startTime = new Date();
      // console.log('startTime is:', vm.startTime);
    });
  }; // end beginGame

  vm.answer = function(answer) {
    if (answer == vm.qTS.correct_answer) {
      vm.correct();
      vm.nextQuestion();
    } else {
      vm.incorrect(answer);
      vm.nextQuestion();
    }
  }; // end answer

  vm.nextQuestion = function() {
    // increment question counter
    vm.currentQuestion++;

    // begin END GAME SCENARIO
    // check if game is over (no more questions left in array)
    if (vm.currentQuestion == vm.questionsArray.length) {
      console.log("End of game!");
      vm.qTS = {};
      // use vm.go to go to another view probably
      // and that would stop using this next line, which is totally janky
      vm.go('/gameEnd');
      // vm.qTS.question = "Score: " + vm.score + " / " + vm.questionsArray.length;
      vm.gameInProgress = false;
      vm.lastAnswerWasCorrect = '';

      // timer
      vm.endTime = new Date();
    } // end END GAME SCENARIO
    else {
      // take the next question from the provided array
      // vm.qts is vm.questionToShow
      vm.qTS = vm.questionsArray[vm.currentQuestion];
      // console.log('this one:', vm.qTS);


      // declare possibleAnswers, which will be all answers correct or not
      vm.qTS.possibleAnswers = vm.qTS.incorrect_answers;
      // console.log('this one:', vm.qTS.possibleAnswers);
      vm.qTS.possibleAnswers.push(vm.qTS.correct_answer);
      // console.log('this one:', vm.qTS.possibleAnswers);
      // something weird here!  What's the difference between those two logs?!

      // shuffles the order to hide the correct_answer
      vm.qTS.possibleAnswers.sort(function() {
        return 0.5 - Math.random();
      });
    }

  }; // end vm.nextQuestion

  vm.correct = function() {
    // console.log("You're right!");
    vm.lastAnswerWasCorrect = true;
    vm.firstQuestion = false;
    vm.rightAnswer = vm.qTS.correct_answer;
    // increment current game stats
    vm.score++;
    // increment user stats
  };

  vm.incorrect = function(wrongAnswer) {
    // console.log("Sorry,", wrongAnswer, "is incorrect!");
    vm.lastAnswerWasCorrect = false;
    vm.firstQuestion = false;
    vm.wrongAnswer = wrongAnswer;
    vm.rightAnswer = vm.qTS.correct_answer;
    console.log('right:', vm.rightAnswer, ', and wrong:', vm.wrongAnswer);
    // increment current game stats (just totals)
    // increment user stats (just totals)
  };


  // general navigation function
  // contains logic to start game as GAMELEADER if no current game is open
  vm.go = function(path) {
    // if you're starting a game...
    if (path == '/start') {
      // and if a game is NOT already in progress...
      if (vm.gameInProgress == false) {
        // then go to Game Leader Screen
        $location.path('/gameLeader');
      } else {
        // else go to Game Player Screen
        $location.path('/gamePlayer');
      }
    } else { // if not starting a game, just go to path
      $location.path(path);
    }
  }; // end vm.go

  vm.getOptions = function() {
    GameService.getCategories().then(function(response) {
      vm.categories = GameService.theCategories;
    });
  }; // end vm.getOptions


  // LOG IN CODE

  vm.registerUser = function() {
    console.log('vm.registerUser clicked!');
    if (vm.inputed.password !== vm.inputed.password2) {
      swal("Whoops!", "Passwords don't match!", "error");
    } else {
      var credentials = {
        username: vm.inputed.username,
        password: vm.inputed.password
      };
      GameService.postRegister(credentials).then(function(response) {
        if (response.status == 201) {
          vm.go('/');
          vm.inputed.username = '';
          vm.inputed.password = '';
          vm.inputed.password2 = '';
        } else {}
      });
    }
  };

  vm.loginUser = function() {
    console.log('vm.loginUser clicked!');
    var credentials = {
      username: vm.inputed.username,
      password: vm.inputed.password
    };
    GameService.postLogin(credentials).then(function(response) {
      if (response.data == 'we got it') {
        vm.go('/start');
        vm.name = credentials.username;
        // console.log('in vm.loginUser', vm.name, credentials.username);
        // console.log('credentials is: ', credentials);
        // console.log('response is:', response);

        vm.inputed.username = '';
        vm.inputed.password = '';
        // vm.currentUser = GameService.getCurrentUser();
        GameService.getCurrentUser().then(function(){
            console.log('vm.currentUser is: ', GameService.currentUser);
        });
      } else {
        swal("Whoah there!", "Wrong password?  Have you registered yet?", "error");
      }
    });
  };

  vm.logOut = function() {
    vm.name = '';
    vm.go('/');
  };

  // END LOG IN CODE


}

app.filter('secondsToDateTime', function() {
  return function(seconds) {
    return new Date(1970, 0, 1).setSeconds(seconds);
  };
}); // time filter used in game end screen
