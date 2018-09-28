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

@NgModule({
  declarations: [
    AppComponent
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
    LoginModule
  ],
  providers: [AppComponent,AppChatEventService],
  bootstrap: [AppComponent]
})
export class AppModule { }
