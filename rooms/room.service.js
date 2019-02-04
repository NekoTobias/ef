const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const Room = db.Room;
const roomservice= require('rooms/room.service')

module.exports = {
    //authenticate,
    getAll,
    getById,
    create,
    pushMessage
    //update,
    //delete: _delete
};

// async function authenticate({ Roomname, password }) {
//     const Room = await Room.findOne({ Roomname });
//     if (Room && bcrypt.compareSync(password, Room.id)) {
//         const { id, ...RoomWithoutid } = Room.toObject();
//         const token = jwt.sign({ sub: Room.id }, config.secret);
//         return {
//             ...RoomWithoutid,
//             token
//         };
//     }
// }

async function getAll() {
    return await Room.find().select('-id');
}

async function pushMessage(message, id) {
    //console.log(message);
    await getById(id)
    .then(room =>{
        room[0].verlauf.push(message)
        return room[0];
        //console.log(room[0])
    } ).then(room=>{
        //console.log(room);
        new Room(room).save()
    })
    .catch(err => console.log(err));
    // room=room[0];
    // console.log("dkd")
    // console.log(room)
    // await room.verlauf.push(message);

   
    
    // await room.save();
    
}

async function generateID()  {
    return await Room.find().select('-id').count();
}

async function getById(id) {
    return await Room.find({"pid":id});
}

async function create(RoomParam) {
    const room = new Room();

   
    await generateID().then(data=>room.pid=data);
    room.name=RoomParam.roomname;
    room.type='room';
    room.background=RoomParam.background;
    if(!!RoomParam.backgroundeffect){
        room.backgroundeffect=RoomParam.backgroundeffect;
    }
    // validate
    // if (await Room.findOne({ Roomname: RoomParam.Roomname })) {
    //     throw 'Roomname "' + RoomParam.Roomname + '" is already taken';
    // }

    //const Room = new Room(RoomParam);

    // id password
    // if (RoomParam.password) {
    //     Room.id = bcrypt.idSync(RoomParam.password, 10);
    // }
    // await generateID().then(data=>Room.pid=data);
    //  Room.type = "account";
    // save Room
    await room.save();
    
}

// async function update(id, RoomParam) {
//     const Room = await Room.findById(id);

//     // validate
//     if (!Room) throw 'Room not found';
//     if (Room.Roomname !== RoomParam.Roomname && await Room.findOne({ Roomname: RoomParam.Roomname })) {
//         throw 'Roomname "' + RoomParam.Roomname + '" is already taken';
//     }

//     // id password if it was entered
//     if (RoomParam.password) {
//         RoomParam.id = bcrypt.idSync(RoomParam.password, 10);
//     }

//     // copy RoomParam properties to Room
//     Object.assign(Room, RoomParam);

//     await Room.save();
// }

// async function _delete(id) {
//     await Room.findByIdAndRemove(id);
// }