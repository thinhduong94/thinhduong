
import { Room } from "../model/Room";
import { dbRoom } from "../db/dbRoom";

export class roomService {
    private room:Room;
    private db: dbRoom;
    constructor() {
        this.room = new Room();
        this.db = new dbRoom();
    }
    getAll(): Array<Room> {
        let users = new Array<Room>();
        return users;
    }
    getUserById(id:string):Room {
        let user = new Room();
        return user;
    }
    getHistories(id:string,callback){
        this.db.getHistories(id, function (err, Result) {
            //you might want to do something is err is not null... 
            callback(err, Result)

        });
    }
    public getRoomIsFriendById(id:string,callback){
        console.log(JSON.stringify(id));
        this.db.getRoomIsFriendById(id, function (err, Result) {
            //you might want to do something is err is not null... 
            callback(err, Result)

        });
    }
    public getRoomById(id:string,callback){
        console.log(JSON.stringify(id));
        this.db.getRoomById(id, function (err, Result) {
            //you might want to do something is err is not null... 
            callback(err, Result)

        });
    }
    public updateRoomContent(id,content,callback){
        // console.log(JSON.stringify(room));
        this.db.updateRoomContent(id,content, function (err, Result,callback) {
            console.log(Result);
            //you might want to do something is err is not null... 
        });
    }
    
    public createRoom(room:Room,callback){
        console.log(JSON.stringify(room));
        this.db.createRoom(room, function (err, Result) {
            //you might want to do something is err is not null... 
            callback(err, Result)
        });
    }
    public getRoomIsGroupById(id:string,callback){
        console.log(JSON.stringify(id));
        this.db.getRoomIsGroupById(id, function (err, Result) {
            //you might want to do something is err is not null... 
            callback(err, Result)

        });
    }
    public getDetailByRoomId(id:string,callback){
        console.log(JSON.stringify(id));
        this.db.getDetailByRoomId(id, function (err, Result) {
            //you might want to do something is err is not null... 
            callback(err, Result)
        });
    }
}