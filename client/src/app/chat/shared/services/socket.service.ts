import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Message } from '../model/message';
import { Event } from '../model/event';

import * as socketIo from 'socket.io-client';

const SERVER_URL = 'http://localhost:8080';

@Injectable()
export class SocketService {
    private socket;

    public initSocket(): void {
        this.socket = socketIo(SERVER_URL);

        // this.socket.emit('notification');
    }

    public send(message: any): void {
        this.socket.emit('message', message);
    }

    public notification(id: string) {
        this.socket.emit('notification', id);
    }

    public join(data: any): void {
        this.socket.emit('join', data);
    }

    public leave(data: any): void {
        this.socket.emit('leave', data);
    }

    public getHistories(id: string) {
        this.socket.emit('getHistoyies', id);
    }

    public loadingRoom(data: any) {
        this.socket.emit('loadingRoom', data);
    }
    public messageImg(data: any) {
        this.socket.emit('messageImg', data);
    }
    
    public login(data: any) {
        this.socket.emit('login', data);
    }
    public logOut(data: any) {
        this.socket.emit('logOut', data);
    }

    public getAllUser(id: string) {
        this.socket.emit('getAllUser', id);
    }

    public getFriend(id: string) {
        this.socket.emit('getFriend', id);
    }

    public addFriend(data: any) {
        this.socket.emit('addFriend', data);
    }

    public createRoom(data: any) {
        this.socket.emit('createRoom', data);
    }

    public getRoom(id: string) {
        this.socket.emit('getRoom', id);
    }

    public islogOut(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('islogOut', (data: any) => observer.next(data));
        });
    }

    public onlogOut(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('logOut', (data: any) => observer.next(data));
        });
    }
    
    public onGetNotification(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('notification', (data: any) => observer.next(data));
        });
    }
    public onsendedImg(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('sendedImg', (data: any) => observer.next(data));
        });
    }
    public sended(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('sended', (data: any) => observer.next(data));
        });
    }
    public isOnline(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('isOnline', (data: any) => observer.next(data));
        });
    }
    public onGetHistories(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('getHistoyies', (data: any) => observer.next(data));
        });
    }
    public onGetRoom(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('getRoom', (data: any) => observer.next(data));
        });
    }


    public onCreateRoom(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('createRoom', (data: any) => observer.next(data));
        });
    }

    public onGetFriend(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('getFriend', (data: any) => observer.next(data));
        });
    }

    public onAddFriend(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('addFriend', (data: any) => observer.next(data));
        });
    }
    public onAddFriends(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('addFriends', (data: any) => observer.next(data));
        });
    }


    public onGetAllUser(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('getAllUser', (data: any) => observer.next(data));
        });
    }

    public onGetUserInfo(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('getUserInfo', (data: any) => observer.next(data));
        });
    }


    public onLogin(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('login', (data: any) => observer.next(data));
        });
    }

    public onLoadingRoom(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('loadingRoom', (data: any) => observer.next(data));
        });
    }

    public onUpdate(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('update', (data: any) => observer.next(data));
        });
    }

    public onLeave(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('leave', (data: any) => observer.next(data));
        });
    }

    public onJoin(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('join', (data: any) => observer.next(data));
        });
    }

    public onMessage(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('message', (data: any) => observer.next(data));
        });
    }

    public onEvent(event: Event): Observable<any> {
        return new Observable<Event>(observer => {
            this.socket.on(event, () => observer.next());
        });
    }
}
