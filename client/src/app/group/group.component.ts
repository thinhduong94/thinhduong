import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SocketService } from 'app/chat/shared/services/socket.service';
import { AppChatEventService } from 'app/app-chat-event.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'tcc-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  myControl = new FormControl();
  getNotification: Subscription;
  users: any[] = [];
  name: string = "";
  user: any = {};
  listUserInRoom: any[] = [];
  constructor(private socketService: SocketService,
    private event: AppChatEventService,
    public snackBar: MatSnackBar,
    private router: Router
  ) {
    this.user = this.event.getUser() || {};
    if(!this.user){
      this.router.navigate(['login']);
    }
    this.socketService.initSocket();
    this.socketService.getFriend(this.user.id);
    this.getNotification = this.socketService.onGetNotification().subscribe(data => {
      console.log(data);
      let index = data.to.findIndex(x => x == this.user.id);
      if (index > -1) {

        // if (data.type == "addRoom") {
        //   this.socketService.getRoom(user.id);
        // }
        // if (data.type == "addFriend") {
        //   this.socketService.getFriend(user.id);
        // }
        // if (data.type == "addMess") {
        //   this.socketService.getHistories(user.id);
        // }

        let message = data.from.name + " : " + data.content;
        this.snackBar.open(message, "", {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
      }
    })
   }

  ngOnInit() {
   
   
    
    this.listUserInRoom.push(this.user.id);
    this.user = this.event.getUser || {};
   
    
    this.socketService.onGetFriend().subscribe(data => {
      this.users = data;
      this.users.forEach(u=>{
        u.click = true;
      });
      console.log(data);
    })
    this.socketService.onCreateRoom().subscribe(data => {
      console.log("created");
    })
  }
  addRoom() {
    this.socketService.createRoom({ room: { name: this.name, userCreate: this.event.getUser, type: 'room' }, listUserJoinRoom: this.listUserInRoom })
  }
  addPeople(user) {
    this.listUserInRoom.push(user.info.id);
    this.users.forEach(u=>{
      if(u.info.id == user.info.id){
        u.click = false;
      }
    })
  }
  ngOnDestroy() {
    this.getNotification.unsubscribe();
  }
}
