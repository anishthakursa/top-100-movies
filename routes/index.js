var express = require('express');

module.exports = (app, wagner) => {
	app.get('/', (req, res, next)=> {
	  res.send("Movie Apis");
	});
	const users  = require('./users')(app, wagner);
	const movie  = require('./movie')(app, wagner);
	app.use('/users', users);
	app.use('/movie', movie);
}