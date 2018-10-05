import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { HomeComponent } from 'app/home/home.component';
import { LoginComponent } from 'app/login/login.component';
import { PeopleComponent } from 'app/people/people.component';
import { GroupComponent } from 'app/group/group.component';
import { ProfileComponent } from 'app/profile/profile.component';

const routes: Routes = [
  {
    path: 'home', component: HomeComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'chat', component: ChatComponent
  },
  {
    path: 'people', component: PeopleComponent
  },
  {
    path:'group',component:GroupComponent
  },
  {
    path:'profile',component:ProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
