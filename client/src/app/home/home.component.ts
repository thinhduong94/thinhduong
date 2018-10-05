import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef, MatDialog, MatTabHeaderPosition, MatSnackBar } from '@angular/material';
import { DialogUserComponent } from 'app/home/dialog-user/dialog-user.component';
import { DialogUserType } from 'app/home/dialog-user/dialog-user-type';
import { Router, ActivatedRoute } from '@angular/router';
import { AppChatEventService } from 'app/app-chat-event.service';
import { SocketService } from 'app/chat/shared/services/socket.service';
import { Subscription } from 'rxjs';

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
    this.socketService.initSocket();
    this.socketService.getHistories(this.user.id);
    this.socketService.getFriend(this.user.id);
    this.socketService.getRoom(this.user.id);
    this.getNotification = this.socketService.onGetNotification().subscribe(data => {
      console.log(data);
      let index = data.to.findIndex(x => x == this.user.id);
      if (index > -1) {

        if (data.type == "addRoom") {
          this.socketService.getRoom(this.user.id);
        }
        if (data.type == "addFriend") {
          this.socketService.getFriend(this.user.id);
        }
        if (data.type == "addMess") {
          this.socketService.getHistories(this.user.id);
        }

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
  


    // this.socketService.notification(user.id);
    this.getRoom = this.socketService.onGetRoom().subscribe(data => {
      this.rooms = data;
      console.log(data);
    })
    // openSnackBar(message: string, action: string) {
    //   this.snackBar.open(message, action, {
    //     duration: 2000,
    //   });
    // }

    this.getHistories = this.socketService.onGetHistories().subscribe(data => {
      this.histories = data;
      console.log(data);
      this.isLoading = false;
      this.event.getisLoading.emit(this.isLoading);
    })



    this.getFriend = this.socketService.onGetFriend().subscribe(data => {
      this.users = data;
      console.log(data);
    })
    this.event.getIsShow.emit(this.IsShow);
  }
  ngOnDestroy() {
    this.getNotification.unsubscribe();
    this.getFriend.unsubscribe();
    this.getRoom.unsubscribe();
    this.getHistories.unsubscribe();
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
