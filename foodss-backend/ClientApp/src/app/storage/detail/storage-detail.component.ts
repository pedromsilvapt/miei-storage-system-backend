import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TabbedStorageModel} from '../storage.component';
import {Subscription} from 'rxjs';
import {Language} from 'angular-l10n';
import {StorageModel} from '../model/storage.model';
import {BsModalService} from 'ngx-bootstrap';
import {HttpService} from '../../core/http/http.service';
import {AddProductModalComponent} from '../components/add-product-modal/add-product-modal.component';
import {Product} from '../../product/model/product.model';
import {DetailsProductModalComponent} from '../components/details-product-modal/details-product-modal.component';

@Component({
  selector: 'app-storage-detail',
  templateUrl: './storage-detail.component.html'
})
export class StorageDetailComponent implements OnInit, OnDestroy {

  @Language() lang;

  public storage: TabbedStorageModel;

  public idStorage: number;

  private activatedRouteSubscription: Subscription;

  protected subscriptions: Subscription[] = [];

  protected isDetailsOpen = false;

  protected lastParams: any = {};

  protected lastStorageChanged: StorageModel = null;

  constructor(
    private modalService: BsModalService,
    protected httpService: HttpService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router
  ) { }

  async ngOnInit() {
    this.activatedRouteSubscription = this.activatedRoute.params.subscribe(params => {
      this.idStorage = params.idStorage;

      this.httpService.get('storage/' + this.idStorage + '?includeProducts=true').subscribe(storage => {
        this.storage = storage;
        this.prepareStorage(this.storage);

        const productFetched = this.storage.products.find(p => p.id == params.idProduct);

        this.lastParams = params;

        if (params.idStorage && params.idProduct) {
          if (this.storage != null) {
            const product = this.storage.products.find(p => p.id == params.idProduct);

            if (product != null) {
              this.openDetailsProduct(this.storage, product);
            }
          }
        }

        this.subscriptions.push(this.modalService.onHide.subscribe(modal => {
          if (this.lastStorageChanged != null) {
            this.refreshStorage(this.lastStorageChanged.id);

            this.lastStorageChanged = null;
          }

          if (this.isDetailsOpen) {
            this.isDetailsOpen = false;

            const newParams = { ...this.lastParams };

            delete newParams.storage;
            delete newParams.product;

            this.router.navigate([newParams], {relativeTo: this.activatedRoute});
          }
        }));
      });
    });
  }

  public async refreshStorage(id: number) {
    this.storage = await this.httpService.get('storage/' + id + '?includeProducts=true').toPromise();
    this.prepareStorage(this.storage);
  }

  public prepareStorage(storage: TabbedStorageModel) {
    if (storage.shared) {
      storage.sharedProducts = [];
      storage.privateProducts = [];
      storage.missingProducts = [];
    }

    for (const product of storage.products) {
      if (product.closestExpiryDate) {
        product.closestExpiryDate = new Date(product.closestExpiryDate);
      }
      if (product.sharedClosestExpiryDate) {
        product.sharedClosestExpiryDate = new Date(product.sharedClosestExpiryDate);
      }
      if (product.privateClosestExpiryDate) {
        product.privateClosestExpiryDate = new Date(product.privateClosestExpiryDate);
      }

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

  ngOnDestroy(): void {
    this.activatedRouteSubscription.unsubscribe();
  }
}
