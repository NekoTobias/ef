const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    pid:{ type: Number, unique: true, required: true },
    type: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    name:{ type: String, unique: true, required: true },
    friends:{type: Array, default:[]},
    avatars:{type: Array,default:[]},
    currentavatar:{type:String}

});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Chatter', schema);