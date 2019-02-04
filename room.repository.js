module.exports = class RoomRepository {
    constructor() {
        this._roomStores = new Map();
    }

    getAll() {
        return Array.from(this._getStore().values());
    }

    get(roomnumber) {
        return this._getStore().get(roomnumber);
    }

    createOrUpdate(room) {
        this._getStore().set(room.pid, room);
    }

    delete(roomnumber) {
        this._getStore().delete(roomnumber);
    }

    addChatter(roomnumber,chatter){
        if(this._getStore().get(roomnumber).users.filter(el=>JSON.stringify(el)===JSON.stringify(chatter).length==0)){
            this._getStore().get(roomnumber).users.push(chatter)
        }
        
    }

    deleteChatter(roomnumber,chatter){

        this._getStore().get(roomnumber).users=this._getStore().get(roomnumber).users.filter(el=>JSON.stringify(el)!==JSON.stringify(chatter));
    
    }

    searchAndDeleteChatter(chatter){
        let users=this.getAll();
        console.log(users)
        for(let i=0;i<users.length;i++){
            if(users[i].users.filter(el=>JSON.stringify(el)===JSON.stringify(chatter)).length>0){
                this.deleteChatter(i,chatter);
            }
        }
        
    }

    _getStore() {
        // let store = this._userStores.get(user);
        // if (!store) {
        //     store = new Map();
        //     this._userStores.set(user, store);
        // }

        return this._roomStores;
    }
};