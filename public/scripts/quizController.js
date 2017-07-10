// console.log( 'quizController.js loaded' );

// declare app
var app = angular.module('myApp', ['ngRoute', 'ngMaterial']);

// declare config for ngRoute to show different pages
app.config(function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: "views/partials/landing.html",
    controller: "QuizController"
  }).when('/login', {
    templateUrl: "views/partials/login.html",
    controller: "QuizController"
  }).when('/register', {
    templateUrl: "views/partials/register.html",
    controller: "QuizController"
  }).when('/quiz', {
    templateUrl: "views/partials/quiz.html",
    controller: "QuizController"
  }).when('/quizLeader', {
    templateUrl: "views/partials/quizLeader.html",
    controller: "QuizController"
  }).when('/quizPlayer', {
    templateUrl: "views/partials/quizPlayer.html",
    controller: "QuizController"
  }).when('/quizEnd', {
    templateUrl: "views/partials/quizEnd.html",
    controller: "QuizController"
  });
});

// declare controller
app.controller('QuizController', QuizController);

function QuizController(QuizService, $location) {
  var vm = this;

  // quiz operation variables
  vm.currentQuestion = 0;
  vm.score = 0;
  vm.quizInProgress = false;

  // quiz option variables
  vm.numQuestions = 10;
  vm.category = '';
  vm.difficulty = '';
  vm.type = '';
  vm.lastAnswerWasCorrect = '';
  vm.firstQuestion = true;



  // beginQuiz function gets questions based on selected options
  // then, launches quiz
  vm.beginQuiz = function() {
    // console.log( 'in beginQuiz' );

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

    QuizService.getQuestions(apiString).then(function(response) {
      vm.questionsArray = QuizService.theQuestions;
      console.log('vm.questionsArray is: ', vm.questionsArray);

      // preps the next question
      vm.currentQuestion = -1;
      vm.nextQuestion();
      vm.quizInProgress = true;

      // timer
      vm.startTime = new Date();
      // console.log('startTime is:', vm.startTime);
    });
  }; // end beginQuiz

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

    // begin END QUIZ SCENARIO
    // check if quiz is over (no more questions left in array)
    if (vm.currentQuestion == vm.questionsArray.length) {
      console.log("End of quiz!");
      vm.qTS = {}; // clear qTS
      vm.go('/quizEnd');
      vm.quizInProgress = false;
      vm.lastAnswerWasCorrect = '';
      // timer
      vm.endTime = new Date();
      vm.totalTime = vm.endTime - vm.startTime;

      if (vm.currentUser) {
        vm.currentUser.userStats.totalQuizzes++;
        console.log('vm.currentUser.userStats is: ', vm.currentUser.userStats);
        QuizService.sendStats(vm.currentUser.userStats);
      } // increment user stats and send update
    } // end END QUIZ SCENARIO
    else {
      // take the next question from the provided array
      // vm.qts is vm.questionToShow
      vm.qTS = vm.questionsArray[vm.currentQuestion];

      // declare possibleAnswers, which will be all answers correct or not
      vm.qTS.possibleAnswers = vm.qTS.incorrect_answers;
      // console.log('this one:', vm.qTS.possibleAnswers);
      vm.qTS.possibleAnswers.push(vm.qTS.correct_answer);
      // console.log('or this one:', vm.qTS.possibleAnswers);
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
    // increment current quiz stats
    vm.score++;
    if (vm.currentUser) {
      vm.currentUser.userStats.correctAnswers++;
      vm.currentUser.userStats.totalAnswers++;
    } // increment user stats
  };

  vm.incorrect = function(wrongAnswer) {
    // console.log("Sorry,", wrongAnswer, "is incorrect!");
    vm.lastAnswerWasCorrect = false;
    vm.firstQuestion = false;
    vm.wrongAnswer = wrongAnswer;
    vm.rightAnswer = vm.qTS.correct_answer;
    console.log('right:', vm.rightAnswer, ', and wrong:', vm.wrongAnswer);

    if (vm.currentUser) {
      vm.currentUser.userStats.totalAnswers++;
    } // increment user stats
  };


  // general navigation function
  // contains logic to start quiz as QUIZLEADER if no current quiz is open
  vm.go = function(path) {
    // if you're starting a quiz...
    if (path == '/start') {
      // and if a quiz is NOT already in progress...
      if (vm.quizInProgress == false) {
        // then go to Quiz Leader Screen
        $location.path('/quizLeader');
      } else {
        // else go to Quiz Player Screen
        $location.path('/quizPlayer');
      }
    } else { // if not starting a quiz, just go to path
      $location.path(path);
    }
  }; // end vm.go

  vm.getOptions = function() {
    QuizService.getCategories().then(function(response) {
      vm.categories = QuizService.theCategories;
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
      QuizService.postRegister(credentials).then(function(response) {
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
    // console.log('vm.loginUser clicked!');
    var credentials = {
      username: vm.inputed.username,
      password: vm.inputed.password
    };  // assemble login details and pass to postLogin
    QuizService.postLogin(credentials).then(function(response) {
      // if log-in successful
      if (response.data == 'we got it') {
        // clear inputs
        vm.inputed.username = '';
        vm.inputed.password = '';
        // load currentUser object
        QuizService.getCurrentUser(credentials).then(function(){
            console.log('vm.currentUser is: ', QuizService.currentUser.data);
            vm.currentUser = QuizService.currentUser.data;

            // initialize user stat update object
            vm.currentUser.userStats = {
              correctAnswers : 0,
              totalAnswers : 0,
              wonQuizzes : 0 ,
              totalQuizzes : 0
            };
        });
        // start the quiz
        vm.go('/start');
      } else {
        swal("Whoah there!", "Wrong password?  Have you registered yet?", "error");
      } // end bad log in
    });
  };

  vm.logOut = function() {
    // clear currentUser object
    vm.currentUser = '';
    vm.go('/');
  };

}

app.filter('secondsToDateTime', function() {
  return function(seconds) {
    return new Date(1970, 0, 1).setSeconds(seconds);
  };
}); // time filter used in quiz end screen
