import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable()
export class AppChatEventService {
  @Output() getDataUserChat: EventEmitter<any> = new EventEmitter();
  getUserChat:any;
  getUserName:any;
  constructor() { }

}
