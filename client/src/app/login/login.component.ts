import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogUserComponent } from 'app/login/dialog-login/dialog-user.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { DialogUserType } from 'app/login/dialog-login/dialog-user-type';
import { AppChatEventService } from 'app/app-chat-event.service';
import { SocketService } from 'app/chat/shared/services/socket.service';
import { Subscribable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tcc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  dialogRef: MatDialogRef<DialogUserComponent> | null;
  defaultDialogUserParams: any = {
    disableClose: true,
    data: {
      title: 'Welcome',
      dialogType: DialogUserType.NEW
    }
  };

  isLoading: boolean = false;
  constructor(private router: Router, public dialog: MatDialog, private event: AppChatEventService,
    private socketService: SocketService,
  ) {
    this.event.getisLoading.emit(this.isLoading);

  }
  username: string;
  password: string;

  onLogin: Subscription;

  onGetUserInfo: Subscription;

  ngOnInit() {
    this.socketService.initSocket();
    this.onLogin = this.socketService.onLogin().subscribe(data => {
      this.onGetUserInfo = this.socketService.onGetUserInfo().subscribe(user => {
        localStorage.setItem("user", JSON.stringify(user));
        this.router.navigate(['home']);
      });
    });

    setTimeout(() => {
      this.openUserPopup(this.defaultDialogUserParams);
    }, 0);
  }
  login(): void {
    if (this.username == 'admin' && this.password == 'admin') {
      
      this.router.navigate(["home"]);
    } else {
      alert("Invalid credentials");
    }
  }
  private openUserPopup(params): void {
    this.isLoading = true;
    this.event.getisLoading.emit(this.isLoading);
    this.dialogRef = this.dialog.open(DialogUserComponent, params);
    this.dialogRef.afterClosed().subscribe(paramsDialog => {
      if (!paramsDialog) {
        return;
      }
      this.event.getUserName = paramsDialog.username;

      let user = {
        userName: paramsDialog.username,
        name: paramsDialog.name,
      }

      this.socketService.login(user);
    });
  }
  ngOnDestroy() {
    this.onLogin.unsubscribe();
    this.onGetUserInfo.unsubscribe();
  }
}
