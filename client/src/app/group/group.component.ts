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
  isLoding:boolean;
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


    
    this.loadData();
  

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
    this.isLoding =true;
    this.roomSv.createRoom(_room)
    .finally(()=>this.isLoding = false)
    .subscribe(data => {
      let message = "Room have been created :3"
      this.snackBar.open(message, "", {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
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
  private refresh(){
    
    this.loadData();
  }

  private loadData(){
    this.isLoding =true;
    this.roomSv.getFriendUser(this.user.id)
    .finally(()=>this.isLoding = false)
    .subscribe(data=>{
      this.friends = data || [];
      this.friends = this.friends.map(val => ({
        id: val.user_id,
        name: val.name,
        userName: val.userName,
        click: true
      }));
    })
  }
  ngOnDestroy() {
    // this.getNotification.unsubscribe();
  }
}
