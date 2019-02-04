require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');
const ChatterRepo= require('./chatter.repository');
const RoomRepo= require('./room.repository');


const path = require('path');
const fs = require('fs');
//const express = require('express');
const multer = require('multer');
//const bodyParser = require('body-parser')
//const app = express();
//const router = express.Router();

// const DIR = './uploads';
 
// let storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, DIR);
//     },
//     filename: (req, file, cb) => {
//       cb(null, file.fieldname + '-' + Date.now() + '.' + path.extname(file.originalname));
//     }
// });
// let upload = multer({storage: storage});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));
// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/users', require('./users/users.controller'));
app.use('/chatters', require('./chatters/chatters.controller'));
app.use('/rooms', require('./rooms/rooms.controller'));

// app.post('/api/upload',upload.single('photo'), function (req, res) {
//     if (!req.file) {
//         console.log("No file received");
//         return res.send({
//           success: false
//         });
    
//       } else {
//         console.log('file received');
//         return res.send({
//           success: true
//         })
//       }
// });

// global error handler
app.use(errorHandler);

const roomrepo= new RoomRepo();
const roomservice= require('./rooms/room.service')
roomservice.getAll().then(rooms=>{
    //console.log(rooms)
    for(let room of rooms){
        console.log('ADD ROOM')
        //console.log(room)
        roomrepo.createOrUpdate(room);
    }
}
    
);




// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});

const chatterrepo= new ChatterRepo();
const connectedClients=new Map();
const positionmap=new Map();


function changeRoom(chatter, roomold, roomnew){
    //console.log('hall')
    // console.log('RRRRRRRRRREPO VOR')
    // console.log(chatterrepo)
    // console.log(roomold)
    // chatterrepo.delete(roomold,chatter);
    // chatterrepo.createOrUpdate(roomnew,chatter);
    // console.log('RRRRRRRRRREPO Nach')
    // console.log(chatterrepo)

    roomrepo.deleteChatter(roomold,chatter);
    roomrepo.addChatter(roomnew,chatter);

}

var io = require('socket.io')(server);



