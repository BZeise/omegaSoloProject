// console.log( 'quizController.js loaded' );

// declare app
var app = angular.module('myApp', ['ngRoute', 'ngMaterial', 'ngSanitize']);

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
  }).when('/statsPage', {
    templateUrl: "views/partials/statsPage.html",
    controller: "QuizController"
  });
});

// declare controller
app.controller('QuizController', QuizController);

function QuizController(QuizService, $location, $mdDialog) {
  var vm = this;

  vm.status = '  ';
  vm.customFullscreen = false;

  // quiz operation variables
  vm.currentQuestion = 0;
  vm.score = 0;

  // quiz option variables
  vm.numQuestions = 10;
  vm.numQuestionsArray = [5,10,15,20,25,50];
  vm.category = '';
  vm.difficulty = '';
  vm.type = '';
  vm.lastAnswerWasCorrect = '';
  vm.firstQuestion = true;

  // beginQuiz function gets questions based on selected options
  // then, launches quiz
  vm.beginQuiz = function() {
    // console.log( 'in beginQuiz' );
    vm.score = 0; // reset score
    vm.firstQuestion = true;

    if (vm.currentUser) { // if logged in, re/initialize
      vm.currentUser.userStats = {
        correctAnswers: 0,
        totalAnswers: 0,
        wonQuizzes: 0,
        totalQuizzes: 0
      };
    }
    QuizService.clearLeaderboard();

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
    } // end apiString construction, send to service to getQuestions

    QuizService.getQuestions(apiString).then(function(response) {
      vm.questionsArray = QuizService.theQuestions;
      console.log('vm.questionsArray is', vm.questionsArray);
      QuizService.shareTheQuestions(vm.questionsArray);

      // preps the next question
      vm.currentQuestion = -1;
      vm.nextQuestion();

      // timer
      vm.startTime = new Date();
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
    vm.firstQuestion = false;
  }; // end answer

  vm.nextQuestion = function() {
    // increment question counter
    vm.currentQuestion++;

    // begin END QUIZ SCENARIO
    // check if quiz is over (no more questions left in array)
    if (vm.currentQuestion == vm.questionsArray.length) {
      console.log("End of quiz!");
      vm.qTS = {}; // clear qTS
      vm.questionsArray = '';
      QuizService.endQuizInProgress();
      // timer
      vm.endTime = new Date();
      vm.totalTime = vm.endTime - vm.startTime;

      if (vm.currentUser) {
        vm.currentUser.userStats.totalQuizzes++;
        console.log('vm.currentUser before:', vm.currentUser);
        QuizService.sendStats(vm.currentUser).then(function(response){
          console.log('vm.currentUser after:', vm.currentUser);
        });
        // console.log('vm.inputed.username is:', vm.inputed.username);
        quizStatsForLeaderboard = {
          username: vm.currentUser.username,
          score: vm.score,
          time: vm.totalTime
        };
        console.log(quizStatsForLeaderboard);
      } // increment user stats and send update
      else {
        console.log('vm.inputed.username is:', vm.inputed.username);
        quizStatsForLeaderboard = {
          username: vm.inputed.username,
          score: vm.score,
          time: vm.totalTime
        };
        console.log(quizStatsForLeaderboard);
      }

      QuizService.addToLeaderboard( quizStatsForLeaderboard ).then(function(response){
        vm.leaderboard = QuizService.leaderboard;
      });

      vm.go('/quizEnd'); // go to quizEnd screen
    } // end END QUIZ SCENARIO
    else {
      // take the next question from the provided array
      // vm.qts is vm.questionToShow
      vm.qTS = vm.questionsArray[vm.currentQuestion];

      // declare possibleAnswers, which will be all answers correct or not
      vm.qTS.possibleAnswers = angular.copy(vm.qTS.incorrect_answers);

      // add in the correct_answer to list of possibleAnswers
      vm.qTS.possibleAnswers.push(vm.qTS.correct_answer);
      // something weird here!  correct_answer has been added to incorrect_answers?!

      // decode all text to remove HTML entities
      vm.qTS.question = decodeEntities(vm.qTS.question);
      vm.qTS.correct_answer = decodeEntities(vm.qTS.correct_answer);
      for (var i = 0; i < vm.qTS.possibleAnswers.length; i++) {
        vm.qTS.possibleAnswers[i] = decodeEntities(vm.qTS.possibleAnswers[i]);
      }

      // shuffles the order to hide the correct_answer
      vm.qTS.possibleAnswers.sort(function() {
        return 0.5 - Math.random();
      });
    }

  }; // end vm.nextQuestion

  vm.correct = function() {
    // console.log("You're right!");
    vm.lastAnswerWasCorrect = true;
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
      QuizService.getQuizInProgress().then(function(response) {
        // ask server if quizInProgress
        vm.quizInProgress = response.data;
        // and if a quiz is NOT already in progress...
        if (vm.quizInProgress == false) {
          QuizService.clearQuestions();
          // then go to Quiz Leader Screen to set game options
          $location.path('/quizLeader');
        } else {
          // else go to Quiz Player Screen
          $location.path('/quizPlayer');
        }
      });
    } else { // if not starting a quiz, just go to path
      $location.path(path);
    }
  }; // end vm.go

  vm.getOptions = function() {
    QuizService.getCategories().then(function(response) {
      vm.categories = QuizService.theCategories;
    });
  }; // end vm.getOptions

  vm.endQuiz = function() {
    swal({
            title: "End quiz?",
            text: "Others can finish, but no new players can join this quiz.",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ec1313",
            confirmButtonText: "Yes, we're done with this game!",
            cancelButtonText: "No, I'm not a troll!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function(isConfirm) {
            if (isConfirm) {
                QuizService.endQuizInProgress();
                vm.go('/');
                swal("Quiz quit!", "Quirky quiz quitter quietly acquiesces.", "success");
            } else {
                swal("Cancelled", "Get back to it then!", "error");
            }
        });
  };

  vm.playerStartIfReady = function() {
    QuizService.getSharedQuestions().then(function(response){
      if (QuizService.questionsToShare.data) {
        console.log('questions are ready to share!', QuizService.questionsToShare.data);
        vm.questionsArray = QuizService.questionsToShare.data;
        vm.score = 0; // reset score
        if (vm.currentUser) { // if logged in, re/initialize
          vm.currentUser.userStats = {
            correctAnswers: 0,
            totalAnswers: 0,
            wonQuizzes: 0,
            totalQuizzes: 0
          };
        }
        // preps the next question
        vm.currentQuestion = -1;
        vm.nextQuestion();

        // timer
        vm.startTime = new Date();
        vm.go('/quiz');
      } else {
        console.log('questions are NOT ready to share!!!!!!!!!!');
      }
    });
  };

  vm.showLeaderboard = function() {
    QuizService.getLeaderboard().then(function(response) {
      vm.leaderboard = QuizService.leaderboard;
    });
  };


  // LOG IN CODE

  vm.registerUser = function() {
    // console.log('vm.registerUser clicked!');
    if (vm.inputed.password !== vm.inputed.password2) {
      swal("Whoops!", "Passwords don't match!", "error");
    } else {
      var credentials = {
        username: vm.inputed.username,
        password: vm.inputed.password
      };
      QuizService.postRegister(credentials).then(function(response) {
        if (response.status == 201) {

          // vm.inputed.username = '';
          vm.inputed.password = '';
          vm.inputed.password2 = '';
          // load currentUser object
          QuizService.getCurrentUser(credentials).then(function() {
            // console.log('vm.currentUser is: ', QuizService.currentUser.data);
            vm.currentUser = QuizService.currentUser.data;
          });
          vm.go('/');
        } else {}
      });
    }
  };

  vm.loginUser = function() {
    // console.log('vm.loginUser clicked!');
    var credentials = {
      username: vm.inputed.username,
      password: vm.inputed.password
    }; // assemble login details and pass to postLogin
    QuizService.postLogin(credentials).then(function(response) {
      // if log-in successful
      if (response.data == 'we got it') {
        // clear inputs
        // vm.inputed.username = '';
        vm.inputed.password = '';
        // load currentUser object
        QuizService.getCurrentUser(credentials).then(function() {
          // console.log('vm.currentUser is: ', QuizService.currentUser.data);
          vm.currentUser = QuizService.currentUser.data;
        });
        // go to landing
        vm.go('/');
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

  // END LOG IN CODE

  var decodeEntities = (function() {
    // this prevents any overhead from creating the object each time
    var element = document.createElement('div');

    function decodeHTMLEntities(str) {
      if (str && typeof str === 'string') {
        // strip script/html tags
        str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
        str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
        element.innerHTML = str;
        str = element.textContent;
        element.textContent = '';
      }
      return str;
    }
    return decodeHTMLEntities;
  })(); // end decodeEntities

  vm.showAlert = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    // Modal dialogs should fully cover application
    // to prevent interaction outside of dialog
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('How to Play!')
        .htmlContent('LightningRound is a trivia quiz challenge, designed to be played with nearby friends!<br><br>The first player will set options, then other players can join in and take the same quiz!<br><br>HIGH SCORE WINS, BUT THE FASTEST TIME BREAKS TIES!<br><br>Photo by Brandon Morgan on Unsplash<br><br>Lightning Round&copy Ben Zeise 2017')
        .ariaLabel('How to Play')
        .ok("I got it!")
        .targetEvent(ev)
    );
  };

  // vm.getStatsForStatPage = function() {
  //   vm.correctStat = vm.currentUser.correctAnswers;
  //   vm.totalAnswersStat = vm.currentUser.totalAnswers;
  //   vm.totalQuizzesStat = vm.currentUser.totalQuizzes;
  // };

} // end QuizController

app.filter('secondsToDateTime', function() {
  return function(seconds) {
    return new Date(1970, 0, 1).setSeconds(seconds);
  };
}); // time filter used in quiz end screen
