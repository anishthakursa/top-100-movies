var express = require('express');
var router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const HTTPStatus = require("http-status");
const mongoose = require('mongoose');

module.exports = (app, wagner) => {
  let authMiddleware = wagner.get("auth");

  router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });

  router.post('/addUser', [
    check('first_name').matches(/^[a-zA-Z']*$/).bail().withMessage('Invalid first name value').custom(value => {
        let min = 3, max = 20;
        if(value.length < min)
            throw new Error(`Field must be minimum ${min} characters`)
        else if(value.length > max)
            throw new Error(`Field must be maximum ${max} characters`)
        else return true
    }),
    check('last_name').matches(/^[a-zA-Z']*$/).bail().withMessage('Invalid last name value').custom(value => {
        let min = 3, max = 20;
        if(value.length < min)
            throw new Error(`Field must be minimum ${min} characters`)
        else if(value.length > max)
            throw new Error(`Field must be maximum ${max} characters`)
        else return true
    }), 
    check('email').isEmail().matches(/^[a-zA-Z0-9@.]*$/).withMessage("Incorrect Email."),
    check('password').matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,}$/).withMessage('Password must be atleast 8 characters and should contain at least one letter, one number and one special character')
  ], async (req, res, next) => {
    try{
      let errors = validationResult(req);
      if(!errors.isEmpty()){
          let lasterr = errors.array().pop();
          lasterr.message = lasterr.msg + ": " + lasterr.param.replace("_"," ");
          return res.status(405).json({ success: '0', message: "failure", data: lasterr });
      }

      let conds = { email : req.body.email };
      let userData = await wagner.get('user_manager').find(conds);

      if(userData){
        res.status(409).json({ success: '1', message: "Email already exists.", data: '' });
      }else{
        req.body.password = await bcrypt.hashSync(req.body.password, salt);
        console.log(req.body)
        let insert = await wagner.get('user_manager').insert(req.body);
        res.status(HTTPStatus.OK).json({ success: '1', message: "User Added.", data: '' });
      }         
    }catch(e){
      console.log(e)
      res.status(500).json({ success: '0', message: "failure", data: e });
    }
  });

	return router;
}

