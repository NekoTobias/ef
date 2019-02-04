const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    pid:{ type: Number, unique: true, required: true },
    type: { type: String, required: true },
    name: { type: String, unique: true, required: true },
    users: { type: Array, default:[] },
    verlauf: { type: Array, default:[] },
    background: { type: String, default:'' },
    backgroundeffect: { type: String, default:'' }
});

/*private id:number,
        public name:string,
        public users:Chatter[], 
        public verlauf: string[],
        private background: string) */

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Room', schema);