io.on('connection', function(socket){
  console.log('a user connected');


  console.log('Connected client on port %s.', port);

  socket.on('message', (m) => {
      console.log('[server](message): %s', JSON.stringify(m));
      io.emit('message', m);
  });

  socket.on('leavechat', (m) => {
    //console.log('[server](message): %s', JSON.stringify(m));
    //chatterrepo.delete(m[0],m[1]);
    roomrepo.deleteChatter(m[1].pid,m[0]);
    io.emit('leavechat', m);
});

socket.on('updatevideourl', (m) => {
    //console.log('[server](message): %s', JSON.stringify(m));
    //chatterrepo.delete(m[0],m[1]);
    //roomrepo.deleteChatter(m[1].pid,m[0]);
    io.emit('updatevideourl', m);
});

socket.on('senddrawcoordinates', (m) => {
    //console.log('[server](message): %s', JSON.stringify(m));
    //chatterrepo.delete(m[0],m[1]);
    //roomrepo.deleteChatter(m[1].pid,m[0]);
    io.emit('senddrawcoordinates', m);
});

socket.on('resetdrawcoordinates', (m) => {
    //console.log('[server](message): %s', JSON.stringify(m));
    //chatterrepo.delete(m[0],m[1]);
    //roomrepo.deleteChatter(m[1].pid,m[0]);
    io.emit('resetdrawcoordinates', m);
});

  socket.on('disconnect', () => {
      console.log()
      io.emit('leaveroom', connectedClients.get(socket.id));
      roomrepo.searchAndDeleteChatter(connectedClients.get(socket.id));
      connectedClients.delete(socket.id);
      
      console.log('Client disconnected');
  });

  socket.on('leaveroom', (m) => {
    console.log('leave room');
    io.emit('leaveroom', m);
});

socket.on('positioninit', (m) => {
    // let chatter= m[0];
    // let mx=m[1];
    // let my=m[2];
    // console.log(!!positionmap.get(m[0].id))
    let chatterOfCall=connectedClients.get(socket.id);
    if(JSON.stringify(chatterOfCall)===JSON.stringify(m[0])){
        let rx=Math.floor(Math.random() * ((800-150) - 0 + 1)) + 0;;
        let ry=Math.floor(Math.random() * ((800-150) - 0 + 1)) + 0;;
    positionmap.set(m[0].id,[rx,ry]);
    io.emit('positioninit', [m[0],[rx,ry]]);
}
    
    // console.log(chatterOfCall)
    // console.log(m)
    // console.log('=========')
    // console.log('=========')
    // console.log('=========')
   // if(JSON.stringify(chatterOfCall)===JSON.stringify(m[0])){
   //console.log('DIGGER');positionmap.set(m[0].id,[200,100]);}
    // if(JSON.stringify(chatterOfCall)!==JSON.stringify(m[0])){
    // if(!!!positionmap.get(m[0].id)){
    //     positionmap.set(m[0].id,[m[0],300,300]);
    //    // socket.emit('positioninit',[m[0],300,300])
    // }
//}
    // else{
    //     positionmap.delete(m[0].id);
    // }
   // }
    
});

socket.on('position', (m) => {
    console.log('leave nnnnroom');
    let c=positionmap.get(m.id);
    // if(!!c){
    //     c[0]=Math.floor(Math.random() * ((700) - 0 + 1)) + 0;
    //     c[1]=Math.floor(Math.random() * ((700) - 0 + 1)) + 0;
    // }
//     console.log('=========')
//     console.log('=========')
//     console.log('=========')
//     console.log(c);
    let chatterOfCall=connectedClients.get(socket.id);
//     console.log(chatterOfCall)
//     console.log(m)
//     console.log('=========')
//     console.log('=========')
//     console.log('=========')
//     if(JSON.stringify(chatterOfCall)===JSON.stringify(m)){
//     if(c){
//         socket.emit('position', [m,c[0],c[1]]);
//     }
//     else{
//         c=positionmap.get(chatterOfCall.id);
//         if(c){
//             socket.emit('position', [m,c[0],c[1]]);
//         }
     
//     }
// }
// if(JSON.stringify(chatterOfCall)===JSON.stringify(m)){
// positionmap.set(chatterOfCall.id,[100,100]);
// }
console.log('==========')
console.log(positionmap)
console.log('==========')
// if(!!!c){
//     positionmap.set(m.id,[200,100]);
// }
//let chatterOfCall=connectedClients.get(socket.id);
    console.log(chatterOfCall)
    console.log(m)
    //if(!!c){
        if(JSON.stringify(chatterOfCall)!==JSON.stringify(m)){
            //let c=positionmap.get(chatterOfCall.id);
            //positionmap.delete(chatterOfCall.id)
            if(!!c){
                io.emit('position', [chatterOfCall,c[0],c[1]]);
            }
          
            //positionmap.set(m.id,[m[1],m[2]])
        }
        else{
            console.log('......')
            console.log(c)
            let e=positionmap.get(m.id);
            //socket.emit('position', [chatterOfCall,e[0],e[1]]);
         
            //positionmap.set(m.id,[250,100])
            
        }
    //}
    
    
});

socket.on('move', (m) => {
    console.log('mmdmdmd')
    let chatterOfCall=connectedClients.get(socket.id);
    console.log(chatterOfCall)
    console.log(m)
    if(JSON.stringify(chatterOfCall)===JSON.stringify(m[0])){
        socket.emit('move', m);
        positionmap.set(m[0].id,[m[1],m[2]])
    }
    else{
        socket.broadcast.emit('move', [chatterOfCall,m[1],m[2]]);
        positionmap.set(chatterOfCall.id,[m[1],m[2]])
    }
    //positionmap.set(m[0].id,[m[1],m[2]])

    console.log('==========')
    console.log(positionmap)
    console.log('==========')
    
});

socket.on('changeroom', (m) => {
    console.log('change room');
    changeRoom(m[0],m[1],m[2])
    let chatter=m[0];
    let room= roomrepo.get(m[2]);
    console.log(roomrepo.getAll());
    positionmap.delete(chatter.id);
    //console.log('DIGGER');positionmap.set(m[0].id,[200,100]);io.emit('positioninit', [m[0],[200,100]]);;
    io.emit('changeroom', [chatter,room]);

});

socket.on('initchat', (m) => {
    console.log('initchat');
    //console.log(chatterrepo.getAll())
    //let room_users= chatterrepo.getAll()
    connectedClients.set(socket.id,m);//console.log('DIGGER');positionmap.set(m.id,[200,100]);
    io.emit('initchat', /*room_users*/);
});

  socket.on('joinroom', (m) => {
    console.log('Join room');//console.log('DIGGER');positionmap.set(m.id,[200,100]);
    io.emit('joinroom', m);
});
});
