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
import { element } from 'protractor';
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
  isLoding:boolean;
  keyWord:string;
  readData:any[] = [];
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

    this.loadData();
    
  }
  ngOnInit() {

    
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
  private loadData(){
    this.isLoding = true;
    Observable.forkJoin([
      this.roomSv.getFriendUser(this.userMain.id),
      this.userSv.getAllUser(),
    ])
    .finally(()=>this.isLoding = false)
    .subscribe((results: any[]) => {
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
      this.readData = this.rs;
      console.log(results);
    })
  }
  private refresh(){
    this.loadData();
  }
  private search(val){
    let termData = this.readData;
    let userData = this.rs;
    if(val.trim().length > 0){
      userData = termData.filter(function (item) {
        return (
          item.name.toLowerCase().includes(val.toLowerCase()) 
        );
      });
    }else{
      userData =  this.readData;
    }
    this.rs = userData;
    console.log(1);
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
    this.isLoding = true;
    this.roomSv.createRoom(_room)
    .finally(()=>this.isLoding = false)
    .subscribe(data => {
      console.log("create");
    });
  }
  ngOnDestroy() {
    // this.getNotification.unsubscribe();
  }
}
