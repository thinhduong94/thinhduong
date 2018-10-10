import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SocketService } from 'app/chat/shared/services/socket.service';
import { AppChatEventService } from 'app/app-chat-event.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { roomService } from 'app/service/roomService';
import { userService } from 'app/service/userService';
import * as _ from 'lodash';
import { room } from 'app/model/room';
@Component({
  selector: 'tcc-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  myControl = new FormControl();
  getNotification: Subscription;
  users: any[] = [];
  friends: any[] = [];
  name: string = "";
  user: any = {};
  rs: any[] = [];
  listUserInRoom: any[] = [];
  constructor(private socketService: SocketService,
    private event: AppChatEventService,
    public snackBar: MatSnackBar,
    private router: Router,
    private roomSv: roomService,
    private userSv: userService
  ) {
    this.user = this.event.getUser() || {};
    if (!this.user) {
      this.router.navigate(['login']);
    }
    this.socketService.initSocket();


    this.roomSv.getFriendUser(this.user.id).subscribe(data=>{
      this.friends = data || [];
      this.friends = this.friends.map(val => ({
        id: val.user_id,
        name: val.name,
        userName: val.userName,
        click: true
      }));
    })

  

  }

  ngOnInit() {

  }
  addRoom() {
    let _room = new room();
    this.listUserInRoom.push(this.user.id)
    _room.listUserIdInRoom = this.listUserInRoom;
    _room.name = this.name;
    _room.content = _room.content || '';
    _room.user_friend = null;
    _room.user_created = this.user.id;
    _room.type = 'room';

    this.roomSv.createRoom(_room).subscribe(data => {
      console.log("create");
    });

    // this.socketService.createRoom({ room: { name: this.name, userCreate: this.event.getUser, type: 'room' }, listUserJoinRoom: this.listUserInRoom })
  }
  addPeople(user) {
    this.listUserInRoom.push(user.id);
    this.friends.forEach(u => {
      if (u.id == user.id) {
        u.click = false;
      }
    })
  }
  ngOnDestroy() {
    // this.getNotification.unsubscribe();
  }
}
