import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { json } from 'express';
import { AppChatEventService } from 'app/app-chat-event.service';
import { SocketService } from 'app/chat/shared/services/socket.service';

@Component({
  selector: 'tcc-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {
  @Input() users: any[] = [];


  constructor(private router: Router, private event: AppChatEventService,
    private socketService: SocketService, ) { }
  ngOnInit() {
    console.log(this.users);
    console.log("PeopleComponent");
  }
  ngAfterViewInit() {
  }
  private chat(room): void {
    // let listUserInRoom: any[] = [];

    // listUserInRoom.push(this.event.getUser);
    // listUserInRoom.push(user);
    this.event.getRoom = room.id;
    this.event.getRoomInfo = room;
    this.router.navigate(['chat']);
  }
}
