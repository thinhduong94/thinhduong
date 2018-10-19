import { Component, OnInit } from '@angular/core';
import { AppChatEventService } from 'app/app-chat-event.service';
import { Router } from '@angular/router';
import { SocketService } from 'app/chat/shared/services/socket.service';

@Component({
  selector: 'tcc-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  main: any = {};
  constructor(private event: AppChatEventService,
    private socketService: SocketService,
    private router: Router) { }
  IsShow: boolean = false;
  ngOnInit() {
    this.socketService.initSocket();
    this.main = this.event.getUser();
    this.socketService.onlogOut().subscribe(data => {
      this.event.clearUser();
      this.router.navigate(['login']);
    })
  }
  logOut() {
    this.event.getIsShow.emit(this.IsShow);
    this.socketService.logOut({ userName: this.main.userName, passWord: this.main.passWord })

  }

}
