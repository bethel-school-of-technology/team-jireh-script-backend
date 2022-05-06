var express = require('express');
var router = express.Router();
var models = require('../models'); 
var authService = require('../services/auth');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//Signup Post
router.post('/signup', function( req, res, next){
  console.log(req.body);
  models.Users.findOrCreate({
    where:{ 
      Username: req.body.Username
    },
    defaults:{
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      Email: req.body.Email,
      Password: authService.hashPassword(req.body.Password)
    }
  }).spread(function(result, created){
    if (created){
      res.send('User successfully created!');
      // res.redirect('/users/login')
    }else {
      res.send('User already exists.');
    }
  });
});

//Login Post
router.post('/login', function(req, res, next){
  models.Users.findOne({
    where: {
      Username: req.body.Username,
    }
  }).then( user =>{
    if(!user){
      console.log("User not found");
      return res.status(401).json({message:"Login Failed"});
    }else{
      let passwordMatch = authService.comparePasswords(req.body.Password, user.Password);
      if (passwordMatch){
      let token = authService.signUser(user);
      res.cookie('jwt', token);
      //res.json({Username: user.Username, FirstName:user.FirstName, LastName:user.LastName, Email:user.Email});
      res.send(JSON.stringify(user))

    }else{
        console.log('Wrong password');
        res.send('Wrong password');
      }
     
    }
  })
});


//Logout 
router.get('/logout', function(req, res, next){
  res.cookie('jwt', "", {expires: new Date(0)});
  res.send('Logout Successful!');
});


//Seller signup post
router.post('/registerseller', function( req, res, next){
  console.log(req.body);
  models.Users.findOrCreate({
    where:{ 
      BusinessName: req.body.BusinessName
    },
    defaults:{
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      Email: req.body.Email,
      Password: authService.hashPassword(req.body.Password),
      Seller: true
    }
  }).spread(function(result, created){
    if (created){
      res.send('Seller account created!');
      
    }else {
      res.send('User already exists.');
    }
  });
});


//Seller Login Post
router.post('/loginseller', function(req, res, next){
  models.Users.findOne({
    where: {
      BusinessName: req.body.BusinessName,
    }
  }).then( user =>{
    if(!user){
      console.log("User not found");
      return res.status(401).json({message:"Login Failed"});
    }else{
      let passwordMatch = authService.comparePasswords(req.body.Password, user.Password);
      if (passwordMatch){
      let token = authService.signUser(user);
      res.cookie('jwt', token);
      //res.json({BusinessName: user.BusinessName, FirstName:user.FirstName, LastName:user.LastName, Email:user.Email});
      res.send(JSON.stringify(user))
    }else{
        console.log('Wrong password');
        res.send('Wrong password');
      }
     
    }
  })
});


module.exports = router;
