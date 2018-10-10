import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SocketService } from 'app/chat/shared/services/socket.service';
import { AppChatEventService } from 'app/app-chat-event.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { roomService } from 'app/service/roomService';
import { userService } from 'app/service/userService';
import * as _ from 'lodash';
import 'rxjs/Rx';
import { room } from 'app/model/room';
export interface User {
  name: string;
}

@Component({
  selector: 'tcc-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})

export class PeopleComponent implements OnInit {

  myControl = new FormControl();
  getNotification: Subscription;
  options: User[] = [
    { name: 'Mary' },
    { name: 'Shelley' },
    { name: 'Igor' }
  ];
  users: any[] = [];
  friends:any[] = [];
  name: string = "";
  userMain: any = {};
  rs:any[] = [];
  filteredOptions: Observable<User[]>;
  constructor(private socketService: SocketService,
    private event: AppChatEventService,
    public snackBar: MatSnackBar,
    private roomSv: roomService,
    private userSv: userService,
    private router: Router) {
    this.userMain = this.event.getUser();
    if (!this.userMain) {
      this.router.navigate(['login']);
    }
    this.socketService.initSocket();


    Observable.forkJoin([
      this.roomSv.getFriendUser(this.userMain.id),
      this.userSv.getAllUser(),
    ]).subscribe((results: any[]) => {
      this.friends = results[0] || [];
      this.friends = this.friends.map(val => ({
        id: val.user_id,
        name: val.name,
        userName: val.userName
      }))
      this.friends.push(this.userMain);

  
      this.users = results[1] || [];

      this.users.push(this.userMain);
      this.rs = _.differenceBy(this.users, this.friends, "id");
      this.rs.forEach(u => {
        u.click = true;
      });
      console.log(results);
      // this.isLoading = false;
      // this.event.getisLoading.emit(this.isLoading);
    })
    // this.socketService.getAllUser(this.userMain.id);
    // this.getNotification = this.socketService.onGetNotification().subscribe(data => {
    //   console.log(data);
    //   let index = data.to.findIndex(x => x == this.userMain.id);
    //   if (index > -1) {

    //     // if (data.type == "addRoom") {
    //     //   this.socketService.getRoom(user.id);
    //     // }
    //     // if (data.type == "addFriend") {
    //     //   this.socketService.getFriend(user.id);
    //     // }
    //     // if (data.type == "addMess") {
    //     //   this.socketService.getHistories(user.id);
    //     // }

    //     let message = data.from.name + " : " + data.content;
    //     this.snackBar.open(message, "", {
    //       duration: 2000,
    //       verticalPosition: 'top',
    //       horizontalPosition: 'center'
    //     });
    //   }
    // })

  }
  ngOnInit() {

    // this.socketService.onAddFriend().subscribe(data => {
    //   console.log('added');
    // })
    // this.socketService.onGetNotification().subscribe(data => {
    //   console.log("onGetNotification" + data);
    // })
    // this.socketService.onGetAllUser().subscribe(data => {
    //   console.log(data);
    //   this.users = data;
    //   this.users.forEach(u => {
    //     u.click = true;
    //   });
    // });
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
      startWith<string | User>(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter(name) : this.options.slice())
      );
  }

  displayFn(user?: User): string | undefined {
    return user ? user.name : undefined;
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }
  private addList() {
    console.log(this.name);
  }
  private addF(user) {
    let userMain = this.event.getUser;
    this.rs.forEach(u => {
      if (u.id == user.id) {
        u.click = false;
      }
    })
    // this.socketService.notification(user.id);
    // this.socketService.addFriend({ user: userMain, friend: user })
    let _room = new room();
    let listUserInRoom:any = [];
    listUserInRoom.push(user.id);
    listUserInRoom.push(this.userMain.id);
    _room.listUserIdInRoom = listUserInRoom;
    _room.name = this.userMain.id+"/"+user.id;
    _room.content = _room.content || '';
    _room.user_friend = user.id;
    _room.user_created = this.userMain.id;
    _room.type = 'private';

    this.roomSv.createRoom(_room).subscribe(data => {
      console.log("create");
    });
  }
  ngOnDestroy() {
    // this.getNotification.unsubscribe();
  }
}
