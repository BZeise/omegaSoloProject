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

  vm.showQuestions = function() {
    // console.log( 'in showQuestions' );
    GameService.getQuestions().then(function(response){
      vm.questionsToShow = GameService.theQuestions;
      console.log('vm.questionsToShow is: ', vm.questionsToShow);
    });
  }; // end showQuestions

  // vm.showSearch = function() {
  //   console.log( 'in showSearch' );
  //   GameService.getSearch(vm.searchInput).then(function(response){
  //     // console.log('in GameService.getSearch, response it:', response);
  //     vm.questionsToShow = GameService.searchGif;
  //
  //   });
  // };

}
