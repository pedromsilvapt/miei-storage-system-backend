import {Component, OnDestroy, OnInit} from '@angular/core';
import {StorageModel} from './model/storage.model';
import {BsModalService} from 'ngx-bootstrap';
import {AddProductModalComponent} from './components/add-product-modal/add-product-modal.component';
import {HttpService} from '../core/http/http.service';
import {Product} from '../product/model/product.model';
import {DetailsProductModalComponent} from './components/details-product-modal/details-product-modal.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Language} from 'angular-l10n';
import { DetailsStorageModalComponent } from './components/details-storage-modal/details-storage-modal.component';
import { LoginService } from '../login/login.service';
import { User } from '../user/model/user.model';
import { DeleteStorageModalComponent } from './components/delete-storage-modal/delete-storage-modal.component';

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

  @Language() lang;

  public storages: Array<TabbedStorageModel> = [];

  public session: User;

  protected subscriptions: Subscription[] = [];

  protected isDetailsOpen: boolean = false;

  protected isDeleteOpen: boolean = false;

  protected lastParams: any = {};

  protected lastStorageChanged: {id: number} = null;

  constructor(
    private modalService: BsModalService,
    protected loginService: LoginService,
    protected httpService: HttpService,
    protected route: ActivatedRoute,
    protected router: Router
  ) { }

  async ngOnInit() {
    this.session = this.loginService.getUser();

    this.storages = await this.httpService.get('storage?includeProducts=true').toPromise();

    for (let storage of this.storages) {
      this.prepareStorage(storage);
    }

    this.subscriptions.push(this.route.params.subscribe(async params => {
      this.lastParams = params;

      if (params.storage && params.product) {
        const storage = this.storages.find(s => s.id == params.storage);

        if (storage != null) {
          const product = storage.products.find(p => p.id == params.product);

          if (product != null) {
            this.openDetailsProduct(storage, product);
          }
        }
      } else if (params.storage) {
        this.openDetailsStorage(+params.storage);
      }
    }));

    this.subscriptions.push(this.modalService.onHide.subscribe(async modal => {
      if (this.lastStorageChanged != null && !this.isDeleteOpen) {
        this.refreshStorage(this.lastStorageChanged.id);
        this.lastStorageChanged = null;
      }

      if (this.isDetailsOpen) {
        this.isDetailsOpen = false;

        const newParams = { ...this.lastParams };

        delete newParams.storage;
        delete newParams.product;

        this.router.navigate([newParams], {relativeTo: this.route});
      }

      if (this.isDeleteOpen) {
        this.isDeleteOpen = false;

        if (await this.storageWasRemoved(this.lastStorageChanged.id)) {
          const index = this.storages.findIndex(s => s.id == this.lastStorageChanged.id);

          if (index >= 0) {
            this.storages.splice(index, 1);
          }

          this.lastStorageChanged = null;
        }
      }
    }));
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  public storageWasRemoved(id : number) : Promise<boolean> {
    return this.httpService.get('storage/' + id).toPromise().then(() => false, () => true);
  }

  public trackByStorage(storage: StorageModel) {
    return storage.id;
  }

  public async refreshStorage(id: number) {
    const storage = await this.httpService.get('storage/' + id + '?includeProducts=true').toPromise();

    this.prepareStorage(storage);

    const index = this.storages.findIndex(st => st.id == id);

    if (index >= 0) {
      // Clone the array
      this.storages = this.storages.slice();

      this.storages[index] = storage;
    }
  }

  public prepareStorage(storage: TabbedStorageModel) {
    if (storage.shared) {
      storage.sharedProducts = [];
      storage.privateProducts = [];
      storage.missingProducts = [];
    }

    for (let product of storage.products) {
      if (product.closestExpiryDate) product.closestExpiryDate = new Date(product.closestExpiryDate);
      if (product.sharedClosestExpiryDate) product.sharedClosestExpiryDate = new Date(product.sharedClosestExpiryDate);
      if (product.privateClosestExpiryDate) product.privateClosestExpiryDate = new Date(product.privateClosestExpiryDate);

      if (storage.shared) {
        if (product.sharedCount > 0) {
          storage.sharedProducts.push({
            ...product,
            count: product.sharedCount,
            closestExpiryDate: product.sharedClosestExpiryDate
          });
        }

        if (product.privateCount > 0) {
          storage.privateProducts.push({
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

  openAddProduct(storage: StorageModel) {
    this.lastStorageChanged = storage;

    this.modalService.show(AddProductModalComponent, { initialState: { storage }});
  }

  openDetailsProduct(storage: StorageModel, product: Product) {
    this.lastStorageChanged = storage;

    this.isDetailsOpen = true;

    this.modalService.show(DetailsProductModalComponent, { initialState: { storage, product } });
  }

  openDetailsStorage(storage: StorageModel | number) {
    this.isDetailsOpen = true;
    if (typeof storage === 'number') {
      this.lastStorageChanged = { id: storage };

      this.modalService.show(DetailsStorageModalComponent, { initialState: { storageId: storage } });
    } else {
      this.lastStorageChanged = storage;

      this.modalService.show(DetailsStorageModalComponent, { initialState: { storage } });
    }
  }

  openDeleteStorage(storage: StorageModel) {
    this.isDeleteOpen = true;

    this.lastStorageChanged = storage;

    this.modalService.show(DeleteStorageModalComponent, { initialState: { storage } });
  }
}
