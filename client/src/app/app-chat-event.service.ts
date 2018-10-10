import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable()
export class AppChatEventService {
  @Output() getDataUserChat: EventEmitter<any> = new EventEmitter();
  @Output() getIsShow: EventEmitter<any> = new EventEmitter();
  @Output() getisLoading: EventEmitter<any> = new EventEmitter();
  getUserChat:any;
  getUserName:any;
  // getUser:any;
  getRoom:any;
  getRoomInfo:any;
  isShow:boolean = false;
  constructor() { 

  }

  getUser(){
    let user = JSON.parse(localStorage.getItem("user"))
    console.log(user);
    return  user;
  }
  clearUser(){
    localStorage.removeItem("user");
  }
}
