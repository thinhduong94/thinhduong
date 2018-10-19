import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { roomService } from 'app/service/roomService';
import { AppChatEventService } from 'app/app-chat-event.service';
import { room } from 'app/model/room';
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
  type:string = "";
  name:string = "";
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
        user_id:val.user_id,
        click:false,
      }));
      this.users = this.users.filter(x=>x.id !=this.user.id);
      if(this.user.id == this.room.user_id){
        this.type = 'kick';
      }else{
        this.type = 'add';
      }
      this.name =   this.room.name;
      console.log(this.users);
    })
  }
  ngOnInit() {
  }

  public onSave(): void {
    this.dialogRef.close({
      oldName: this.room.name,
      newName: this.name,
      id:this.room.id
    });
  }
  kick(item){
    this.roomSv.deleteNumberInRoom(this.room.id,item.id)
    .subscribe(data => {
      console.log("deteled");
    });
  }
  onOut(){
    
  }
  add(user){
    this.users.forEach(u => {
      if (u.id == user.id) {
        u.click = true;
      }
    })
    let _room = new room();
    let listUserInRoom:any = [];
    listUserInRoom.push(user.id);
    listUserInRoom.push(this.user.id);
    _room.listUserIdInRoom = listUserInRoom;
    _room.name = this.user.id+"/"+user.id;
    _room.content = _room.content || '';
    _room.user_friend = user.id;
    _room.user_created = this.user.id;
    _room.type = 'private';
    this.roomSv.createRoom(_room)
    .subscribe(data => {
      console.log("create");
    });
  }
}
