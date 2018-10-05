import { Component, OnInit } from '@angular/core';
import { AppChatEventService } from 'app/app-chat-event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'tcc-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private event:AppChatEventService, private router: Router) { }

  ngOnInit() {


  }
  logOut(){

    this.event.clearUser();
    this.router.navigate(['login']);
  }

}
