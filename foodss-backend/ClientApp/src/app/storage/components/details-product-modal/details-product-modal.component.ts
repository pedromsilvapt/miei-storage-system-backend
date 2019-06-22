import {Component, EventEmitter, Input, Output} from '@angular/core';
import {HttpService} from 'src/app/core/http/http.service';
import {StorageModel} from '../../model/storage.model';
import {BsModalRef} from 'ngx-bootstrap';
import {DateUtil} from '../../../shared/util/date-util';
import {
  ConsumedProductItem,
  DetailsProductPage,
  EditingProductItemAggregate,
  ProductItem,
  ProductItemAggregate,
  ConsumedProductItemAggregate
} from './enums-interfaces/enums-interfaces.util';

@Component({
  selector: 'details-product-modal',
  templateUrl: './details-product-modal.component.html',
  styleUrls: ['./details-product-modal.component.scss']
})
export class DetailsProductModalComponent {
  @Input('storage') storage: StorageModel;

  @Input('product') product: any;

  @Output('close') closeEvent: EventEmitter<void>;

  public modalRef: BsModalRef;

  public http: HttpService;

  public items: ProductItemAggregate[] = [];

  public consumedItems: ConsumedProductItemAggregate[] = [];

  public shoppingList: any = {};

  public editingItem: EditingProductItemAggregate = null;

  public loading: boolean = false;

  public page: DetailsProductPage = DetailsProductPage.Items;

  public loadedPages = {
    [DetailsProductPage.Consumed]: false,
    [DetailsProductPage.Items]: false,
    [DetailsProductPage.ShoppingList]: false
  };

  constructor(modalRef: BsModalRef, http: HttpService) {
    this.modalRef = modalRef;
    this.http = http;
  }

  public togglePage(page: DetailsProductPage) : void {
    if (this.page == page) {
      this.openPage(DetailsProductPage.Items);
    } else {
      this.openPage(page);
    }
  }

  public openPage(page: DetailsProductPage): void {
    this.page = page;

    if (this.loadedPages[page] == false) {
      this.loadPage(page);
    }
  }

  public loadPage(page: DetailsProductPage) {
    this.loadedPages[page] = true;
    switch (page) {
      case DetailsProductPage.Items:
        return this.loadItemsPage();
      case DetailsProductPage.Consumed:
        return this.loadConsumedPage();
      case DetailsProductPage.ShoppingList:
        return this.loadShoppingListPage();
    }
  }

  public unloadPage(page: DetailsProductPage) {
    this.loadedPages[page] = false;

    switch (page) {
      case DetailsProductPage.Items:
        return this.unloadItemsPage();
      case DetailsProductPage.Consumed:
        return this.unloadConsumedPage();
      case DetailsProductPage.ShoppingList:
        return this.unloadShoppingListPage();
    }
  }

  ngOnInit() {
    this.product.closestExpiryDateLabel = DateUtil.formatExpiryDate(new Date(this.product.closestExpiryDate));

    this.openPage(DetailsProductPage.Items);
  }

  /** <Current Items> */
  public async loadItemsPage() {
    const rawItems: ProductItem[] = await this.http.get(`storage/${this.storage.id}/product/${this.product.id}/item`).toPromise();

    rawItems.forEach(item => item.expiryDate = new Date(item.expiryDate));

    const indexedItems: { [key: string]: ProductItemAggregate } = {};

    const items: ProductItemAggregate[] = [];

    for (let item of rawItems) {
      const key = item.shared + '-' + item.expiryDate;

      if (key in indexedItems) {
        indexedItems[key].count++;
        indexedItems[key].ids.push(item.id);
      } else {
        indexedItems[key] = {
          count: 1,
          shared: item.shared,
          expiryDate: item.expiryDate,
          expiryDateLabel: DateUtil.formatExpiryDate(item.expiryDate),
          expiryLevel: DateUtil.getExpiryDateLevel(item.expiryDate),
          remainingDays: DateUtil.getRemainingDays(item.expiryDate),
          ids: [item.id]
        };

        items.push(indexedItems[key]);
      }
    }

    this.items = items;
  }

  public unloadItemsPage() {
    this.items = [];
  }

  public refreshProductCount() {
    this.product.count = this.items.map(item => item.count).reduce((a, b) => a + b, 0);
  }

