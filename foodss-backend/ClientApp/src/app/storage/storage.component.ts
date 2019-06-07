import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { StorageModel } from './model/storage.model';
import * as _ from 'lodash';
import { BsModalService } from 'ngx-bootstrap';
import { AddProductModalComponent } from './components/add-product-modal/add-product-modal.component';
import { HttpService } from '../core/http/http.service';
import { Product } from '../product/model/product.model';
import { DetailsProductModalComponent } from './components/details-product-modal/details-product-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

export interface TabbedStorageModel extends StorageModel {
  privateProducts?: Product[];
  sharedProducts?: Product[];
  missingProducts?: Product[];
}

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html'
})
export class StorageComponent implements OnInit, OnDestroy {
  public storages: Array<TabbedStorageModel> = [];

  protected subscriptions: Subscription[] = [];

  protected isDetailsOpen: boolean = false;

  protected lastParams: any = {};

  constructor(
    private modalService: BsModalService,
    protected httpService: HttpService,
    protected route: ActivatedRoute,
    protected router: Router
  ) { }

  async ngOnInit() {
    this.storages = await this.httpService.get('storage?includeProducts=true').toPromise();

    for (let storage of this.storages) {
      if (storage.shared) {
        storage.sharedProducts = [];
        storage.privateProducts = [];
        storage.missingProducts = [];
      }

      for (let product of storage.products) {
        product.closestExpiryDate = new Date(product.closestExpiryDate);

        if (storage.shared) {
          if (product.sharedCount > 0) {
            storage.sharedProducts.push({
              ...product,
              count: product.sharedCount,
              closestExpiryDate: product.sharedClosestExpiryDate
            });
          }

          if (product.privateCount > 0) {
            storage.sharedProducts.push({
              ...product,
              count: product.privateCount,
              closestExpiryDate: product.privateClosestExpiryDate
            });
          }

          if (product.privateCount == 0 && product.sharedCount == 0) {
            storage.missingProducts.push(product);
          }
        }
      }
    }

    this.subscriptions.push(this.route.params.subscribe(params => {
      this.lastParams = params;

      if (params.storage && params.product) {
        const storage = this.storages.find(s => s.id == params.storage);

        if (storage != null) {
          const product = storage.products.find(p => p.id == params.product);

          if (product != null) {
            this.openDetailsProduct(storage, product);
          }
        }
      }
    }));

    this.subscriptions.push(this.modalService.onHide.subscribe(modal => {
      if (this.isDetailsOpen) {
        this.isDetailsOpen = false;

        const newParams = { ...this.lastParams };

        delete newParams.storage;
        delete newParams.product;

        this.router.navigate([newParams], {relativeTo: this.route});
      }
    }));
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  openAddProduct(storage: Storage) {
    this.modalService.show(AddProductModalComponent, { initialState: { storage }});
  }

  openDetailsProduct(storage: StorageModel, product: Product) {
    this.isDetailsOpen = true;

    this.modalService.show(DetailsProductModalComponent, { initialState: { storage, product } });
  }
}
