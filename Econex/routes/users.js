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
      res.send('Login successful!');
      // res.redirect('/users/profile');
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


module.exports = router;
