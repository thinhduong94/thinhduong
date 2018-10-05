import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AppChatEventService } from 'app/app-chat-event.service';
import { Subscription } from 'rxjs/Subscription';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'tcc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isShow:boolean = false;
  isLoading:boolean = true;
  getisShow:Subscription;
  getisLoading:Subscription;
  background='primary';
  ngOnInit(): void {
    this.isShow = this.event.isShow;
  }
  constructor(private router: Router,
    private cdRef:ChangeDetectorRef,
    public snackBar: MatSnackBar,
    private event:AppChatEventService){

  }
  private initModel(): void {
  }
  goto(event){
    console.log(event.tab.textLabel);
    this.router.navigate([event.tab.textLabel]);
  }
  ngOnDestroy(){
    this.getisShow.unsubscribe();
    this.getisLoading.unsubscribe();
  }
  ngAfterViewChecked(){
    this.getisShow = this.event.getIsShow.subscribe(data=>{
      this.isShow = data;
      this.cdRef.detectChanges();
    })
    this.getisLoading = this.event.getisLoading.subscribe(data=>{
      this.isLoading = data;
      this.cdRef.detectChanges();
    })
  }
}
