import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { roomService } from 'app/service/roomService';
import { AppChatEventService } from 'app/app-chat-event.service';

@Component({
  selector: 'tcc-dialog-user',
  templateUrl: './dialog-user.component.html',
  styleUrls: ['./dialog-user.component.css']
})
export class DialogUserComponent implements OnInit {
  usernameFormControl = new FormControl('', [Validators.required]);
  previousUsername: string;
  users:any[] = [];
  user:any = {};
  room:any = {};
  constructor(public dialogRef: MatDialogRef<DialogUserComponent>,
    private event: AppChatEventService,
    private roomSv: roomService,
    @Inject(MAT_DIALOG_DATA) public params: any) {
      console.log(params);
    this.room = params.room ? params.room : {};
    this.user = this.event.getUser() || {};
    this.roomSv.getUserbyRoomId(this.room.id).subscribe(data=>{
      this.users  = data.map(val=>({
        id:val.user_id,
        name:val.name,
        user_id:val.user_id
      }));
      this.users = this.users.filter(x=>x.id !=this.user.id);
      console.log(this.users);
    })

  }

  ngOnInit() {
  }

  public onSave(): void {
    this.dialogRef.close({
      username: this.params.username,
      dialogType: this.params.dialogType,
      previousUsername: this.previousUsername
    });
  }
}
