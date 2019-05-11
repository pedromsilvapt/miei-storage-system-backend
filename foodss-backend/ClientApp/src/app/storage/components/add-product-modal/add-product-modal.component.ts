import { Component, Input, ViewChild, TemplateRef, EventEmitter, Output } from '@angular/core';
import { Product } from '../../../product/model/product.model';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { HttpService } from 'src/app/core/http/http.service';
import { StorageModel } from '../../model/storage.model';

@Component({
  selector: 'add-product-modal',
  templateUrl: './add-product-modal.component.html',
  styleUrls: ['./add-product-modal.component.scss']
})
export class AddProductModalComponent {
  @ViewChild('template') template: TemplateRef<any>;
  
  @Output('close') closeEvent: EventEmitter<void>;

  public modalService: BsModalService;

  public modalRef: BsModalRef;


  public http: HttpService;


  public storage: StorageModel;

  public productSuggestions: Product[];

  public product: Partial<Product & {barcode: string}>;

  public productItem: ProductItemInputModel;

  public tabProductActive: boolean = true;

  public tabQuantityActive: boolean = false;

  public today: Date;

  constructor(modalService: BsModalService, http: HttpService) {
    this.modalService = modalService;
    this.http = http;
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);
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

  public open(storage: StorageModel) {
    this.storage = storage;

    this.product = {};

    this.productItem = {
      expiryDate: null,
      quantity: 0,
      shared: true
    };

    this.modalRef = this.modalService.show(this.template);
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
