// console.log( 'game.service.js loaded!' );

app.service( 'GameService', function( $http ) {
  var sv = this;

  // function to use API call to get list of trivia questions
  // future:  implement optional selections
  sv.getQuestions = function () {
    return $http.get ('https://opentdb.com/api.php?amount=10&type=multiple' ).then( function( response ){
      sv.theQuestions = response.data.results;
    });
  }; // end getQuestions

  // sv.getSearch = function(searchFor) {
  //   // assemble search term from ng-model "searchInput"
  //   var searchUrl = "http://api.giphy.com/v1/gifs/search?q=";
  //   // target search input
  //   searchUrl += searchFor;
  //   searchUrl += "&api_key=dc6zaTOxFJmzC";
  //   console.log( 'searching for: ', searchUrl);
  //
  //   return $http.get( searchUrl ).then( function( response ){
  //     console.log( 'response is: ', response);
  //
  //     // since we only display one image...
  //     // ...choose a random one in results to display
  //     var randomIndexToSearch = Math.floor(Math.random() * 25);
  //     sv.searchGif = response.data.data[randomIndexToSearch].images.downsized.url;
  //   });
  // };

});
