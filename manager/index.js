module.exports = function(wagner) {
   	wagner.factory('user_manager', function() {
    	var user_manager = require('./user_manager');
    	return new user_manager(wagner);
  	});

	  wagner.factory('movie_manager', function() {
    	var movie_manager = require('./movie_manager');
    	return new movie_manager(wagner);
  	});
}

