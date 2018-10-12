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
        return this.http.post<any>(API+'updateRoomContent?id='+id,JSON.stringify(content));
    }
    getDetailByRoomId(id:string):Observable<any>  {
        return this.http.get<any>(API+'getDetailByRoomId?id='+id);
    }
    getUserbyRoomId(id:string):Observable<any>  {
        return this.http.get<any>(API+'getUserbyRoomId?id='+id);
    }
    
}