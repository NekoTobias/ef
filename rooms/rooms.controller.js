const express = require('express');
const router = express.Router();
const roomService = require('./room.service');




const multer = require('multer');
const path   = require('path');

/** Storage Engine */
const storageEngine = multer.diskStorage({
  destination: './public/roombackgrounds',
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
}).array('roombackground');


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














// routes
//router.post('/authenticate', authenticate);
router.post('/create', create);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.post('/:pid/messages', pushMessage);
//router.put('/:id', update);
//router.delete('/:id', _delete);

module.exports = router;

// function authenticate(req, res, next) {
//     roomService.authenticate(req.body)
//         .then(room => room ? res.json(room) : res.status(400).json({ message: 'roomname or password is incorrect' }))
//         .catch(err => next(err));
// }













function create(req, res, next) {
    roomService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function pushMessage(req, res, next) {
    //console.log('fff')
    //console.log(req.body.message)
    roomService.pushMessage(req.body.message, req.params.pid)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    roomService.getAll()
        .then(rooms => res.json(rooms))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    roomService.getById(req.room.sub)
        .then(room => room ? res.json(room) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    //console.log("Param")
    //console.log(req.params.id)
    roomService.getById(req.params.id)
        .then(room => room ? res.json(room[0]) : res.sendStatus(404))
        .catch(err => next(err));
}

// function update(req, res, next) {
//     roomService.update(req.params.id, req.body)
//         .then(() => res.json({}))
//         .catch(err => next(err));
// }

// function _delete(req, res, next) {
//     roomService.delete(req.params.id)
//         .then(() => res.json({}))
//         .catch(err => next(err));
// }