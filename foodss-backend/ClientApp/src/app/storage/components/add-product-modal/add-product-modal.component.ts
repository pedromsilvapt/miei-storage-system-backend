import { Component, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { Product } from '../../../product/model/product.model';
import { HttpService } from 'src/app/core/http/http.service';
import { StorageModel } from '../../model/storage.model';
import { NgForm, AbstractControl } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'add-product-modal',
  templateUrl: './add-product-modal.component.html',
  styleUrls: ['./add-product-modal.component.scss']
})
export class AddProductModalComponent {
  @Input('storage') storage: StorageModel;

  @Output('close') closeEvent: EventEmitter<void>;

  @ViewChild('modelForm') modelForm: NgForm;

  @ViewChild('modelQuantity') modelQuantity: AbstractControl;
  @ViewChild('modelExpiryDate') modelExpiryDate: AbstractControl;
  @ViewChild('modelName') modelName: AbstractControl;
  @ViewChild('modelBarcode') modelBarcode: AbstractControl;

  public modalRef: BsModalRef;

  public http: HttpService;

  public productSuggestions: Product[];

  public product: Partial<Product & { barcode: string }> = {};

  public productItem: ProductItemInputModel = {} as any;

  public tabProductActive: boolean = true;

  public tabQuantityActive: boolean = false;

  public today: Date;

  public creating: boolean = false;

  public created: boolean = false;

  public creatingError: any = null;

  constructor(modalRef: BsModalRef, http: HttpService) {
    this.modalRef = modalRef;
    this.http = http;
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);
  }

  ngOnInit() {
    this.reset(false);
  }

  public searchByBarcode(barcode: string): Promise<Product[]> {
    return this.http.get('storage/' + this.storage.id + '/product/search', { params: { barcode: barcode } }).toPromise();
  }

  public searchByName(name: string): Promise<Product[]> {
    return this.http.get('storage/' + this.storage.id + '/product/search', { params: { name: name } }).toPromise();
  }

  public async refreshProductSuggestions() {
    const [productsB, productsN] = await Promise.all([
      this.searchByBarcode(this.product.barcode),
      this.searchByName(this.product.name)
    ]);

    const ids = new Set(productsB.map(p => p.id));

    this.productSuggestions = [
      ...productsB,
      ...productsN.filter(p => !ids.has(p.id))
    ];
  }

  public async changeBarcode(barcode: string) {
    this.product.barcode = barcode;

    await this.refreshProductSuggestions();
  }

  public async changeProductName(name: string) {
    this.product.name = name;

    await this.refreshProductSuggestions();
  }

  public selectProduct(product: Product) {
    this.product = { ...product };

    this.openQuantityTab();
  }

  public openQuantityTab() {
    this.tabQuantityActive = true;
  }

  public async reset(sameProduct: boolean = false) {
    this.creating = false;
    this.created = false;
    this.creatingError = null;

    this.modelQuantity.reset(0);
    this.modelExpiryDate.reset();

    if (sameProduct) {
      this.tabProductActive = false;
      this.tabQuantityActive = true;
    } else {
      this.tabProductActive = true;
      this.tabQuantityActive = false;

      this.product.id = null;
      this.product.name = null;
      this.product.barcode = null;

      this.modelBarcode.reset();
      this.modelName.reset();
    }

    this.productItem.shared = true;
    this.productItem.quantity = 0;
    this.productItem.expiryDate = null;

    this.productSuggestions = [];
  }

  public async create() {
    this.creating = true;

    try {
      // If we are increasing the quantity of a new product, we must
      // create the product first
      if (this.product.id == null) {
        const saved = await this.http.post(`storage/${this.storage.id}/product`, {
          name: this.product.name,
          barcode: this.product.barcode
        }).toPromise();

        this.product.id = saved.id;
      }

      if (this.productItem.quantity > 0) {
        await this.http.post(`storage/${this.storage.id}/product/${this.product.id}/item`, {
          shared: this.productItem.shared,
          quantity: this.productItem.quantity,
          expiryDate: new Date(this.productItem.expiryDate).toISOString()
        }).toPromise();

        this.created = true;
      }
    } catch (error) {
      this.creatingError = error;
    } finally {
      this.creating = false;
    }
  }
}

export interface ProductItemInputModel {
  expiryDate: Date;
  quantity: number;
  shared: boolean;
}

export interface ProductItem {
  id: number;
  productId: number;
  ownerId: number;
  shared: boolean;
  expiryDat: Date;
  addedDate: Date;
}
