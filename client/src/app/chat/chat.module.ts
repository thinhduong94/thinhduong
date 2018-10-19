import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../shared/material/material.module';

import { ChatComponent } from './chat.component';
import { SocketService } from './shared/services/socket.service';
import { DialogUserComponent } from './dialog-user/dialog-user.component';
import { roomService } from 'app/service/roomService';
import {EmojiPickerModule} from 'ng-emoji-picker';
import { EmojiService } from 'app/shared/emojiCustomize/emojiSevice';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    EmojiPickerModule,
  ],
  declarations: [ChatComponent, DialogUserComponent],
  providers: [SocketService,roomService,EmojiService],
  entryComponents: [DialogUserComponent]
})  
export class ChatModule { }
