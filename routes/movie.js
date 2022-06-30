var express = require('express');
var router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const HTTPStatus = require("http-status");
const mongoose = require('mongoose');

module.exports = (app, wagner) => {

  router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });

  router.post('/addMovie', [
    check('name').notEmpty().withMessage('name is required').bail(),
    check('description').notEmpty().withMessage('description is required').bail(),
    check('year').isNumeric().withMessage("Incorrect Year of Release."),
  ], async (req, res, next) => {
    try{
      let errors = validationResult(req);
      if(!errors.isEmpty()){
          let lasterr = errors.array().pop();
          lasterr.message = lasterr.msg + ": " + lasterr.param.replace("_"," ");
          return res.status(405).json({ success: '0', message: "failure", data: lasterr });
      }

      let conds = { name : req.body.name };
      let movieData = await wagner.get('movie_manager').find(conds);

      if(movieData){
        res.status(409).json({ success: '1', message: "Movie already exists.", data: '' });
      }else{
        let insert = await wagner.get('movie_manager').insert(req.body);
        res.status(HTTPStatus.OK).json({ success: '1', message: "Movie Added.", data: '' });
      }         
    }catch(e){
      console.log(e)
      res.status(500).json({ success: '0', message: "failure", data: e });
    }
  });

  router.get('/movieList', async (req, res, next) => {
    try{
      let sort = {'_id' : JSON.parse(req.query.sort)};
      let movies = await wagner.get('movie_manager').findAllPaginate({}, sort, req.query.pageNumber, req.query.recordsLimit);
      if(movies){
        res.status(HTTPStatus.OK).json({ success: '1', message: "Data.", data: movies });            
      }else{
        res.status(405).json({ success: '0', message: "failure", data: "" });
      }
    }catch(e){
        console.log(e)
        res.status(500).json({ success: '0', message: "failure", data: e });
    } 
  });

  router.post( "/update", [
    check('movie_id').not().isEmpty().withMessage("Movie Id is required.")
  ],async (req, res) => {
    try {
      let conds = { "_id": req.body.movie_id };
      let request = req.body
      delete request.movie_id;
      let userData = await wagner.get("movie_manager").update(request, conds);
      res.status(HTTPStatus.OK).json({ success: "1", message: "Updated succesfully.", data: "" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ success: "0", message: "failure", data: e });
    }   
  })

  router.post('/addMovieRank', [
    check('movie_id').notEmpty().withMessage('movie_id is required.').bail(),
    check('user_id').notEmpty().withMessage('user_id is required.').bail(),
    check('rank').isNumeric().withMessage("rank is required."),
  ], async (req, res, next) => {
    try{
      let errors = validationResult(req);
      if(!errors.isEmpty()){
          let lasterr = errors.array().pop();
          lasterr.message = lasterr.msg + ": " + lasterr.param.replace("_"," ");
          return res.status(405).json({ success: '0', message: "failure", data: lasterr });
      }

      let conds = { movie_id : req.body.movie_id, user_id:req.body.user_id, rank:req.body.rank };
      let movieData = await wagner.get('movie_manager').findRank(conds);

      if(movieData){
        res.status(409).json({ success: '1', message: "Rank "+ req.body.rank+" already exists.", data: '' });
      }else{
        let insert = await wagner.get('movie_manager').insertRank(req.body);
        res.status(HTTPStatus.OK).json({ success: '1', message: "Rank Added.", data: '' });
      }         
    }catch(e){
      console.log(e)
      res.status(500).json({ success: '0', message: "failure", data: e });
    }
  });

  router.get('/rankMovieList', async (req, res, next) => {
    try{
      let conds = {
        user_id : req.query.user_id,
        rank : { $gt :  (req.query.pageNumber - 1) * req.query.recordsLimit, $lt : req.query.recordsLimit*req.query.pageNumber}
      }
      let movies = await wagner.get('movie_manager').findMovieRank(conds, req.query.pageNumber, req.query.recordsLimit);
      if(movies){
        res.status(HTTPStatus.OK).json({ success: '1', message: "Data.", data: movies });            
      }else{
        res.status(405).json({ success: '0', message: "failure", data: "" });
      }
    }catch(e){
        console.log(e)
        res.status(500).json({ success: '0', message: "failure", data: e });
    } 
  });

  router.post( "/deleteMovieRank", [
    check('rank_id').not().isEmpty().withMessage("Movie Id is required.")
  ],async (req, res) => {
    try {
      let conds = { "_id": req.body.rank_id };
      let movie = await wagner.get("movie_manager").deleteRank(conds);
      res.status(HTTPStatus.OK).json({ success: "1", message: "Deleted succesfully.", data: "" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ success: "0", message: "failure", data: e });
    }   
  })

  return router;
}
  