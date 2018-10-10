import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AppChatEventService } from 'app/app-chat-event.service';
import { SocketService } from 'app/chat/shared/services/socket.service';

@Component({
  selector: 'tcc-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  @Input() rooms: any[] = [];
  constructor(private router: Router,private event:AppChatEventService,
     ) { }
  ngOnInit() {
    
    console.log(this.rooms);
    console.log("PeopleComponent");
  }
  ngAfterViewInit(){
  }
  private chat(room):void{
    this.event.getRoom = room.id;
    this.event.getRoomInfo = room;
    this.router.navigate(['chat']); 
  }
}
