import { Component, OnInit, ViewChildren, ViewChild, AfterViewInit, QueryList, EventEmitter, ElementRef, Input, Output } from '@angular/core';
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
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { FormGroup } from '@angular/forms';
import { EmojiService } from 'app/shared/emojiCustomize/emojiSevice';
import { Subscription } from 'rxjs/Subscription';
import { of } from 'rxjs/observable/of';
import { catchError, last, map, tap } from 'rxjs/operators';
const AVATAR_URL = 'https://api.adorable.io/avatars/285';

@Component({
  selector: 'tcc-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 100 })),
      transition('* => void', [
        animate(300, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ChatComponent implements OnInit, AfterViewInit {
  getUserChat: any;
  action = Action;
  // user: User;
  messages: any[] = [];
  messagesDB: any[] = [];
  messageContent: string = "";
  iconText: string = "";
  ioConnection: any;
  room_id: any = "";
  room: any;
  user: any = "";
  toUser: any = "";
  history: any[] = [];
  details: any[] = [];
  IsShow: boolean = false;
  isFocus: boolean = false;
  isShowEmojiInput = false;
  public openPopup: Function;
  public form: FormGroup;
  model: any = '';



  public input: string = '';
  public filterEmojis: string = '';
  public filteredEmojis: any[];
  public allEmojis: Array<any>;
  public popupOpen: boolean = false;
  public lastCursorPosition: number = 0;
  /** Link text */
  @Input() text = 'Upload';
  /** Name used in form which will be sent in HTTP request. */
  @Input() param = 'file';
  /** Target URL for file uploading. */
  @Input() target = 'https://file.io';
  /** File extension that accepted, same as 'accept' of <input type="file" />. 
      By the default, it's set to 'image/*'. */
  @Input() accept = 'image/*';
  /** Allow you to add handler after its completion. Bubble up response text from remote. */
  @Output() complete = new EventEmitter<string>();

  private files: Array<FileUploadModel> = [];

  @ViewChild('inputMessage') messageInput: ElementRef;

  @ViewChild('inputEmoji') inputEmoji: ElementRef;
  url: string = '';
  swap: string = '';
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
    public emojiService: EmojiService
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
        this.messagesDB = array;
      }
      results[1].forEach(d => {
        if (d.user_id != this.user.id) {
          this.details.push(d.user_id);
        }
      });

    })



  }

  ngOnInit(): void {
    this.allEmojis = this.emojiService.getAll();
    this.clean();
    this.event.getIsShow.emit(this.IsShow);
    this.initModel();
    // this.openPopup(false);
    this.room_id = this.event.getRoom || "defual";
    this.scrollToBottom();
    this.initIoConnection();
  }
  ngOnDestroy(): void {

  }

  abc() {
    console.log(1);
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
        this.messages.push(message);
        this.messageContent = "";
        console.log(this.messages);
        this.scrollToBottom();
      });
    this.socketService.onsendedImg()
      .subscribe((message: any) => {
        this.messages.push(message);
        this.messageContent = "";
        console.log(this.messages);
        this.scrollToBottom();
      });
    this.socketService.sended()
      .subscribe((message: any) => {
        console.log(message);
        this.messages.forEach(x => {
          if (x.m_id == message.m_id) {
            x.date = message.date;
          }
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
    console.log(message);
    if (!message) {
      return;
    }
    let m_id = Date.now();
    this.socketService.send({
      room_id: this.room_id,
      details: this.details,
      from: this.user,
      content: message,
      m_id: m_id
    });
    this.messages.push({
      room_id: this.room_id,
      details: this.details,
      from: this.user,
      content: message,
      m_id: m_id
    });
    this.messageContent = "";
  }
  // public addIcon() {
  //   console.log(this.text);
  //   this.messageContent +=this.text;
  //   this.text = '';
  // }
  onKeyup($event) {
    console.log(1);
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
  setPopupAction(fn: any) {
    this.openPopup = fn;
  }
  switchEmojiPicker(type) {
    this.isShowEmojiInput = !this.isShowEmojiInput;
    // this.isFocus = !this.isFocus;
    this.popupOpen = !this.popupOpen;
    this.swap = type;
    // this.openPopup();
  }
  clean() {
    this.filterEmojis = '';
    this.filteredEmojis = this.getFilteredEmojis();
  }
  onBlur(event) {
    this.updateCursor();

  }
  onFocus(event) {
    this.updateCursor();

  }
  updateCursor() {
    this.lastCursorPosition = this.messageInput.nativeElement.selectionStart;
    console.log(this.lastCursorPosition);
  }
  onEmojiClick(e) {
    this.messageContent = this.messageContent.substr(0, this.lastCursorPosition) + e + this.messageContent.substr(this.lastCursorPosition);
  }
  ngOnChanges() {
    if (this.model !== this.messageContent) {
      this.messageContent = this.model;
    }
  }
  onChange(newValue) {
    this.messageContent = this.emojiService.emojify(newValue);
    this.model = this.messageContent;
    console.log(this.messageContent);
  }
  updateFilteredEmojis() {
    this.filteredEmojis = this.getFilteredEmojis();
  }
  getFilteredEmojis() {
    return this.allEmojis.filter((e) => {
      if (this.filterEmojis === '') {
        return true;
      } else {
        for (let alias of e.aliases) {
          if (alias.includes(this.filterEmojis)) {
            return true;
          }
        }
      }
      return false;
    });
  }
  onClick() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.onchange = () => {
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        this.files.push({
          data: file, state: 'in',
          inProgress: false, progress: 0, canRetry: false, canCancel: true
        });
      }
      this.uploadFiles();
    };
    fileUpload.click();
  }

  cancelFile(file: FileUploadModel) {
    file.sub.unsubscribe();
    this.removeFileFromArray(file);
  }

  retryFile(file: FileUploadModel) {
    this.uploadFile(file);
    file.canRetry = false;
  }

  private uploadFile(file: FileUploadModel) {
    // const fd = new FormData();
    // fd.append(this.param, file.data);

    // const req = new HttpRequest('POST', this.target, fd, {
    //   reportProgress: true
    // });

    // file.inProgress = true;
    // file.sub = this._http.request(req).pipe(
    //   map(event => {
    //     switch (event.type) {
    //       case HttpEventType.UploadProgress:
    //         file.progress = Math.round(event.loaded * 100 / event.total);
    //         break;
    //       case HttpEventType.Response:
    //         return event;
    //     }
    //   }),
    //   tap(message => { }),
    //   last(),
    //   catchError((error: HttpErrorResponse) => {
    //     file.inProgress = false;
    //     file.canRetry = true;
    //     return of(`${file.data.name} upload failed.`);
    //   })
    // ).subscribe(
    //   (event: any) => {
    //     if (typeof (event) === 'object') {
    //       this.removeFileFromArray(file);
    //       this.complete.emit(event.body);
    //     }
    //   }
    //   );
  }

  private uploadFiles() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.value = '';

    this.files.forEach(file => {
      this.uploadFile(file);
    });
  }

  private removeFileFromArray(file: FileUploadModel) {
    const index = this.files.indexOf(file);
    if (index > -1) {
      this.files.splice(index, 1);
    }
  }
  sendImg() {
    if (this.url) {
      console.log(this.url);
      if (!this.url) {
        return;
      }
      let m_id = Date.now();
      this.socketService.send({
        room_id: this.room_id,
        details: this.details,
        from: this.user,
        content: this.url,
        m_id: m_id,
        type:"img"
      });
      this.messages.push({
        room_id: this.room_id,
        details: this.details,
        from: this.user,
        content: this.url,
        m_id: m_id,
        type:"img"
      });
      this.messageContent = "";
    }
}
readURL(event: any) {
  if (event.target.files && event.target.files[0]) {
    var reader = new FileReader();

    reader.onload = (event: any) => {
      this.url = event.target.result;
    }

    reader.readAsDataURL(event.target.files[0]);
  }
}
}
export class FileUploadModel {
  data: File;
  state: string;
  inProgress: boolean;
  progress: number;
  canRetry: boolean;
  canCancel: boolean;
  sub?: Subscription;
}