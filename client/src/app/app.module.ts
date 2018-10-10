import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatModule } from './chat/chat.module';
import { SharedModule } from './shared/shared.module';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from 'app/shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeModule } from 'app/home/home.module';
import { DialogUserComponent } from 'app/login/dialog-login/dialog-user.component';
import { LoginModule } from 'app/login/login.module';
import { AppChatEventService } from 'app/app-chat-event.service';
import { PeopleComponent } from './people/people.component';
import { SocketService } from 'app/chat/shared/services/socket.service';
import { GroupComponent } from './group/group.component';
import { ProfileComponent } from './profile/profile.component';
import { HttpClientModule } from '@angular/common/http';
import { userService } from 'app/service/userService';
import { roomService } from 'app/service/roomService';

@NgModule({
  declarations: [
    AppComponent,
    PeopleComponent,
    GroupComponent,
    ProfileComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ChatModule,
    SharedModule,
    HomeModule,
    LoginModule,
    HttpClientModule
  ],
  providers: [AppComponent,AppChatEventService,SocketService,userService,roomService],
  bootstrap: [AppComponent]
})
export class AppModule { }
