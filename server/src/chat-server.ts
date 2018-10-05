import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';

import { Message } from './model';

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
    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
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

            socket.on('getAllUser', (id: string) => {

                let users = this.getAllUser(id);
                // is login !
                // get user info by user name !
                socket.emit('getAllUser', users);
            })

            // socket.on('notification', (id: string) => {
            //     let rs: any = [];


            //     // rs = this.getNotifi(id);
            //     if (this.isOnline(id)) {
            //         // let noti = {
            //         //     user_id: data.friend.id,
            //         //     from_id: data.user.id,
            //         //     content: data.user.name + "have friended with you",
            //         //     type: "addFriend"
            //         // }
            //         // console.log("_socket_id:" + this.getOnlineUser(id).id);
            //         // socket.broadcast.to(this.getOnlineUser(data.friend.id).id)
            //         this.io.to(id).emit('notification',"dkm chay di !!!!!!");
            //     }
            // })

            socket.on('createRoom', (data: any) => {
                console.log("createRoom:" + JSON.stringify(data));

                this.createRoom(data.room, data.listUserJoinRoom);
                let arrayTo:any[] = [];
                data.listUserJoinRoom.forEach(user => {
                    if(user != data.room.userCreate.id){
                        arrayTo.push(user);
                    }
                });
                let noti = {
                    from:data.room.userCreate,
                    to:arrayTo,
                    content:"added room",
                    type:"addRoom"
                }
                this.io.emit('notification', noti);

                socket.emit('createRoom', data);
            })

            socket.on('getRoom', (id: string) => {

                let rs = this.getRoom(id);

                socket.emit('getRoom', rs);

            })
            socket.on('addFriend', (data: any) => {
                console.log("addFriend:" + JSON.stringify(data));

                //add friend
                let user = this.addFriend(data);
                // console.log("_sockets:" + JSON.stringify(this._socketstest[data.friend.id]))
                // console.log("isOnline:" + this.isOnline(data.friend.id))
                // console.log("aaaa:" + JSON.stringify(this._socketstest))
                // this._socketstest.forEach(x => {
                //     let namespace = null;
                //     let ns = this.io.of(namespace || "/").connected[x];
                //     let sssocket = ns;
                //     console.log(sssocket);
                    
                //     console.log(this.io.of(namespace || "/").connected);
                //     // sssocket
                // })  
                // let path = "/#"+socket.id;
                // socket.emit('notification',{hello:"ccc"});
                let namespace = null;
                let noti = {
                    from:data.user,
                    to:[data.friend.id],
                    content:"added friend",
                    type:"addFriend"
                }
                this.io.emit('notification', noti);
               
                socket.emit('addFriend', user);
            })
            socket.on('getFriend', (id: string) => {
                let rs = this.getFriend(id);

                socket.emit('getFriend', rs);
            })

            socket.on('getHistoyies', (id: string) => {
                let rs = this.getHistoyies(id);

                socket.emit('getHistoyies', rs);
            })

            socket.on('login', (data: any) => {
                let rs = this.isLogin(data);
                console.log(this.users);
                let user = this.getUserByUserName(data.userName);
                // is login !

                socket.join("AAA");

                this._socketstest.push(socket.id);

                this.addSockets({ id: socket.id, user: user, type: 'online' });

                socket.user = user;

                socket.emit('login', rs);
                // get user info by user name !
                socket.emit('getUserInfo', user);
            })

            socket.on('join', (data: any) => {

                let mess = this.getMess(data);
                console.log(JSON.stringify(data));
                socket.join(data);
                socket.emit('update', mess);
                socket.broadcast.to(data).emit('join', data);
                console.log(JSON.stringify(data));
            })

            socket.on('loadingRoom', (data: any) => {
                console.log("-----loadingRoom-----");
                // let userName: string = data.name;
                let rs: any[] = [];
                // if (this.messages.length > 0) {
                //     this.messages.forEach(mess => {
                //         console.log("-----loadingRoom-----:" + JSON.stringify(mess));
                //         let user1 = mess.room.split("/")[0];
                //         let user2 = mess.room.split("/")[1];
                //         console.log(user1 + user2);
                //         if (user1 == userName || user2 == userName) {
                //             rs.push(mess);
                //         }
                //     })
                // }

                console.log("loadingRoom" + JSON.stringify(rs));

                socket.emit('loadingRoom', rs);
            })

            socket.on('message', (m: any) => {
                this.addMess(m);
                let arrayTo:any[] = [];
                this.detailRoomsDB.forEach(d=>{
                    if(m.room_id == d.room_id && d.user_id != m.from.id){
                        arrayTo.push(d.user_id);
                    }
                })

                let noti = {
                    from:m.from,
                    to:arrayTo,
                    content:m.content,
                    type:"addMess"
                }
                this.io.emit('notification', noti);

                console.log("messages:" + JSON.stringify(this.messages));
                console.log('[server](message): %s', JSON.stringify(m));
                this.io.to(m.room_id).emit('message', m);
            });


            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    }
    //mess

    public getMess(id: string) {
        let index = this.messagesDB.findIndex(x => x.room_id == id);
        return this.messagesDB[index] || {};
    }
    public addMess(data) {

        if (this.messagesDB.length > 0) {
            let index = this.messagesDB.findIndex(x => x.room_id == data.room_id);
            if (index > -1) {
                let array = JSON.parse(this.messagesDB[index].content);
                array.push({ from: data.from, content: data.content });
                this.messagesDB[index].content = JSON.stringify(array);
            } else {
                let m = {
                    room_id: data.room_id,
                    content: JSON.stringify([{ from: data.from, content: data.content }])
                }
                this.messagesDB.push(m);
            }
        } else {
            let m = {
                room_id: data.room_id,
                content: JSON.stringify([{ from: data.from, content: data.content }])
            }
            this.messagesDB.push(m);
        }
        console.log("messagesDB" + JSON.stringify(this.messagesDB));
    }
    //history
    public getHistoyies(id: string) {
        let data: any[] = [];
        console.log("getFriend(detailRoomsDB):" + JSON.stringify(this.detailRoomsDB))
        this.roomsDB.forEach(room => {
            if (room.type == 'private') {
                if (room.userCreate == id || room.userFriend == id) {
                    this.detailRoomsDB.forEach(dr => {
                        if (dr.room_id == room.id && dr.user_id != id) {
                            room.info = this.getUserById(dr.user_id);

                        }
                    })
                    data.push(room);
                }
            } else {
                this.detailRoomsDB.forEach(dr => {
                    if (dr.room_id == room.id && dr.user_id == id) {
                        data.push(room);
                    }
                })
            }

        })
        data.forEach(d => {
            this.messagesDB.forEach(m => {
                if (d.id == m.room_id) {
                    if (m.content) {
                        let array = JSON.parse(m.content);
                        d.lasterMess = array[array.length - 1];
                    }

                }
            })
        })
        return data;

    }
    //room
    public createRoom(room: any, listUserJoinRoom: any[]) {
        //two user
        // more than user
        console.log("----Start createRoom-----");
        console.log("listUserJoinRoom:" + JSON.stringify(listUserJoinRoom));
        room.id = 'room_' + this.id;
        // after create room then push room info in table detail room and user
        this.roomsDB.push(room);
        // push room info in table detail room and user
        listUserJoinRoom.forEach(user => {
            this.detailRoomsDB.push({ room_id: room.id, user_id: user });
        });
        this.id++;
        console.log("roomsDB:" + JSON.stringify(this.roomsDB));
        console.log("detailRoomsDB:" + JSON.stringify(this.detailRoomsDB));
        console.log("----End createRoom-----")

    }

    public getRoom(id: string) {
        console.log("getRoom:" + id);
        let data: any[] = [];
        this.detailRoomsDB.forEach(d => {
            if (d.user_id == id) {
                console.log("getRoom:loop " + JSON.stringify(d));
                this.roomsDB.forEach(r => {
                    if (r.id == d.room_id && r.type == 'room') {

                        data.push(r);
                    }
                })
            }
        })
        console.log("getRoom:" + JSON.stringify(data));
        return data;
    }

    //Noti

    public isOnline(id: string) {
        // user_id , from_id, content , type
        let index = this._sockets.findIndex(x => x.user.id == id);

        return this._sockets[index] ? true : false;
    }

    // public getNotifi(id:string){
    //     // user_id , from_id, content , type
    //     let index = this.notifis.findIndex(x=>x.user_id == id);

    //     return this.notifis[index] || {};
    // }

    // public setNotifi(data:any){
    //     // add room add friend get message

    //     this.notifis.push(data);

    // }

    public addSockets(data: any) {

        let object = {
            id: data.id,
            user: data.user,
            type: 'online'
        }
        this._sockets.push(object);

    }

    public getOnlineUser(id: string) {

        let index = this._sockets.findIndex(x => x.user.id == id);

        return this._sockets[index] || {};
    }

    // public updateStatusUser(id:string){
    //     if(this.getOnlineUser(id).id){}
    // }

    //room

    public editRoom(room: any) {

    }
    public addPeopleInRoom(idRoom: string, user: any) {

    }
    public kichPeopleOutRoom(idRoom: string, user: any) {

    }
    //user
    public createUser(user: any) {
        this.users.push(user);
    }
    public getUserById(id: string) {
        let index = this.users.findIndex(x => x.id == id);
        console.log("----Start getUserById-----");
        console.log("users:" + JSON.stringify(this.users));
        console.log("user:" + JSON.stringify(this.users[index] || {}));
        console.log("----End getUserById-----");
        return this.users[index] || {};
    }
    public getUserByUserName(userName: string) {
        // get index
        let index = this.users.findIndex(x => x.userName == userName);
        console.log("----Start getUserByUserName-----");
        console.log("users:" + JSON.stringify(this.users));
        console.log("user:" + JSON.stringify(this.users[index] || {}));
        console.log("----End getUserByUserName-----");
        return this.users[index] || {};
    }
    public getAllUser(id: string) {
        let data: any[] = [];
        this.users.forEach(u => {
            let flag = true;
            if (u.id == id) {
                flag = false;
            }
            this.getFriend(id).forEach(f => {
                if (u.id == f.info.id || u.id == id) {
                    flag = false;
                }
            })
            if (flag) {
                data.push(u);
            }
        })
        return data;
    }
    public editUser(user: any) {

    }
    public getListUser() {

    }
    public getListFriendById(id: string) {

    }
    public addFriend(data: any) {
        console.log("addFriend:" + JSON.stringify(data));
        let listUserInRoom: any[] = [];

        listUserInRoom.push(data.user.id);
        listUserInRoom.push(data.friend.id);

        let object = {
            room: {
                name: data.user.id + "/" + data.friend.id,
                userCreate: data.user.id,
                userFriend: data.friend.id,
                type: 'private'
            },
            listUserJoinRoom: listUserInRoom
        }

        this.createRoom(object.room, object.listUserJoinRoom);



        // this.Friends.push({ id: data.user.id, friend_id: data.friend.id });
        // this.Friends.push({ id: data.friend.id, friend_id: data.user.id })
    }
    public getFriend(id: string) {
        let data: any[] = [];
        console.log("getFriend(detailRoomsDB):" + JSON.stringify(this.detailRoomsDB))
        this.roomsDB.forEach(room => {
            if (room.type == 'private' && (room.userCreate == id || room.userFriend == id)) {
                this.detailRoomsDB.forEach(dr => {
                    if (dr.room_id == room.id && dr.user_id != id) {
                        room.info = this.getUserById(dr.user_id);

                    }
                })
                data.push(room);
            }
        })

        console.log("getFriend:" + JSON.stringify(data))
        return data;
    }
    public isLogin(user: any) {
        let index = this.users.findIndex(x => x.userName == user.userName);
        if (index > -1) {
            return 0;
            // if(this.users[index].passWord == user.passWord){
            //     return 0;
            // }else{
            //     return -2;
            // }
        } else {
            let id_custom = 'user_' + this.id
            user.id = id_custom;
            this.id++;
            this.createUser(user);
            return -1;
        }
    }
    public getRoomName(m: any) {
        let room: string = m.roomName;
        console.log('data.roomName', m.roomName);
        let user1 = room.split("/")[0];
        let user2 = room.split("/")[1];
        let flag = false;
        console.log('user1', user1);
        console.log('user2', user2);
        console.log('case1', this.rooms.findIndex(x => x.name == user1 + "/" + user2));
        console.log('case1', this.rooms.findIndex(x => x.name == user2 + "/" + user1));

        if (this.rooms.findIndex(x => x.name == user1 + "/" + user2) > -1 || this.rooms.findIndex(x => x.name == user2 + "/" + user1) > -1) {
            console.log("into here");
            flag = true;
            if (this.rooms.findIndex(x => x.name == user1 + "/" + user2) > -1) {
                room = this.rooms[this.rooms.indexOf(user1 + "/" + user2)];
            }
            if (this.rooms.findIndex(x => x.name == user2 + "/" + user1) > -1) {
                room = this.rooms[this.rooms.findIndex(x => x.name == user2 + "/" + user1)];
            }
        }
        if (flag) {

        } else {
            let listUserInRoom: any[] = [];

            listUserInRoom.push(m.object.from);
            listUserInRoom.push(m.object.to);

            let object = {
                room: { name: room, userCreate: m.object.from, type: 'private' },
                listUserJoinRoom: listUserInRoom
            }

            this.createRoom(object.room, object.listUserJoinRoom);
        }
        console.log("rooms:" + JSON.stringify(this.rooms));
        console.log("room:" + room);
        return m;
    }
    public getApp(): express.Application {
        return this.app;
    }
}
