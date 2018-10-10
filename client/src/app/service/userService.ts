import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "app/model/user";
const API = "http://localhost:8080/";
@Injectable()
export class userService {
    constructor(private http: HttpClient) {

    }
    getAllUser() {
        return this.http.get<any>(API+'getAllUser');
    }
    login(userName: string, passWord: string) {
        let data =
            {
                "userName": userName,
                "passWord": passWord,
            };
        return this.http.post<any>(API+'login',JSON.stringify(data));
    }
    register(user:User){
        let data =
            {
                "userName": user.userName,
                "passWord": user.passWord,
                "name":user.name
            };
        return this.http.post<any>(API+'register',JSON.stringify(data));
    }
}