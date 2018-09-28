import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tcc-histories',
  templateUrl: './histories.component.html',
  styleUrls: ['./histories.component.css']
})
export class HistoriesComponent implements OnInit {
  constructor() { }

  ngOnInit() {
    console.log("HistoriesComponent");
  }
  ngAfterViewInit(){
    console.log("HistoriesComponent");
  }

}
