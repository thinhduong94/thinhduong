import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogUserComponent } from 'app/login/dialog-login/dialog-user.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { DialogUserType } from 'app/login/dialog-login/dialog-user-type';
import { AppChatEventService } from 'app/app-chat-event.service';

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
  constructor(private router: Router,public dialog: MatDialog,private event: AppChatEventService) { }
  username: string;
  password: string;
  ngOnInit() {
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
    this.dialogRef = this.dialog.open(DialogUserComponent, params);
    this.dialogRef.afterClosed().subscribe(paramsDialog => {
      if (!paramsDialog) {
        return;
      }
      this.event.getUserName = paramsDialog.username;
      this.router.navigate(['home']); 
    });
  }
}
