var express = require('express');
var router = express.Router();
var models = require('../models'); 
const users = require('../models/users');
var authService = require('../services/auth');



//Admin view all users
router.get('/allusers', function(req, res, next){
    let token = req.cookies.jwt;
    authService.verifyUser(token).then(user => {
    if(user && user.Admin){
      models.Users
      .findAll({
        where:{
          Deleted: false
        }
      })
      .then(users =>{
        if (users){
          res.send(JSON.stringify(users))
        } else{
          res.send('Users not found')
        }
      });
    }else{
      res.send("You do not have proper authorization!")
    }
  });
  });


  //Admin specific user page (users/admin/editusers/:id)
router.get('/oneuser/:id', function(req, res, next){
    let token = req.cookies.jwt;
    authService.verifyUser(token).then(user => {
    if(user && user.Admin){
      models.Users
      .findOne({
        where:{UserId: parseInt(req.params.id)},
        include: [{
          model: models.categories,
          where: {Deleted: false},
          required: false
        }]
      })
      .then(usersInfo => {
        console.log(usersInfo.categories);
        res.send(usersInfo)
      })
    }else{
      res.send("You are unauthorized")
    }
  });
    
  });

  module.exports = router;