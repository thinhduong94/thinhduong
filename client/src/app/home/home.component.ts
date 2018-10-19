import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef, MatDialog, MatTabHeaderPosition, MatSnackBar } from '@angular/material';
import { DialogUserComponent } from 'app/home/dialog-user/dialog-user.component';
import { DialogUserType } from 'app/home/dialog-user/dialog-user-type';
import { Router, ActivatedRoute } from '@angular/router';
import { AppChatEventService } from 'app/app-chat-event.service';
import { SocketService } from 'app/chat/shared/services/socket.service';
import { Subscription } from 'rxjs';
import { roomService } from 'app/service/roomService';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import 'rxjs/Rx';
import * as _ from 'lodash';
import { userService } from 'app/service/userService';
@Component({
  selector: 'tcc-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  getNotification: Subscription;
  getFriend: Subscription;
  getRoom: Subscription;
  getHistories: Subscription;
  dialogRef: MatDialogRef<DialogUserComponent> | null;
  defaultDialogUserParams: any = {
    disableClose: true,
    data: {
      title: 'Welcome',
      dialogType: DialogUserType.NEW
    }
  };
  users: any[] = [];
  user: any = {};
  rooms: any[] = [];
  histories: any[] = [];
  IsShow: boolean = true;
  isLoading: boolean;
  constructor(private event: AppChatEventService,
    private socketService: SocketService,
    private roomSv: roomService,
    private userSv: userService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router, private route: ActivatedRoute) {
    // setTimeout(() => {
    //   this.openUserPopup(this.defaultDialogUserParams);
    // }, 0);
    this.user = this.event.getUser();
    console.log(this.event.getUser());
    if (!this.user) {
      this.router.navigate(['login']);
    }

    this.loadData();
    this.socketService.initSocket();
    this.getNotification = this.socketService.onGetNotification().subscribe(rs => {
      let index = rs.data.findIndex(x => x == this.user.id);
      if (index > -1) {
        let message = "You have a new message :3";
        this.loadData();
        this.snackBar.open(message, "", {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
      }
      console.log(rs.data);
    })
    // this.socketService.getHistories(this.user.id);
    // this.socketService.getFriend(this.user.id);
    // this.socketService.getRoom(this.user.id);
    // this.getNotification = this.socketService.onGetNotification().subscribe(data => {
    //   console.log(data);
    //   let index = data.to.findIndex(x => x == this.user.id);
    //   if (index > -1) {

    //     if (data.type == "addRoom") {
    //       this.socketService.getRoom(this.user.id);
    //     }
    //     if (data.type == "addFriend") {
    //       this.socketService.getFriend(this.user.id);
    //     }
    //     if (data.type == "addMess") {
    //       this.socketService.getHistories(this.user.id);
    //     }

    //     let message = data.from.name + " : " + data.content;
    //     this.snackBar.open(message, "", {
    //       duration: 2000,
    //       verticalPosition: 'top',
    //       horizontalPosition: 'center'
    //     });
    //   }
    // })
  }

  loadData() {
    this.isLoading = true;
    Observable.forkJoin([
      this.roomSv.getFriendUser(this.user.id),
      this.roomSv.getGruopUser(this.user.id),
      this.roomSv.getHistories(this.user.id),
      this.userSv.getAllUser()
    ])
      .finally(() => this.isLoading = false)
      .subscribe((results: any[]) => {
        this.users = results[0] || [];

        this.users = this.users.map(val => ({
          id: val.room_id,
          user_id: val.id,
          name: val.name,
          type: val.type,
          content: val.content,
          status: val.status
        }));

        this.rooms = results[1] || [];
        this.histories = results[2] || [];


        this.histories.forEach(x => {

          if (x.type == "private") {
            let user = "";
            let user1 = x.name.split("/")[0];
            let user2 = x.name.split("/")[1];
            if (user1 == this.user.id) {
              user = user2;
            }
            if (user2 == this.user.id) {
              user = user1;
            }

            let index = results[3].findIndex(y => y.id == user);

            let userinfo = results[3][index];

            x.name = userinfo.name;

          }


          if (x.content.length > 0) {
            let array = x.content == "" ? [] : JSON.parse(x.content);
            x.lasterMess = array[array.length - 1];
          }
        })


        this.histories = this.histories.map(val => ({
          id: val.room_id,
          name: val.name,
          type: val.type,
          content: val.content,
          lasterMess: val.lasterMess
        }));

        this.histories = _.orderBy(this.histories, function (o) {

          return moment(o.lasterMess ? o.lasterMess.date : Date.now());
        }, ['desc']);



        this.rooms = this.rooms.map(val => ({
          id: val.room_id,
          name: val.name,
          type: val.type,
          user_id: val.user_Created,
          content: val.content
        }));
        console.log(results);
        this.isLoading = false;
        this.event.getisLoading.emit(this.isLoading);
      })
  }

  ngOnInit() {



    // this.socketService.notification(user.id);
    // this.getRoom = this.socketService.onGetRoom().subscribe(data => {
    //   this.rooms = data;
    //   console.log(data);
    // })
    // // openSnackBar(message: string, action: string) {
    // //   this.snackBar.open(message, action, {
    // //     duration: 2000,
    // //   });
    // // }

    // this.getHistories = this.socketService.onGetHistories().subscribe(data => {
    //   this.histories = data;
    //   console.log(data);
    //   this.isLoading = false;
    // this.event.getisLoading.emit(this.isLoading);
    // })



    this.socketService.isOnline().subscribe(data => {
      console.log(data);
      this.users.forEach(x => {
        if (x.user_id == data.id) {
          x.status = true;
          let message = data.name +" Online :3";
          this.snackBar.open(message, "", {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
        }
      })
    })

    this.socketService.islogOut().subscribe(data => {
      console.log(data);
      this.users.forEach(x => {
        if (x.user_id == data.id) {
          x.status = false;
          let message = data.name +" Offline :3";
          this.snackBar.open(message, "", {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
        }
      })
    })
    this.event.getIsShow.emit(this.IsShow);
  }
  ngOnDestroy() {
    // this.getNotification.unsubscribe();
    // this.getFriend.unsubscribe();
    // this.getRoom.unsubscribe();
    // this.getHistories.unsubscribe();
  }
  // private openUserPopup(params): void {
  //   this.dialogRef = this.dialog.open(DialogUserComponent, params);
  //   this.dialogRef.afterClosed().subscribe(paramsDialog => {
  //     if (!paramsDialog) {
  //       return;
  //     }


  //   });
  // }
  private chat(user): void {

  }
}
