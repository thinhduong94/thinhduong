import { db } from "./db";
import { Room } from "../model/Room";

export class dbRoom {
    private con;
    constructor() {
        this.con = new db().getConnection();
    }
    public getAll(callback) {
        this.con.query("SELECT * FROM room", function (err, rows) {
            //here we return the results of the query
            callback(err, rows);
        });
    }
    public getRoomById(id: string, callback) {
        let sql = "SELECT * FROM room WHERE room.id = " + id + "";
        console.log(sql);
        this.con.query(sql, function (err, rows) {
            //here we return the results of the query
            callback(err, rows);
        });
    }
    public updateRoomContent(id,content, callback) {

        var sql = "UPDATE room SET room.content = '" + JSON.stringify(content)+ "' WHERE room.id = " + id + "";
        console.log(sql);
        this.con.query(sql, function (err, result) {
            if (err) throw err;
            callback(err, result);
        });
    }
    public getRoomIsGroupById(id: string, callback) {
        let sql = "SELECT * FROM room , detailroom WHERE room.id = detailroom.room_id AND detailroom.user_id = " + id + " and room.type = 'room'";
        console.log(sql);
        this.con.query(sql, function (err, rows) {
            //here we return the results of the query
            callback(err, rows);
        });
    }
    public getDetailByRoomId(id:string,callback){
        let sql = "SELECT * FROM detailroom WHERE detailroom.room_id ="+id+"";
        console.log(sql);
        this.con.query(sql, function (err, rows) {
            //here we return the results of the query
            callback(err, rows);
        });
    }
    public getUserbyRoomId(id:string,callback){
        let sql = "SELECT * FROM user , detailroom WHERE user.id =detailroom.user_id and detailroom.room_id ="+id+"";
        console.log(sql);
        this.con.query(sql, function (err, rows) {
            //here we return the results of the query
            callback(err, rows);
        });
    }

    public getRoomIsFriendById(id: string, callback) {
        let sql = "SELECT * FROM room , detailroom, user WHERE room.id = detailroom.room_id AND (room.user_Created = " + id + " OR room.user_Friend = " + id + ") AND detailroom.user_id != " + id + " AND room.type = 'private' AND user.id = detailroom.user_id";
        console.log(sql);
        this.con.query(sql, function (err, rows) {
            //here we return the results of the query
            callback(err, rows);
        });
    }
    public createRoom(room: Room, callback) {
        console.log(room);
        let sql = "INSERT INTO room(name,user_Created,user_Friend,type) VALUES ('" + room.name + "'," + room.user_created + "," + room.user_friend + ",'" + room.type + "')";
        console.log(sql);
        this.con.query(sql, (err, rq) => {
            //here we return the results of the query

            this.createDetail(rq.insertId, room.listUserIdInRoom);

            callback(err, rq);

        });
    }
    public createDetail(room_id: string, listUserIdInRoom: any) {
        let sql = "INSERT INTO detailroom(user_id,room_id) VALUES ?";
        console.log(room_id);
        var values = [];
        listUserIdInRoom.forEach(dr => {
            values.push([dr, room_id]);
        })
        console.log(values);
        this.con.query(sql, [values], function (err, rq) {
            console.log(rq);
        });
    }
    public getHistories(id:string,callback){
        let sql = "SELECT room.id as room_id,room.type as type, room.name as name, user.id as id ,user.name as info_name,room.content as content FROM room LEFT JOIN user on user.id = room.user_Friend JOIN detailroom on detailroom.room_id = room.id WHERE detailroom.user_id = "+id+"";
        console.log(sql);
        this.con.query(sql, (err, rq) => {

            callback(err, rq);

        });
    }
}