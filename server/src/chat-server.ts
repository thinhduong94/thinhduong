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
    pushChat(length) {
        console.log(this.messages.length);
        if (length > 0) {
            console.log(this.messages[0]);
            this.roomSv.updateRoomContent(this.messages[0].id, this.messages[0].contents, (err, Result) => {
                this.messages.shift();
                let length = this.messages.length;
                this.pushChat(length);
            });
        }
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


            socket.on('login', (data: any) => {
                let a = this.userSv.login(data.userName, data.passWord, (err, Result) => {
                    //     res.send(Result);
                    // });
                    let rs: boolean = false;

                    if (Result.length > 0) {
                        rs = true;
                        let id = Result[0].id
                        let name = Result[0].name
                        this.userSv.updateUserById(Result[0].id, true, (err, Result) => {
                            this.io.emit('isOnline', { id: id, name: name });
                        })
                    }
                    console.log(Result.length);
                    socket.emit('login', { data: Result });
                    // res.send({ "data": Result });
                });
            })

            socket.on('logOut', (data: any) => {
                let a = this.userSv.login(data.userName, data.passWord, (err, Result) => {
                    //     res.send(Result);
                    // });
                    let rs: boolean = false;

                    if (Result.length > 0) {
                        rs = true;
                        let id = Result[0].id
                        let name = Result[0].name
                        this.userSv.updateUserById(Result[0].id, false , (err, Result) => {
                            this.io.emit('islogOut', { id: id, name: name });
                        })
                    }
                    console.log(Result.length);
                    socket.emit('logOut', { data: Result });
                    // res.send({ "data": Result });
                });
            })

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
                console.log("messages:" + JSON.stringify(m));

                this.io.emit('notification', { data: m.details });

                this.roomSv.getRoomById(m.room_id, (req, res) => {
                    console.log(JSON.stringify(res));
                    let contents: any[] = res[0].content == "" ? [] : JSON.parse(res[0].content);
                    m.date = Date.now();
                    contents.push(m);
                    JSON.stringify(contents)
                    console.log("contents:" + JSON.stringify(contents));
                    this.roomSv.updateRoomContent(m.room_id, contents, (req, res) => {
                        socket.broadcast.to(m.room_id).emit('message', m);
                        socket.emit('sended', m);
                    });

                })


            });
            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });

        });

        this.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        this.app.post('/deleteNumberInRoom', (req, res) => {
            res.header("Access-Control-Allow-Origin", "*");
            if (req.method === 'POST') {
                let body = '';
                let id = req.query.id;
                req.on('data', chunk => {
                    body += chunk.toString(); // convert Buffer to string
                });
                req.on('end', () => {
                    let user = JSON.parse(body);
                    let user_id = user.user_id;
                    let a = this.roomSv.deleteNumberInRoom(id, user_id, function (err, Result) {
                        res.send(Result);
                    });
                });
            }
        });
        this.app.post('/updateRoom', (req, res) => {
            res.header("Access-Control-Allow-Origin", "*");
            if (req.method === 'POST') {
                let body = '';
                let id = req.query.id;
                req.on('data', chunk => {

                    body += chunk.toString(); // convert Buffer to string
                });
                req.on('end', () => {
                    let room = JSON.parse(body);
                    let name = room.name;
                    let a = this.roomSv.updateRoom(id, name, function (err, Result) {
                        res.send(Result);
                    });
                });
            }
        });
        this.app.get('/getRoomById', (req, res) => {
            req.header('Access-Control-Allow-Origin: *');
            req.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
            req.header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
            let id = req.query.id;
            let a = this.roomSv.getRoomById(id, function (err, Result) {
                res.send(Result);
            });
        });
        this.app.delete('/deleteRoom', (req, res) => {

            let id = req.query.id;
            let a = this.roomSv.deleteRoom(id, function (err, Result) {
                res.send(Result);
            });
        });
        this.app.get('/getUserbyRoomId', (req, res) => {
            res.header("Access-Control-Allow-Origin", "*");
            let id = req.query.id;
            let a = this.roomSv.getUserbyRoomId(id, function (err, Result) {
                res.send(Result);
            });
        });
        this.app.get('/getDetailByRoomId', (req, res) => {
            res.header("Access-Control-Allow-Origin", "*");
            let id = req.query.id;
            let a = this.roomSv.getDetailByRoomId(id, function (err, Result) {
                res.send(Result);
            });
        });
        this.app.get('/getAllUser', (req, res) => {
            res.header("Access-Control-Allow-Origin", "*");
            let a = this.userSv.getAll(function (err, Result) {
                res.send(Result);
            });

        });
        this.app.get('/getHistories', (req, res) => {
            res.header("Access-Control-Allow-Origin", "*");
            let id = req.query.id;
            this.roomSv.getHistories(id, function (err, Result) {
                res.send(Result);
            });
        })
        this.app.get('/getFriendUser', (req, res) => {
            res.header("Access-Control-Allow-Origin", "*");
            let id = req.query.id;
            let a = this.roomSv.getRoomIsFriendById(id, function (err, Result) {
                res.send(Result);
            });
        });
        this.app.get('/getGruopUser', (req, res) => {
            res.header("Access-Control-Allow-Origin", "*");
            let id = req.query.id;
            let a = this.roomSv.getRoomIsGroupById(id, function (err, Result) {
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
                        let rs: boolean = false;

                        if (Result.length > 0) {
                            rs = true;
                        }
                        console.log(Result.length);
                        res.send({ "data": Result });
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
                        res.send({ "data": Result });
                    });
                });
            }
        });
        this.app.put('/updateRoomContent', (req, res) => {
            res.header('Access-Control-Allow-Origin', '*');
            console.log(req.method);
            if (req.method === 'PUT') {
                let id = req.query.id;
                let body = '';
                req.on('data', chunk => {

                    body += chunk.toString(); // convert Buffer to string
                });
                req.on('end', () => {
                    let content = JSON.parse(body);
                    let a = this.roomSv.updateRoomContent(id, content, function (err, Result) {
                        res.send({ "data": Result });
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
                        res.send({ "data": Result });
                    });
                });
            }
        });
    }
    public getApp(): express.Application {
        return this.app;
    }
}
