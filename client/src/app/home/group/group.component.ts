import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tcc-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  constructor() { }

  ngOnInit() {
    console.log("GroupComponent")
  }
  ngAfterViewInit(){
    console.log("GroupComponent");
  }
  ngOnDestroy(){
    console.log("GroupComponent");
  }
}
