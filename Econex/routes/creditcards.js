var express = require('express');
var router = express.Router();
var models = require('../models'); 
var authService = require('../services/auth');


//Save Card Post
router.post('/savecard', function( req, res, next){
    let token = req.cookies.jwt;
    authService.verifyUser(token).then(user => {
    if (user){
        models.creditcards.findOrCreate({
            where:{ 
              CcNumber: req.body.CcNumber
            },
            defaults:{
              CcFirstName: req.body.CcFirstName,
              CcLastName: req.body.CcLastName,
              CcMonth: req.body.CcMonth,
              CcYear: req.body.CcYear,
              CcSecurityCode: req.body.CcSecurityCode,
              UserUserId: user.UserId
            }
          }).spread(function(result, created){
            if (created){
              res.send('Card Successfully Saved!');
            }else {
              res.send('Card Already Saved!');
            }});

          
        }else {
          res.status(401);
          res.send("You must be logged in")
        }
      });
      });
        
  


    module.exports = router;