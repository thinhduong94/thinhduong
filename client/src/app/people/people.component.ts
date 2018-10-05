import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SocketService } from 'app/chat/shared/services/socket.service';
import { AppChatEventService } from 'app/app-chat-event.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
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
  name: string = "";
  userMain: any = {};
  filteredOptions: Observable<User[]>;
  constructor(private socketService: SocketService,
    private event: AppChatEventService,
    public snackBar: MatSnackBar,
    private router: Router) {
    this.userMain = this.event.getUser();
    if (!this.userMain) {
      this.router.navigate(['login']);
    }
    this.socketService.initSocket();
    this.socketService.getAllUser(this.userMain.id);
    this.getNotification = this.socketService.onGetNotification().subscribe(data => {
      console.log(data);
      let index = data.to.findIndex(x => x == this.userMain.id);
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

    this.socketService.onAddFriend().subscribe(data => {
      console.log('added');
    })
    this.socketService.onGetNotification().subscribe(data => {
      console.log("onGetNotification" + data);
    })
    this.socketService.onGetAllUser().subscribe(data => {
      console.log(data);
      this.users = data;
      this.users.forEach(u => {
        u.click = true;
      });
    });
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
    this.users.forEach(u => {
      if (u.id == user.id) {
        u.click = false;
      }
    })

    this.socketService.notification(user.id);
    this.socketService.addFriend({ user: userMain, friend: user })
  }
  ngOnDestroy() {
    this.getNotification.unsubscribe();
  }
}
