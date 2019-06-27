import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TabbedStorageModel} from '../storage.component';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-storage-detail',
  templateUrl: './storage-detail.component.html'
})
export class StorageDetailComponent implements OnInit {

  public storage: TabbedStorageModel;
  public id: number;

  private activatedRouteSubscription: Subscription;


  constructor(private activatedRoute: ActivatedRoute) {
  }

  async ngOnInit() {
    this.activatedRouteSubscription = this.activatedRoute.params.subscribe(params => {
      this.id = +params.id;
    });
  }
}
