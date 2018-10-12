import { createServer, Server } from 'http';
import * as express from 'express';
import * as mysql from 'mysql';
import * as socketIo from 'socket.io';

import { Message } from './model';
import { User } from './model/user';
import { userService } from './service/UserService';
import { db } from './db/db';
import * as querystring from 'querystring';
import { roomService } from './service/RoomService';
import { Room } from './model/Room';



// const con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "chatapp"
// });

export class ChatServer {
    public static readonly PORT: number = 8080;
    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;
    private roomsDB: any[] = [];
    private rooms: any[] = []; // {id:string,name:string,type:string,status:number} 
    private users: any[] = []; // list[{id:string,userName:string,passWord:string,name:string,status:string}]
    private messages: any[] = []; //litst[id_room:string, content:json string fomat{from: user name , message:string}]
    private messagesDB: any[] = [];
    private detailRooms: any[] = []; // list[id_room,id_user,status]
    private detailRoomsDB: any[] = [];
    private Friends: any[] = [];
    private id: number = 1;
    private _sockets: any[] = [];
    private _socketstest: any[] = [];
    private notifis: any[] = [];
    private userSv: userService;
    private roomSv: roomService;
    // private con:mysql.Connection;
    // private db:db;
    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
        this.userSv = new userService();
        this.roomSv = new roomService();
        // this.con = this.db.getConnection();
    }

    private createApp(): void {
        this.app = express();
    }

    private createServer(): void {
        this.server = createServer(this.app);
    }

    private config(): void {
        this.port = process.env.PORT || ChatServer.PORT;
    }

    private sockets(): void {
        this.io = socketIo(this.server);
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });

        this.io.on('connect', (socket: any) => {

            console.log('Connected client on port %s.', this.port);

            // console.log('socket', socket);

            console.log('socket.id', socket.id);

            // this.io.sockets

            console.log('sockets', JSON.stringify([]));


            

            socket.on('join', (data: any) => {

           
                socket.join(data);
            
                socket.broadcast.to(data).emit('join', data);
      
            })

            socket.on('loadingRoom', (data: any) => {
                console.log("-----loadingRoom-----");
                let rs: any[] = [];
            

                console.log("loadingRoom" + JSON.stringify(rs));

                socket.emit('loadingRoom', rs);
            })

            socket.on('message', (m: any) => {

                console.log("notification:" + JSON.stringify(m.details));

                this.io.emit('notification',{data:m.details});
                
                console.log("messages:" + JSON.stringify(this.messages));
                console.log('[server](message): %s', JSON.stringify(m));
                this.io.to(m.room_id).emit('message', m);
            });


            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });


        this.app.get('/getRoomById', (req, res) => {
            res.header("Access-Control-Allow-Origin", "*");
            let id = req.query.id;
            let a = this.roomSv.getRoomById(id,function (err, Result) {
                res.send(Result);
            });

        });

        this.app.get('/getUserbyRoomId', (req, res) => {
            res.header("Access-Control-Allow-Origin", "*");
            let id = req.query.id;
            let a = this.roomSv.getUserbyRoomId(id,function (err, Result) {
                res.send(Result);
            });

        });
        
        this.app.get('/getDetailByRoomId', (req, res) => {
            res.header("Access-Control-Allow-Origin", "*");
            let id = req.query.id;
            let a = this.roomSv.getDetailByRoomId(id,function (err, Result) {
                res.send(Result);
            });

        });
        this.app.get('/getAllUser', (req, res) => {
            res.header("Access-Control-Allow-Origin", "*");
            let a = this.userSv.getAll(function (err, Result) {
                res.send(Result);
            });

        });
        this.app.get('/getHistories',(req, res)=>{
            res.header("Access-Control-Allow-Origin", "*");
            let id = req.query.id;
            this.roomSv.getHistories(id,function (err, Result) {
                res.send(Result);
            });
        })
        this.app.get('/getFriendUser', (req, res) => {
            res.header("Access-Control-Allow-Origin", "*");
            let id = req.query.id;
            let a = this.roomSv.getRoomIsFriendById(id,function (err, Result) {
                res.send(Result);
            });
        });
        this.app.get('/getGruopUser', (req, res) => {
            res.header("Access-Control-Allow-Origin", "*");
            let id = req.query.id;
            let a = this.roomSv.getRoomIsGroupById(id,function (err, Result) {
                res.send(Result);
            });
        });
        this.app.post('/login', (req, res) => {
            res.header("Access-Control-Allow-Origin", "*");
            if (req.method === 'POST') {
                let body = '';
                req.on('data', chunk => {

                    body += chunk.toString(); // convert Buffer to string
                });
                req.on('end', () => {
                    let user = JSON.parse(body);
                    let a = this.userSv.login(user.userName, user.passWord, function (err, Result) {
                        //     res.send(Result);
                        // });
                        let rs:boolean = false;
                      
                        if(Result.length > 0){
                           rs = true;
                        }
                        console.log(Result.length);
                        res.send({"data":Result});
                    });
                });
            }
        });
        this.app.post('/register', (req, res) => {
            res.header("Access-Control-Allow-Origin", "*");
            if (req.method === 'POST') {
                let body = '';
                req.on('data', chunk => {

                    body += chunk.toString(); // convert Buffer to string
                });
                req.on('end', () => {
                    let _user = JSON.parse(body);

                    let user = new User();

                    user.userName = _user.userName;
                    user.passWord = _user.passWord;
                    user.name = _user.name;

                    let a = this.userSv.register(user, function (err, Result) {
                        res.send({"data":Result});
                    });
                });
            }
        });
        this.app.post('/updateRoomContent', (req, res) => {
            res.header('Access-Control-Allow-Origin', '*'); 
            console.log(req.method);
            if (req.method === 'POST') {
                let id = req.query.id;
                let body = '';
                req.on('data', chunk => {

                    body += chunk.toString(); // convert Buffer to string
                });
                req.on('end', () => {
                    let content = JSON.parse(body);
                    let a = this.roomSv.updateRoomContent(id,content, function (err, Result) { 
                        res.send({"data":Result});
                    });
                });
            }

        });
        this.app.post('/createRoom', (req, res) => {
            res.header("Access-Control-Allow-Origin", "*");
            if (req.method === 'POST') {
                let body = '';
                req.on('data', chunk => {

                    body += chunk.toString(); // convert Buffer to string
                });
                req.on('end', () => {
                    let _room = JSON.parse(body);

                    let room = new Room();

                    room.listUserIdInRoom = _room.listUserIdInRoom;
                    room.name = _room.name;
                    room.content = _room.content || '';
                    room.user_friend = _room.user_friend || null;
                    room.user_created = _room.user_created;
                    room.type = _room.type;

                    let a = this.roomSv.createRoom(room, function (err, Result) {
                        res.send({"data":Result});
                    });
                });
            }
        });
        // this.app.post('/register',function (req, res) {
        //     res.send(JSON.stringify(req)); 
        // })
    }
    public getApp(): express.Application {
        return this.app;
    }
}
