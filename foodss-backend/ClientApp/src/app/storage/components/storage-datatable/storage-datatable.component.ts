import {Component, Input, OnInit, OnChanges} from '@angular/core';
import {DatatablePageContent} from '../../../shared/page/content/datatable-page.content';
import {Product} from '../../../product/model/product.model';
import {ColumnDatatable} from '../../../shared/components/custom-datatable/model/column.datatable';
import {ColumnType} from '../../../shared/components/custom-datatable/model/column-type.enum';

@Component({
  selector: 'app-storage-datatable',
  templateUrl: './storage-datatable.component.html'
})
export class StorageDatatableComponent extends DatatablePageContent implements OnInit, OnChanges {

  constructor() {
    super();
  }

  public rows: Array<object> = [];
  public columns: Array<ColumnDatatable> = [];

  @Input() products: Array<Product>;

  protected lastProducts: Array<Product> = null;

  ngOnInit() {
    this.rows = this.createDatatableRows(this.products);
    this.columns = this.createDatatableColumns();
  }

  ngOnChanges() {
    if (this.products !== this.lastProducts) {
      this.rows = this.createDatatableRows(this.products);
    }
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
      products.forEach(product => {
        const row = {
          id: product.id,
          name: product.name,
          nameRouterLink: [{ storage: product.storageId, product: product.id } ],
          expireDate: product.closestExpiryDate,
          amount: product.count,
          actions: this.createDatatableActionButtons()
        };
        rows.push(row);
      });
    }

    return rows;
  }

  public executeEditAction(event: any): void {
    console.log('Editou o produto de id: ' + event.id);
  }

  public executeDeleteAction(event: any): void {
    console.log('Deletou o produto de id: ' + event.id);
  }

}
