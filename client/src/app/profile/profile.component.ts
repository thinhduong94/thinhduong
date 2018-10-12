import { Component, OnInit } from '@angular/core';
import { AppChatEventService } from 'app/app-chat-event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'tcc-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  main: any = {};
  constructor(private event: AppChatEventService, private router: Router) { }

  ngOnInit() {
    this.main = this.event.getUser();

  }
  logOut() {

    this.event.clearUser();
    this.router.navigate(['login']);
  }

}
