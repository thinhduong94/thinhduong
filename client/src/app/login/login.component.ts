import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogUserComponent } from 'app/login/dialog-login/dialog-user.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { DialogUserType } from 'app/login/dialog-login/dialog-user-type';
import { AppChatEventService } from 'app/app-chat-event.service';
import { SocketService } from 'app/chat/shared/services/socket.service';
import { Subscribable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';
import { userService } from 'app/service/userService';
import { User } from 'app/model/user';


@Component({
  selector: 'tcc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  dialogRef: MatDialogRef<DialogUserComponent> | null;
  islogin:boolean = false;
  isregister:boolean = false;
  defaultDialogUserParams: any = {
    disableClose: true,
    data: {
      title: 'Welcome',
      dialogType: DialogUserType.NEW
    }
  };
  userLogin: any = {
    username: '',
    password: ''
  };
  userRegister: any = {
    username: '',
    password: '',
    name: ''
  }
  isLoading: boolean ;
  constructor(private router: Router,
    private usersv: userService,
    public dialog: MatDialog, private event: AppChatEventService,
    private socketService: SocketService,
  ) {
    this.event.getisLoading.emit(this.isLoading);

  }


  onLogin: Subscription;

  onGetUserInfo: Subscription;

  ngOnInit() {
    // this.socketService.initSocket();
    // this.onLogin = this.socketService.onLogin().subscribe(data => {
    //   this.onGetUserInfo = this.socketService.onGetUserInfo().subscribe(user => {
    //     localStorage.setItem("user", JSON.stringify(user));
    //     this.router.navigate(['home']);
    //   });
    // });

    // setTimeout(() => {
    //   this.openUserPopup(this.defaultDialogUserParams);
    // }, 0);
  }
  register() {
    let user = new User();

    user.userName = this.userRegister.username;
    user.passWord = this.userRegister.password;
    user.name = this.userRegister.name;
    this.isLoading = true;
    this.usersv.register(user)
    .finally(()=>this.isLoading = false)
    .subscribe(data=>{
      if(data){
        user.id = data.data.insertId
        localStorage.setItem("user", JSON.stringify(user));
        this.router.navigate(['home']);
        console.log(data);
      }else{
        this.isregister = true;
      }
     
    })

  }
  login(): void {
    this.usersv.login(this.userLogin.username,this.userLogin.password).subscribe(data=>{
      if(data["data"].length > 0){
        localStorage.setItem("user", JSON.stringify(data["data"][0]));
        this.router.navigate(['home']);
      }else{
        this.islogin = true;
      }
    })
  
  }
  
  ngOnDestroy() {
    // this.onLogin.unsubscribe();
    // this.onGetUserInfo.unsubscribe();
  }
}
