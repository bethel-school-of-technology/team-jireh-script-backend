require('dotenv').config();
var express = require('express');
const { restart } = require('nodemon');
var router = express.Router();
var models = require('../models');
var authService = require('../services/auth');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');

const uploader = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024  //limits image to <5MB
    },
});

console.log(process.env.ECONEX_PROJECT_ID);

const storage = new Storage({
        projectId: process.env.ECONEX_PROJECT_ID,
        keyFilename: process.env.ECONEX_KEY
    });




// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/photo', uploader.single('image'), async (req, res, next) =>{
    
    const user = req.user;

    if(!user){
      res.status(403).send();
      return;
    }        
    const storage = new Storage({
        projectId: 'econex-76225',
        keyFilename: './services/econex-key.json'
    });

    const bucket = storage.bucket('econex-76225.appspot.com');
    // const bucket = storage.bucket('process.env.FIREBASE_BUCKET');
try{
if(!req.file){
    res.status(400).send('No file uploaded');
    return;
}

const blob = bucket.file(req.file.originalname);
const blobStream = blob.createWriteStream({
    metadata:{
        contentType: req.file.mimetype
}
});

blobStream.on('error', (err)=> {
console.log(err);
next(err);
});

blobStream.on('finish', () => {
const encodedName = encodeURI(blob.name);
const publicUrl =
`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURI(blob.name)}?alt=media`;

models.categories.update({
        imgURL: publicUrl,
    
  }, {
    where: {
     
       UserUserId: user.UserId
    }
  }).then(() => {
        res.status(200).send({
            fileName: req.file.originalname,
            fileLocation: publicUrl
        });    
  }).catch(() =>{
    res.status(400).send("Unsuccessful ");
  })

    

});

blobStream.end(req.file.buffer);

} catch (error) {
res.status(400).send(`Error uploading file: ${error}`)
}
});

module.exports = router;
 