import { Component, OnInit,EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { json } from 'express';
import { AppChatEventService } from 'app/app-chat-event.service';

@Component({
  selector: 'tcc-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {
  @Input() listF:any;
  constructor(private router: Router,private event:AppChatEventService) { }
  ngOnInit() {
    console.log("PeopleComponent");
  }
  ngAfterViewInit(){
    console.log(this.listF);
  }
  private chat(user):void{
    this.event.getUserChat={from:this.listF.username,to:user};
    this.router.navigate(['chat']); 
  }
}
