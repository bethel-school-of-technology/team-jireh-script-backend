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
    
    const header = req.headers.authorization;

    if (!header){
      res.status(403).send();
      return;
    }

    const token = header.split(' ')[1];
    
    const user = await authService.verifyUser(token);

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
      itemSeller: req.body.itemSeller,
      imgURL: req.body.imgURL,
      UserId: user.UserId
       }
    }).then(newItem => {
      res.json(newItem);
    }).catch(()=>{
      res.status(400).send("Missing reqiured info");
    });
  
  });
  /* PUT update */
  router.put('/:id', async (req, res, next) =>{
    const header = req.headers.authorization;

    if (!header){
      res.status(403).send();
      return;
    }

    const token = header.split(' ')[1];
    
    const user = await authService.verifyUser(token);

    if(!user){
      res.status(403).send();
      return;
    }
    const categoryId = parseInt(req.params.id);
   if(!categoryId || categoryId <= 0){
     res.status(400).send("Invalid ID");
     return;
   } 
    models.categories.update({
      itemName: req.body.itemName,
      itemPrice: req.body.itemPrice,
      itemSeller: req.body.itemSeller,
      imgURL: req.body.imgURL
    }, {
      where: {
        itemId : categoryId
      }
    }).then(()=>{
      res.status(204).send("Successful");
    }).catch(() =>{
      res.status(400).send("Unsuccessful ");
    })
     
      });
  /* DELETE */ 
  router.delete ('/:id', async (req, res, next) =>{
    const header = req.headers.authorization;

    if (!header){
      res.status(403).send();
      return;
    }

    const token = header.split(' ')[1];
    
    const user = await authService.verifyUser(token);

    if(!user){
      res.status(403).send();
      return;
    }
    const categoryId = parseInt(req.params.id);
   if(!categoryId || categoryId <= 0){
     res.status(400).send("Invalid ID");
     return;
   } 

   models.categories.destroy({
     where:{
       itemId:categoryId
     }
   }).then(()=>{
    res.status(204).send("Successful");
  }).catch(() =>{
    res.status(400).send("Unsuccessful ");
  })
  });
  
module.exports = router;