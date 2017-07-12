  // console.log( 'quiz.service.js loaded!' );

  app.service( 'QuizService', function( $http ) {
  var sv = this;

  // function to use API call to get list of trivia questions
  // selected options are passed through the 'url' argument constructed in controller
  sv.getQuestions = function ( url ) {
    return $http.get ( url ).then( function( response ){
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
      return response;
    });
  };

  sv.getCurrentUser = function( credentials ) {
    return $http.post('/users', credentials ).then(function( response ){
      sv.currentUser = response;
      return response;
    });
  };

  sv.sendStats = function( statObj ) {
    return $http.put('/stats', statObj).then(function( response ){
      return response;
    });
  };


  // MULTIPLAYER STUFF
  sv.getQuizInProgress = function() {
    return $http.get('/quiz').then( function( response ){
      return response;
    });
  }; // end getQuizInProgress

  sv.endQuizInProgress = function() {
    return $http.post('/quiz').then( function( response ){
      return response;
    });
  }; // end getQuizInProgress

  sv.shareTheQuestions = function( questions ) {
    return $http.post('/questions', questions ).then(function( response ){
      sv.questionsToShare = response;
      // console.log('in quiz.service, sv.questionsToShare is:', sv.questionsToShare);
      return response;
    });
  }; // end shareTheQuestions

  sv.getSharedQuestions = function() {
    return $http.get('/questions').then(function( response ){
      sv.questionsToShare = response;
      // console.log('in quiz.service, GET to /q, sv.questionsToShare is:', sv.questionsToShare);
      return response;
    });
  }; // end getSharedQuestions

});
