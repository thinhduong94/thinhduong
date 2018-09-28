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
    }

    public send(message: any): void {
        this.socket.emit('message', message);
    }

    public join(data:any):void{
        this.socket.emit('join',data);
    }

    public leave(data:any):void{
        this.socket.emit('leave',data);
    }
    

    public loadingRoom(data:any){
        this.socket.emit('loadingRoom',data);
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
