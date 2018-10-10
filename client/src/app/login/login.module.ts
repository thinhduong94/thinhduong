import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material/material.module';
import { HomeComponent } from 'app/home/home.component';
import { SocketService } from 'app/chat/shared/services/socket.service';
import { PeopleComponent } from 'app/home/people/people.component';
import { HistoriesComponent } from 'app/home/histories/histories.component';
import { GroupComponent } from 'app/home/group/group.component';
import { LoginComponent } from 'app/login/login.component';
import { DialogUserComponent } from 'app/login/dialog-login/dialog-user.component';
import { userService } from 'app/service/userService';


@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  declarations:  [DialogUserComponent,LoginComponent],
  providers: [SocketService,userService],
  entryComponents: [DialogUserComponent,LoginComponent]
})
export class LoginModule { }
