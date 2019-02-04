const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const Chatter = db.Chatter;
const User = db.User;
const userservice= require('users/user.service')

module.exports = {
    //authenticate,
    getAll,
    getById,getById2,uploadAvatars,
    create,changeAva
    //update,
    //delete: _delete
};

async function getAll() {
    return await Chatter.find().select('-id');
}

// async function generateID()  {
//     return await User.find().select('-hash').count();
// }

async function getById(id) {
    return await Chatter.findById(id).select('-id');
}

async function getById2(id) {
    return await Chatter.find({"pid":id});
}

async function create(user) {
    // validate
    
    const chatter = new Chatter();

   
    chatter.pid=user.pid;
    chatter.username=user.username;
    chatter.name=user.username;
    chatter.type='profile';

    

   
    // save user
    await chatter.save();
 
}

// const multer = require('multer');
// const path   = require('path');

// /** Storage Engine */
// const storageEngine = multer.diskStorage({
//   destination: './public/files',
//   filename: function(req, file, fn){
//     fn(null,  new Date().getTime().toString()+'-'+file.fieldname+path.extname(file.originalname));
//   }
// }); 

//init

// const upload =  multer({
//   storage: storageEngine,
//   limits: { fileSize:200000 },
//   fileFilter: function(req, file, callback){
//     validateFile(file, callback);
//   }
// }).single('photo');


// var validateFile = function(file, cb ){
//   allowedFileTypes = /jpeg|jpg|png|gif/;
//   const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimeType  = allowedFileTypes.test(file.mimetype);
//   if(extension && mimeType){
//     return cb(null, true);
//   }else{
//     cb("Invalid file type. Only JPEG, PNG and GIF file are allowed.")
//   }
// }


async function getAllAvatars(user) {
  // validate
  console.log('hey32');
  console.log(user)
  const user2 = await User.findById(user).select('-hash');
  console.log(user2)
  const chatter= await getById2(user2.pid);
  console.log(chatter);
  console.log(images)

  return await chatter.avatars;
}



async function changeAva(user, image) {
  // validate
  console.log('hey32');
  console.log(user)
  const user2 = await User.findById(user).select('-hash');
  console.log(user2)
  const chatter= await getById2(user2.pid);
  console.log(chatter);
  console.log(image)

  currentavaold=chatter[0].currentavatar;
  currentavanewindex=chatter[0].avatars.findIndex(k => k==image);
  console.log(currentavanewindex)
  if(currentavanewindex>-1){
    currentavanew = chatter[0].avatars[currentavanewindex];
    chatter[0].avatars[currentavanewindex]=currentavaold;
    chatter[0].currentavatar=currentavanew;
    console.log(chatter[0])
    await chatter[0].save();
  }

  //arr.findIndex(k => k=='b');
// 1

  


}

async function uploadAvatars(user, images) {
    // validate
    console.log('hey32');
    console.log(user)
    const user2 = await User.findById(user).select('-hash');
    console.log(user2)
    const chatter= await getById2(user2.pid);
    console.log(chatter);
    console.log(images)

    images.forEach(element => {
      console.log(element.filename)
      chatter[0].avatars.push("avatars/"+element.filename);
    });
    //chatter.avatars.push();

    // upload(req, res,(error) => {
    //     if(error){
    //         console.log('kdkdkdk')
    //        //res.redirect('/?msg=3');
    //     }else{
    //       if(req.file == undefined){
    //         console.log('kdkdkdk')
    //         //res.redirect('/?msg=2');
  
    //       }else{
               
    //           /**
    //            * Create new record in mongoDB
    //            */
    //           var fullPath = "files/"+req.file.filename;
  
    //           var document = {
    //             path:     fullPath, 
    //             caption:   req.body.caption
    //           };
    
    //         var photo = new Photo(document); 
    //         photo.save(function(error){
    //           if(error){ 
    //             throw error;
    //           } 
    //          // res.redirect('/?msg=1');
    //          console.log('kdkdkdk')
    //        });
    //     }
    //   }
    // });   

   
    // chatter.pid=user.pid;
    // chatter.username=user.username;
    // chatter.name=user.username;
    // chatter.type='profile';

    

   
    // save user
    await chatter[0].save();
 
}

// async function update(id, userParam) {
//     const user = await User.findById(id);

//     // validate
//     if (!user) throw 'User not found';
//     if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
//         throw 'Username "' + userParam.username + '" is already taken';
//     }

//     // hash password if it was entered
//     if (userParam.password) {
//         userParam.hash = bcrypt.hashSync(userParam.password, 10);
//     }

//     // copy userParam properties to user
//     Object.assign(user, userParam);

//     await user.save();
// }

// async function _delete(id) {
//     await User.findByIdAndRemove(id);
// }