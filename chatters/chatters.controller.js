const express = require('express');
const router = express.Router();
const chatterService = require('./chatter.service');
const userService = require('../users/user.service');



const multer = require('multer');
const path   = require('path');

/** Storage Engine */
const storageEngine = multer.diskStorage({
  destination: './public/avatars',
  filename: function(req, file, fn){
    fn(null,  new Date().getTime().toString()+'-'+file.fieldname+path.extname(file.originalname));
  }
}); 

//init

const upload =  multer({
  storage: storageEngine,
  limits: { fileSize:200000 },
  fileFilter: function(req, file, callback){
    validateFile(file, callback);
  }
}).array('avatar');


var validateFile = function(file, cb ){
  allowedFileTypes = /jpeg|jpg|png|gif/;
  const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType  = allowedFileTypes.test(file.mimetype);
  if(extension && mimeType){
    return cb(null, true);
  }else{
    cb("Invalid file type. Only JPEG, PNG and GIF file are allowed.")
  }
}



function lala(){
  console.log('lala')
  
}






// routes
//router.post('/authenticate', authenticate);
router.post('/currentavatar',changeAva);
router.post('/current/avatars',upload,uploadAvatars);
router.get('/current/avatars',getAllAvatars);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
//router.put('/:id', update);
//router.delete('/:id', _delete);

module.exports = router;

// function authenticate(req, res, next) {
//     chatterService.authenticate(req.body)
//         .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
//         .catch(err => next(err));
// }




function uploadAvatars(req, res, next) {
    console.log('hey')
    console.log(req.body)
    console.log(req.files)
    req.files.forEach(element => {
      console.log(element.filename)
    });
    chatterService.uploadAvatars(req.user.sub,req.files)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAllAvatars(req, res, next) {
  // console.log('hey')
  // console.log(req.body)
  // console.log(req.files)
  // req.files.forEach(element => {
  //   console.log(element.filename)
  // });
  chatterService.getAllAvatars(req.user.sub)
      .then(() => res.json({}))
      .catch(err => next(err));
}

function changeAva(req, res, next) {
  // console.log('hey')
   console.log(req.body)
  // console.log(req.files)
  // req.files.forEach(element => {
  //   console.log(element.filename)
  // });
  chatterService.changeAva(req.user.sub, req.body[0])
      .then(() => res.json({}))
      .catch(err => next(err));
}

function getAll(req, res, next) {
    chatterService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    //console.log(req.user)
    userService.getById(req.user.sub)
        .then(user => chatterService.getById2(user.pid)).then(chatter=>{/*console.log(chatter);*/chatter ? res.json(chatter[0]) : res.sendStatus(404)}) 
        .catch(err => next(err));
}

function getById(req, res, next) {
    chatterService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

// function update(req, res, next) {
//     chatterService.update(req.params.id, req.body)
//         .then(() => res.json({}))
//         .catch(err => next(err));
// }

// function _delete(req, res, next) {
//     chatterService.delete(req.params.id)
//         .then(() => res.json({}))
//         .catch(err => next(err));
// }