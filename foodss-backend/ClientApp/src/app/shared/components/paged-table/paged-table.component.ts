import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-paged-table',
  templateUrl: './paged-table.component.html',
  styleUrls: ['./paged-table.component.scss']
})
export class PagedTableComponent implements OnInit {

  constructor() { }

  rows = [
    { name: 'Austin', gender: 'Male', company: 'Swimlane' },
    { name: 'Dany', gender: 'Male', company: 'KFC' },
    { name: 'Molly', gender: 'Female', company: 'Burger King' },
  ];
  columns = [
    { prop: 'name' },
    { name: 'Gender' },
    { name: 'Company' }
  ];

  ngOnInit() {
  }

}
