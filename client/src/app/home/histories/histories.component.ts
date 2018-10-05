import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AppChatEventService } from 'app/app-chat-event.service';
import { SocketService } from 'app/chat/shared/services/socket.service';

@Component({
  selector: 'tcc-histories',
  templateUrl: './histories.component.html',
  styleUrls: ['./histories.component.css']
})
export class HistoriesComponent implements OnInit {
  @Input() histories: any[] = [];
  constructor(private router: Router,private event:AppChatEventService,
    private socketService: SocketService, ) { }
  ngOnInit() {
    console.log("PeopleComponent");
  }
  private chat(user):void{
    this.event.getRoom = user.id;
    this.event.getRoomInfo = user;
    this.router.navigate(['chat']); 
  }
}
