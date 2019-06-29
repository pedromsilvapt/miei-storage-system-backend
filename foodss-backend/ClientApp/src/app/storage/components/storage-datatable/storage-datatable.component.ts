import {Component, Input, OnInit, OnChanges, EventEmitter, Output} from '@angular/core';
import {DatatablePageContent} from '../../../shared/page/content/datatable-page.content';
import {Product} from '../../../product/model/product.model';
import {ColumnDatatable} from '../../../shared/components/custom-datatable/model/column.datatable';
import {ColumnType} from '../../../shared/components/custom-datatable/model/column-type.enum';
import {ProductService} from '../../../product/product.service';
import {MessageUtil} from '../../../shared/util/message.util';
import {ActionButtonDatatable} from '../../../shared/components/custom-datatable/model/action-button.datatable';

@Component({
  selector: 'app-storage-datatable',
  templateUrl: './storage-datatable.component.html'
})
export class StorageDatatableComponent extends DatatablePageContent implements OnInit, OnChanges {

  constructor(private productService: ProductService, private messageUtil: MessageUtil) {
    super();
  }

  public rows: Array<object> = [];
  public columns: Array<ColumnDatatable> = [];

  @Input() products: Array<Product>;

  @Output() clickDeleteButton: EventEmitter<any> = new EventEmitter();

  protected lastProducts: Array<Product> = null;

  ngOnInit() {
    this.createTable();
  }

  ngOnChanges() {
    if (this.products !== this.lastProducts) {
      this.rows = this.createDatatableRows(this.products);
    }
  }

  private createTable(): void {
    this.rows = this.createDatatableRows(this.products);
    this.columns = this.createDatatableColumns();
  }

  public createDatatableColumns(): Array<ColumnDatatable> {
    const columns: Array<ColumnDatatable> = [];

    columns.push(new ColumnDatatable('name', 'general.product', true, true));
    columns.push(new ColumnDatatable('amount', 'general.amount', true));
    columns.push(new ColumnDatatable('expireDate', 'general.expire_date', true, false, ColumnType.ExpireDate));
    columns.push(new ColumnDatatable('actions', 'datatable.actions', false));

    return columns;
  }

  public createDatatableRows(products: Array<Product>): Array<any> {
    this.lastProducts = products;

    const rows: Array<any> = [];

    if (products) {
      console.log(products);
      products.forEach(product => {
        const row = {
          id: product.id,
          name: product.name,
          nameRouterLink: [{ storage: product.storageId, product: product.id } ],
          expireDate: product.closestExpiryDate,
          amount: product.count,
          storageId: product.storageId,
          productId: product.id,
          actions: this.createDatatableActionButtons()
        };
        rows.push(row);
      });
    }

    return rows;
  }

  public createDatatableActionButtons(): Array<ActionButtonDatatable> {
    const deleteButtonClass = 'btn border-danger bg-white text-dark-danger';
    const deleteButtonIconClass = 'fas fa-trash-alt';
    const deleteButton: ActionButtonDatatable = new ActionButtonDatatable('delete',
      deleteButtonClass, deleteButtonIconClass);

    return [deleteButton];
  }

  public executeEditAction(event: any): void {
    console.log('Editou o produto de id: ' + event.id);
  }

  public executeDeleteAction(event: any): void {
    console.log(event); // TODO
    // this.productService.deleteProductItem(event.storageId, event.productId, event.id).subscribe(() => {
    //   this.messageUtil.addSuccessMessage('general.product');
    // }, error => {
    //   this.messageUtil.addErrorMessage('general.product', error.message);
    // });
  }

}