  public async remoteConsumeItems(ids: number[]): Promise<void> {
    for (let id of ids) {
      await this.http.post(`storage/${this.storage.id}/product/${this.product.id}/item/${id}/consume`).toPromise();
    }
  }

  public async discardItem(item: ProductItemAggregate) {
    if (this.loading) return;

    this.loading = true;

    try {
      await this.remoteConsumeItems(item.ids);

      this.items = this.items.filter(each => each != item);

      this.refreshProductCount();
    } finally {
      this.loading = false;
    }
  }

  public editItem(item: ProductItemAggregate) {
    this.editingItem = item;
    this.editingItem.originalCount = item.count;
  }

  public async saveEditItem() {
    if (this.loading) return;

    try {
      this.loading = true;

      if (this.editingItem.count == 0) {
        await this.remoteConsumeItems(this.editingItem.ids);

        this.items = this.items.filter(each => each != this.editingItem);

        this.unloadPage(DetailsProductPage.Consumed);
      } else {
        const diff = this.editingItem.count - this.editingItem.originalCount;

        if (diff < 0) {
          await this.remoteConsumeItems(this.editingItem.ids.splice(0, -diff));

          this.unloadPage(DetailsProductPage.Consumed);
        } else if (diff > 0) {
          const newItems = await this.http.post(`storage/${this.storage.id}/product/${this.product.id}/item`, {
            expiryDate: this.editingItem.expiryDate.toUTCString(),
            shared: this.editingItem.shared,
            quantity: diff
          }).toPromise();

          this.editingItem.ids = this.editingItem.ids.concat(newItems.map(item => item.id));
        }
      }
    } catch {
      this.loadItemsPage();
    } finally {
      this.loading = false;
    }

    delete this.editingItem.originalCount;

    this.editingItem = null;

    this.refreshProductCount();
  }

  public cancelEditItem() {
    if (this.loading) return;

    this.editingItem.count = this.editingItem.originalCount;

    delete this.editingItem.originalCount;

    this.editingItem = null;
  }

  public increaseStock(item: ProductItemAggregate) {
    if (this.loading) return;

    item.count++;
  }

  public decreaseStock(item: ProductItemAggregate) {
    if (this.loading) return;

    if (item.count > 0) {
      item.count--;
    }
  }
  /* </Current Items> */

  /* <Consumed Items> */
  public async loadConsumedPage() {
    const rawItems : ConsumedProductItem[] = await this.http.get(`storage/${this.storage.id}/product/${this.product.id}/consumed`).toPromise();

    const indexedItems: { [key: string]: ConsumedProductItemAggregate } = {};

    const items: ConsumedProductItemAggregate[] = [];

    for (let item of rawItems) {
      item.expiryDate = new Date(item.expiryDate);

      item.consumedDate = new Date(item.consumedDate);

      const dateLabel = DateUtil.formatExpiryDate(item.consumedDate);

      const key = item.shared + '-' + dateLabel;

      if (key in indexedItems) {
        indexedItems[key].count++;
      } else {
        indexedItems[key] = {
          count: 1,
          shared: item.shared,
          consumedDate: item.consumedDate,
          consumedDateDays: DateUtil.getRemainingDays(item.consumedDate),
          consumedDateLabel: dateLabel
        };

        items.push(indexedItems[key]);
      }
    }

    items.sort((a, b) => b.consumedDate.getTime() - a.consumedDate.getTime());

    this.consumedItems = items;
  }

  public unloadConsumedPage() {
    this.consumedItems = [];
  }
  /* </Consumed Items> */

  /* <Shopping List> */
  public async loadShoppingListPage() {
    this.shoppingList = await this.http.get(`storage/${this.storage.id}/product/${this.product.id}/shopping-list`).toPromise();
  }

  public unloadShoppingListPage() {
    this.shoppingList = null;
  }

  public async increaseShoppingList() {
    this.shoppingList.count++;

    await this.http.post(`storage/${this.storage.id}/product/${this.product.id}/shopping-list`, { count: this.shoppingList.count }).toPromise();
  }

  public async decreaseShoppingList() {
    if (this.shoppingList.count > 0) {
      this.shoppingList.count--;
    }

    await this.http.post(`storage/${this.storage.id}/product/${this.product.id}/shopping-list`, { count: this.shoppingList.count }).toPromise();
  }
  /* </Shopping List> */
}

