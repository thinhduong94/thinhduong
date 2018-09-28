import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'tcc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  ngOnInit(): void {
  }
  constructor(private router: Router){

  }
  private initModel(): void {
  }
  goto(event){
    console.log(event.tab.textLabel);
    this.router.navigate([event.tab.textLabel]);
  }
}
