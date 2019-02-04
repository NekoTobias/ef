module.exports = class RoomRepository {
    constructor() {
        this._roomStores = new Map();
    }

    getAll(roomnumber) {
        //return Array.from(this._getStore(roomnumber).values());
        let d=[];
        let i=0;
        for( let f of this._roomStores.values()){
            d[i]=Array.from(f.values());
            i++;
        }
        return d;
    }

    get(roomnumber, chatterid) {
        return this._getStore(roomnumber).get(chatterid);
    }

    createOrUpdate(roomnumber, chatter) {
        this._getStore(roomnumber).set(chatter.id, chatter);
    }

    delete(roomnumber, chatter) {
        this._getStore(roomnumber).delete(chatter.id);
    }

    _getStore(roomnumber) {
        let store = this._roomStores.get(roomnumber);
        if (!store) {
            store = new Map();
            this._roomStores.set(roomnumber, store);
        }

        return store;
    }
};