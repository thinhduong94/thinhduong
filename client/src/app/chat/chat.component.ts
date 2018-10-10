import { Component, OnInit, ViewChildren, ViewChild, AfterViewInit, QueryList, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MatList, MatListItem } from '@angular/material';

import { Action } from './shared/model/action';
import { Event } from './shared/model/event';
import { Message } from './shared/model/message';
import { User } from './shared/model/user';
import { SocketService } from './shared/services/socket.service';
import { DialogUserComponent } from './dialog-user/dialog-user.component';
import { DialogUserType } from './dialog-user/dialog-user-type';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscriber } from 'rxjs/Subscriber';
import { AppChatEventService } from 'app/app-chat-event.service';
import { roomService } from 'app/service/roomService';

import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
const AVATAR_URL = 'https://api.adorable.io/avatars/285';

@Component({
  selector: 'tcc-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {
  getUserChat: any;
  action = Action;
  // user: User;
  messages: Message[] = [];
  messageContent: string;
  ioConnection: any;
  room_id: any = "";
  room: any;
  user: any = "";
  toUser: any = "";
  history: any[] = [];
  details: any[] = [];
  IsShow: boolean = false;
  dialogRef: MatDialogRef<DialogUserComponent> | null;
  defaultDialogUserParams: any = {
    disableClose: true,
    data: {
      title: 'Welcome',
      dialogType: DialogUserType.NEW
    }
  };
  private getDataUserChat: Subscriber<any>;
  // getting a reference to the overall list, which is the parent container of the list items
  @ViewChild(MatList, { read: ElementRef }) matList: ElementRef;
  // @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  // getting a reference to the items/messages within the list
  @ViewChildren(MatListItem, { read: ElementRef }) matListItems: QueryList<MatListItem>;

  constructor(private socketService: SocketService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private event: AppChatEventService,
    private router: Router,
    private roomSv: roomService,

  ) {
    this.user = this.event.getUser();
    if (!this.user) {
      this.router.navigate(['login']);
    }
    this.room = this.event.getRoomInfo;
    Observable.forkJoin([
      this.roomSv.getRoomById(this.room.id),
      this.roomSv.getDetailByRoomId(this.room.id)
    ]).subscribe((results: any[]) => {

      if (results[0][0].content.length > 0) {
        let array = JSON.parse(this.room.content);
        this.messages = array;
      }
      results[1].forEach(d => {
        if (d.user_id != this.user.id) {
          this.details.push(d.user_id);
        }
      });

    })



  }

  ngOnInit(): void {

    this.event.getIsShow.emit(this.IsShow);
    this.initModel();

    this.room_id = this.event.getRoom || "defual";
    this.scrollToBottom();
    this.initIoConnection();
  }
  ngOnDestroy(): void {

  }
  ngAfterViewInit(): void {
    // subscribing to any changes in the list of items / messages
    this.matListItems.changes.subscribe(elements => {
      this.scrollToBottom();
    });
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.matList.nativeElement.scrollTop = this.matList.nativeElement.scrollHeight;
    } catch (err) { }
  }
  // auto-scroll fix: inspired by this stack overflow post
  // https://stackoverflow.com/questions/35232731/angular2-scroll-to-bottom-chat-style

  private initModel(): void {
    // const randomId = this.getRandomId();
    // this.user.avatar = `${AVATAR_URL}/${randomId}.png`

  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    // this.socketService.loadingRoom({ room_id: this.room });

    this.socketService.join(this.room_id);

    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: any) => {
        console.log(this.messages);
        this.messages.push(message);
        this.scrollToBottom();
        this.roomSv.updateRoomContent(this.room.id, this.messages).subscribe(data => {
          console.log("hi vong mong manh");
        })
      });


    // this.socketService.onLoadingRoom().subscribe(data => {
    //   this.history = data;
    // });


    // this.socketService.onUpdate().subscribe(data => {
    //   if(data.content){
    //     this.messages = JSON.parse(data.content) || [];
    //   }
    // });


    this.socketService.onJoin().subscribe(data => {
      console.log(data);
    });

    this.socketService.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('connected');
      });

    this.socketService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      });
  }

  private getRandomId(): number {
    return Math.floor(Math.random() * (1000000)) + 1;
  }

  public onClickUserInfo() {
    this.openUserPopup({
      data: {
        username: this.user.name,
        title: 'Edit Details',
        dialogType: DialogUserType.EDIT
      }
    });
  }

  private openUserPopup(params): void {
    this.dialogRef = this.dialog.open(DialogUserComponent, params);
    this.dialogRef.afterClosed().subscribe(paramsDialog => {
      if (!paramsDialog) {
        return;
      }

      this.user.name = "thinh" + this.user.id;
      // this.room = paramsDialog.username;
      if (paramsDialog.dialogType === DialogUserType.NEW) {
        this.initIoConnection();
        this.sendNotification(paramsDialog, Action.JOINED);
      } else if (paramsDialog.dialogType === DialogUserType.EDIT) {
        this.sendNotification(paramsDialog, Action.RENAME);
      }
    });
  }

  public sendMessage(message: string): void {
    console.log(this.details);
    if (!message) {
      return;
    }
    this.socketService.send({
      room_id: this.room_id,
      details: this.details,
      from: this.user,
      content: message
    });
    
    this.messageContent = null;
  }

  public sendNotification(params: any, action: Action): void {
    let message: any;

    message = {
      room_id: this.room_id,
      from: this.user,
      action: action
    }

    this.socketService.send(message);
  }
  public goToHome() {
    this.router.navigate(['home']);
  }
}
