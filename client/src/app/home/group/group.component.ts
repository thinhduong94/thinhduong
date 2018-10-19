import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AppChatEventService } from 'app/app-chat-event.service';
import { SocketService } from 'app/chat/shared/services/socket.service';
import { MatDialogRef, MatDialog } from '@angular/material';
import { DialogUserComponent } from 'app/home/dialog-user/dialog-user.component';
import { DialogUserType } from 'app/home/dialog-user/dialog-user-type';
import { roomService } from 'app/service/roomService';

@Component({
  selector: 'tcc-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  @Input() rooms: any[] = [];
  user:any = {};
  dialogRef: MatDialogRef<DialogUserComponent> | null;
  defaultDialogUserParams: any = {
    disableClose: true,
    data: {
      title: 'Welcome',
      dialogType: DialogUserType.NEW
    }
  };
  constructor(private router: Router,
    private roomSv: roomService,
    public dialog: MatDialog,
    private event: AppChatEventService,
  ) { }
  ngOnInit() {
    this.user = this.event.getUser();
    console.log(this.rooms);
    console.log("PeopleComponent");
  }
  ngAfterViewInit() {
  }

  private openUserPopup(params): void {
    this.dialogRef = this.dialog.open(DialogUserComponent, params);
    this.dialogRef.afterClosed().subscribe(paramsDialog => {
      if (!paramsDialog) {
        return;
      }

      if (paramsDialog.oldName !== paramsDialog.newName) {
        this.roomSv.updateRoom(paramsDialog.id, paramsDialog.newName)
          .subscribe(data => {
            console.log("update");
            this.roomSv.getGruopUser(this.user.id).subscribe(group => {
              this.rooms = group.map(val => ({
                id: val.room_id,
                name: val.name,
                type: val.type,
                user_id: val.user_Created,
                content: val.content
              }));
            })
          });
      }


    });
  }
  public onClickUserInfo(room) {
    this.openUserPopup({
      data: {
        room: room,
        title: 'Edit Details',
        dialogType: DialogUserType.EDIT
      }
    });
  }
  private chat(room): void {
    this.event.getRoom = room.id;
    this.event.getRoomInfo = room;
    this.router.navigate(['chat']);
  }
}
