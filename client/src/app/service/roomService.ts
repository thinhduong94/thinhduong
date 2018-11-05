import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { room } from "app/model/room";
import { Observable } from "rxjs/Observable";
const API = "http://localhost:8080/";
@Injectable()
export class roomService {
    constructor(private http: HttpClient) {

    }
    getGruopUser(id:string):Observable<any> {
        return this.http.get<any>(API+'getGruopUser?id='+id);
    }
    getFriendUser(id:string):Observable<any>  {
        return this.http.get<any>(API+'getFriendUser?id='+id);
    }
    createRoom(_room:room):Observable<any>{
        return this.http.post<any>(API+'createRoom',JSON.stringify(_room));
    }
    getRoomById(id:string):Observable<any>  {
        return this.http.get<any>(API+'getRoomById?id='+id);
    }
    getHistories(id:string):Observable<any>  {
        return this.http.get<any>(API+'getHistories?id='+id);
    }
    updateRoomContent(id:string,content:any):Observable<any>  {
        return this.http.put<any>(API+'updateRoomContent?id='+id,JSON.stringify(content));
    }
    accept(id:string):Observable<any>  {
        return this.http.put<any>(API+'accept?id='+id,JSON.stringify({}));
    }
    
    getDetailByRoomId(id:string):Observable<any>  {
        return this.http.get<any>(API+'getDetailByRoomId?id='+id);
    }
    deleteNumberInRoom(id:string,user_id:string):Observable<any>  {
        return this.http.post<any>(API+'deleteNumberInRoom?id='+id,JSON.stringify({user_id:user_id}));
    }
    updateRoom(id:string,name:string):Observable<any>  {

        return this.http.post<any>(API+'updateRoom?id='+id,JSON.stringify({name:name}));
    }
    getUserbyRoomId(id:string):Observable<any>  {
        return this.http.get<any>(API+'getUserbyRoomId?id='+id);
    }

    deleteRoom(id:string):Observable<any>  {
        return this.http.delete(API+'deleteRoom?id='+id);
    }
    
}