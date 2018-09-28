import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef, MatDialog, MatTabHeaderPosition } from '@angular/material';
import { DialogUserComponent } from 'app/home/dialog-user/dialog-user.component';
import { DialogUserType } from 'app/home/dialog-user/dialog-user-type';
import { Router, ActivatedRoute } from '@angular/router';
import { AppChatEventService } from 'app/app-chat-event.service';

@Component({
  selector: 'tcc-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  
  dialogRef: MatDialogRef<DialogUserComponent> | null;
  defaultDialogUserParams: any = {
    disableClose: true,
    data: {
      title: 'Welcome',
      dialogType: DialogUserType.NEW
    }
  };
  listF: any = {};
  user: any = {};
  usersCurrent: any[] = [];
  users: any[] = [
    { id: 1, name: "thinh duong", username: "thinh_duong" },
    { id: 2, name: "tri le", username: "tri_le" },
    { id: 3, name: "phung nguyen", username: "phung_nguyen" },
    { id: 4, name: "nhut trang", username: "nhut_trang" },
    { id: 5, name: "le tran", username: "le_tran" }
  ];
  userWithuser: any[] = [
    {
      key: "thinh_duong",
      listUsers: [
        { id: 4, name: "nhut trang", username: "nhut_trang" },
      ]
    },
    {
      key: "nhut_trang",
      listUsers: [
        { id: 1, name: "thinh duong", username: "thinh_duong" },
      ]
    },
    {
      key: "tri_le",
      listUsers: [
        { id: 3, name: "phung nguyen", username: "phung_nguyen" },
        { id: 4, name: "nhut trang", username: "nhut_trang" },
        { id: 5, name: "le tran", username: "le_tran" }
      ]
    }
  ]
  aaaaa:string="aaaaa";
  constructor(private event:AppChatEventService,public dialog: MatDialog,private router: Router,private route: ActivatedRoute) {
    // setTimeout(() => {
    //   this.openUserPopup(this.defaultDialogUserParams);
    // }, 0);
    
    
   }

  ngOnInit() {
      let username = this.event.getUserName;
      this.user = this.users.find(x=>x.username == username);

      this.usersCurrent = this.userWithuser.find(x=>x.key == username).listUsers;
      this.listF = {
        username:this.user,
        listUser:this.usersCurrent
      }
  }

  // private openUserPopup(params): void {
  //   this.dialogRef = this.dialog.open(DialogUserComponent, params);
  //   this.dialogRef.afterClosed().subscribe(paramsDialog => {
  //     if (!paramsDialog) {
  //       return;
  //     }
      

  //   });
  // }
  private chat(user):void{
    this.router.navigate(['chat',{from:this.user.name,to:user.username}]); 
  }
}
