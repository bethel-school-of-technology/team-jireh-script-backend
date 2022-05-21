var express = require('express');
var router = express.Router();
var models = require('../models'); 
var authService = require('../services/auth');


/* GET return all*/
router.get('/', function(req, res, next) {
    models.categories.findAll().then(categoryList =>{
             res.json(categoryList);
    })
  });


/* GET return all inventory */
router.get("/inventory", function (req, res, next) {
  const user = req.user;
  if (!user) {
    res.status(403).send();
    return;
  }

  models.categories
    .findAll({
      where: {
        UserUserId: user.UserId,
      },
    })
    .then((categoryList) => {
      res.json(categoryList);
    });
});


  /* GET /:id get individual id*/
router.get('/:id', (req, res, next) =>{

    
const categoryId = parseInt(req.params.id);

models.categories.findOne({
  where: {
    itemId : categoryId
  }
}).then(category => {
  if (category){
    res.json(category);
  }else {
    res.status(404).send("Category not found")
  }
}, err => {
  res.status(500).send(err);
})
  });

  /* POST create */
  router.post('/', async(req,res,next) =>{
    
    /*veriy user See lines 28-38 in app.js*/
    const user = req.user;

    if(!user){
      res.status(403).send();
      return;
    }
    
    models.categories.findOrCreate({
      where: {
        ItemId: req.body.itemId
      },
       defaults:{ 
        itemName: req.body.itemName,
      itemPrice: req.body.itemPrice,
      itemDescription: req.body.itemDescription,
      itemSeller: req.body.itemSeller,
      imgURL: req.body.imgURL,
      UserUserId: user.UserId
       }
    }).then(newItem => {
      res.json(newItem);
    }).catch(()=>{
      res.status(400).send("Missing reqiured info");
    });
  
  });
  /* PUT update */
  router.put('/:id', async (req, res, next) =>{
    
    const categoryId = parseInt(req.params.id);
   if(!categoryId || categoryId <= 0){
     res.status(400).send("Invalid ID");
     return;
   } 
   
    /*veriy user See lines 28-38 in app.js*/
    const user = req.user;

    if(!user){
      res.status(403).send();
      return;
    }

    models.categories.findOne({
      where: {
        itemId : categoryId
      }
    }).then(category => {
      if (category){
        if (category.UserUserId != user.UserId) {
          res.status(402).send("You can't edit this category");
        }
      }else {
        res.status(404).send("Category not found")
      }
    }, err => {
      res.status(500).send(err);
    })

   
    models.categories.update({
      itemName: req.body.itemName,
      itemPrice: req.body.itemPrice,
      itemSeller: req.body.itemSeller,
      itemDescription: req.body.itemDescription,
      imgURL: req.body.imgURL,
      UserUserId: user.UserId
    }, {
      where: {
        itemId : categoryId
        // UserUserId: user.UserId
      }
    }).then(response => {

      // res.json(response);
      res.status(200).send("Successful");
    }).catch(() =>{
      res.status(400).send("Unsuccessful ");
    })
     
      });
  /* DELETE */ 
  router.delete ('/:id', async (req, res, next) =>{
    
     categoryId = parseInt(req.params.id);
   if(!categoryId || categoryId <= 0){
     res.status(400).send("Invalid ID");
     return;
   } 
    
    /*veriy user See lines 28-38 in app.js*/
    const user = req.user;

    if(!user){
      res.status(403).send();
      return;
    }
    
    models.categories.findOne({
      where: {
        itemId : categoryId
      }
    }).then(category => {
      if (category){
        if (category.UserUserId != user.UserId) {
          res.status(402).send("You cannot delete this category");
        }
      }else {
        res.status(404).send("Category not found")
      }
    }, err => {
      res.status(500).send(err);
    })


   models.categories.destroy({
     where:{
       itemId:categoryId,
       UserUserId : user.UserId
     }
   }).then(response =>{
    res.json(response)
    res.status(200).send("Successful");
  }).catch(() =>{
    res.status(400).send("Unsuccessful");
  })
  });
  
module.exports = router;