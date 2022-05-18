var express = require('express');
var router = express.Router();
var models = require('../models'); 
var authService = require('../services/auth');


//Save Card Post
router.post('/savecard', function( req, res, next){
    let token = req.cookies.jwt;
    authService.verifyUser(token).then(user => {
    if (user){
        models.creditcard.findOrCreate({
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
          }).then(creditcard =>{
            if (creditcard){
                res.send(JSON.stringify(creditcard));
            } else{
              res.send('No Cards Found')
            }
          });

          
        }else {
          res.status(401);
          res.send("You must be logged in")
        }
      });
      });


//get all cards
router.get('/savedcards', function(req, res, next){
    let token = req.cookies.jwt;
    authService.verifyUser(token).then(user =>{
      if(user){
      models.creditcard
      .findAll({
        where:{
          Deleted: false,
          UserUserId: user.UserId
        }
      })
      .then(creditcard =>{
        if (creditcard){
            res.send(JSON.stringify(creditcard));
        } else{
          res.send('No Cards Found')
        }
      });
    }else{
     res.send('Not Logged In')
    }
    })
  });

//Get One Card  
router.get('/savedcards/:id', function(req, res, next){
    let token = req.cookies.jwt;
    authService.verifyUser(token).then(user => {
    if(user){
      models.creditcard
      .findOne({
        where:{CcId: parseInt(req.params.id),},
        
      })
      .then(creditcard => {
        res.send(JSON.stringify(creditcard))
      })
    }else{
      res.send("You Must Be Logged In")
    }
  });
    
  });


//delete card
router.post('/deletecard/:id', function (req, res, next) {
    let token = req.cookies.jwt;
    authService.verifyUser(token).then(user => {
    if(user){
    models.creditcard;
    const id  = req.params.id;
    console.log(id)
     models.creditcard.update({
        Deleted: true
     }, {
       where: {
         CcId: id
       }
     }
     ).then(response => {
       res.send("Card Deleted.")
     })
    } else{
      res.send("You need to log in!");
      
    }
    }); 
    
});

     
        
  


    module.exports = router;