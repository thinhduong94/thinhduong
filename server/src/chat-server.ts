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
    private rooms: any[] = [];
    private users: any[] = [];
    private messages: any[] = [];
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

            socket.on('join', (data: any) => {
                let room: string = this.getRoomName(data.roomName);
                console.log('rooms', this.rooms);
                data.roomName = room;
                console.log(room);
                let mess: any[] = [];
                if (this.messages.length > 0) {
                    for (let _mess of this.messages) {
                        console.log(_mess.room);
                        if (_mess.room == room) {
                            mess = _mess.content;
                        }
                    }
                }
                data.mess = mess;
                socket.join(room);
                socket.emit('update', data);
                socket.broadcast.to(room).emit('join', data);
                console.log(JSON.stringify(data));
            })

            socket.on('loadingRoom', (data: any) => {
                console.log("-----loadingRoom-----");
                let userName: string = data.name;
                let rs: any[] = [];
                if (this.messages.length > 0) {
                    this.messages.forEach(mess => {
                        console.log("-----loadingRoom-----:"+JSON.stringify(mess));
                        let user1 = mess.room.split("/")[0];
                        let user2 = mess.room.split("/")[1];
                        console.log(user1 + user2);
                        if (user1 == userName || user2 == userName) {
                            rs.push(mess);
                        }
                    })
                }

                console.log("loadingRoom"+JSON.stringify(rs));

                socket.emit('loadingRoom', rs);
            })

            socket.on('message', (m: any) => {
                let roomName = this.getRoomName(m.room);
                let message: any = {};
                let flag = false;
                if (this.messages.length > 0) {
                    console.log("room name in message:" + roomName);
                    for (let mess of this.messages) {
                        if (mess.room == roomName) {
                            flag = true;
                            mess["content"].push(m);
                        }
                    }
                    if (!flag) {
                        message = {
                            room: roomName,
                            content: [],
                        };
                        message["content"].push(m);
                        this.messages.push(message);
                    }
                } else {
                    message = {
                        room: roomName,
                        content: [],
                    };
                    message["content"].push(m);
                    this.messages.push(message);
                }
                console.log("messages:" + JSON.stringify(this.messages));
                console.log('[server](message): %s', JSON.stringify(m));
                this.io.to(roomName).emit('message', m);
            });


            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    }
    public getRoomName(roomName: string) {
        let room: string = roomName;
        console.log('data.roomName', roomName);
        let user1 = roomName.split("/")[0];
        let user2 = roomName.split("/")[1];
        let flag = false;
        console.log('user1', user1);
        console.log('user2', user2);
        console.log('case1', this.rooms.indexOf(user1 + "/" + user2));
        console.log('case1', this.rooms.indexOf(user2 + "/" + user1));

        if (this.rooms.indexOf(user1 + "/" + user2) > -1 || this.rooms.indexOf(user2 + "/" + user1) > -1) {
            console.log("into here");
            flag = true;
            if (this.rooms.indexOf(user1 + "/" + user2) > -1) {
                room = this.rooms[this.rooms.indexOf(user1 + "/" + user2)];
            }
            if (this.rooms.indexOf(user2 + "/" + user1) > -1) {

                room = this.rooms[this.rooms.indexOf(user2 + "/" + user1)];
            }
        }
        if (flag) {

        } else {
            this.rooms.push(room);
        }
        console.log("rooms:" + JSON.stringify(this.rooms));
        console.log("room:" + room);
        return room;
    }
    public getApp(): express.Application {
        return this.app;
    }
}
