import { Component, OnInit, ViewChildren, ViewChild, AfterViewInit, QueryList, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MatList, MatListItem } from '@angular/material';

import { Action } from './shared/model/action';
import { Event } from './shared/model/event';
import { Message } from './shared/model/message';
import { User } from './shared/model/user';
import { SocketService } from './shared/services/socket.service';
import { DialogUserComponent } from './dialog-user/dialog-user.component';
import { DialogUserType } from './dialog-user/dialog-user-type';
import { ActivatedRoute } from '@angular/router';
import { Subscriber } from 'rxjs/Subscriber';
import { AppChatEventService } from 'app/app-chat-event.service';


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
  room:any = "";
  user:any = "";
  toUser:any = "";
  history:any[] = [];
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

  // getting a reference to the items/messages within the list
  @ViewChildren(MatListItem, { read: ElementRef }) matListItems: QueryList<MatListItem>;

  constructor(private socketService: SocketService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private appChatEventService: AppChatEventService
  ) { }

  ngOnInit(): void {
    this.initModel();
    this.getUserChat = this.appChatEventService.getUserChat;

      console.log(this.getUserChat);
      this.user = this.getUserChat.from.username;
      this.toUser = this.getUserChat.to.username;
      this.room = this.user+"/"+this.toUser;
      this.initIoConnection();
  }
  ngOnDestroy():void{

  }
  ngAfterViewInit(): void {
    // subscribing to any changes in the list of items / messages
    this.matListItems.changes.subscribe(elements => {
      this.scrollToBottom();
    });
  }

  // auto-scroll fix: inspired by this stack overflow post
  // https://stackoverflow.com/questions/35232731/angular2-scroll-to-bottom-chat-style
  private scrollToBottom(): void {
    try {
      this.matList.nativeElement.scrollTop = this.matList.nativeElement.scrollHeight;
    } catch (err) {
    }
  }

  private initModel(): void {
    // const randomId = this.getRandomId();
    // this.user.avatar = `${AVATAR_URL}/${randomId}.png`
     
  }

  private initIoConnection(): void {
    this.socketService.initSocket();
    
    this.socketService.loadingRoom({name:this.user});

    this.socketService.join({roomName:this.room,from:this.user});

    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: any) => {
        this.messages.push(message);
    });


    this.socketService.onLoadingRoom().subscribe(data=>{
      this.history = data;
  });


    this.socketService.onUpdate().subscribe(data=>{
        this.messages = data.mess;
        console.log(data.mess);
    });


    this.socketService.onJoin().subscribe(data=>{
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

      this.user.name = "thinh"+this.user.id;
      this.room = paramsDialog.username;
      if (paramsDialog.dialogType === DialogUserType.NEW) {
        this.initIoConnection();
        this.sendNotification(paramsDialog, Action.JOINED);
      } else if (paramsDialog.dialogType === DialogUserType.EDIT) {
        this.sendNotification(paramsDialog, Action.RENAME);
      }
    });
  }

  public sendMessage(message: string): void {
    if (!message) {
      return;
    }

    this.socketService.send({
      room:this.room,
      from: this.user,
      content: message
    });
    this.messageContent = null;
  }

  public sendNotification(params: any, action: Action): void {
    let message: any;

      message = {
        room:this.room,
        from: this.user,
        action: action
      }

    this.socketService.send(message);
  }
}
