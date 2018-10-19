import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { json } from 'express';
import { AppChatEventService } from 'app/app-chat-event.service';
import { SocketService } from 'app/chat/shared/services/socket.service';
import { roomService } from 'app/service/roomService';

@Component({
  selector: 'tcc-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {
  @Input() users: any[] = [];
  user:any = {};

  constructor(private router: Router, 
    private event: AppChatEventService,
    private roomSv: roomService,

    private socketService: SocketService, ) { }
  ngOnInit() {
    console.log(this.users);
    console.log("PeopleComponent");
  }
  ngAfterViewInit() {
    this.user = this.event.getUser();
  }
  private chat(room): void {
    // let listUserInRoom: any[] = [];

    // listUserInRoom.push(this.event.getUser);
    // listUserInRoom.push(user);
    this.event.getRoom = room.id;
    this.event.getRoomInfo = room;

    this.router.navigate(['chat']);
  }
  unFriend(item){
    this.roomSv.deleteRoom(item.id)
    .subscribe(data => {
      console.log("update");
      this.roomSv.getFriendUser(this.user.id).subscribe(group => {
        this.users = group.map(val => ({
          id: val.room_id,
          user_id: val.id,
          name: val.name,
          type: val.type,
          content: val.content
        }));
      })
    });
  }
}
