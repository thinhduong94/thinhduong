import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material/material.module';
import { HomeComponent } from 'app/home/home.component';
import { SocketService } from 'app/chat/shared/services/socket.service';
import { DialogUserComponent } from 'app/home/dialog-user/dialog-user.component';
import { PeopleComponent } from 'app/home/people/people.component';
import { HistoriesComponent } from 'app/home/histories/histories.component';
import { GroupComponent } from 'app/home/group/group.component';


@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  declarations:  [DialogUserComponent,HomeComponent,PeopleComponent,HistoriesComponent,GroupComponent],
  providers: [SocketService],
  entryComponents: [DialogUserComponent,HomeComponent,PeopleComponent,HistoriesComponent,GroupComponent]
})
export class HomeModule { }
