  // console.log( 'quiz.service.js loaded!' );

  app.service( 'QuizService', function( $http ) {
  var sv = this;

  // function to use API call to get list of trivia questions
  // selected options are passed through the 'url' argument constructed in controller
  sv.getQuestions = function ( url ) {
    return $http.get ( url ).then( function( response ){
      // console.log('in sv.getQuestions, response is:', response);
      sv.theQuestions = response.data.results;
    });
  }; // end getQuestions

  sv.getCategories = function () {
    return $http.get ( 'https://opentdb.com/api_category.php' ).then( function( response ){
      sv.theCategories = response.data.trivia_categories;
    });
  }; // end getCategories

  // LOG IN STUFF
  sv.postRegister = function( credentials ) {
    return $http.post('/register', credentials).then(function( response ){
      console.log('back from /register post with response: ', response);
      return response;
    });
  };
  sv.postLogin = function( credentials ) {
    return $http.post('/', credentials).then(function( response ){
      // console.log('back from / post with response: ', response);
      return response;
    });
  };
  sv.getCurrentUser = function( credentials ) {
    return $http.post('/users',  credentials ).then(function( response ){
      sv.currentUser = response;
      return response;
    });
  };


});
