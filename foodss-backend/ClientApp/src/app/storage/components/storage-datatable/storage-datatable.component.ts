import {Component, Input, OnInit} from '@angular/core';
import {DatatablePageContent} from '../../../shared/page/content/datatable-page.content';
import {Product} from '../../../product/model/product.model';
import {ColumnDatatable} from '../../../shared/components/custom-datatable/model/column.datatable';

@Component({
  selector: 'app-storage-datatable',
  templateUrl: './storage-datatable.component.html'
})
export class StorageDatatableComponent extends DatatablePageContent<Array<Product>> implements OnInit {

  constructor() {
    super();
  }

  public rows: Array<object> = [];
  public columns: Array<ColumnDatatable> = [];

  @Input() products: Array<Product>;

  ngOnInit() {
    this.rows = this.createDatatableRows(this.products);
    this.columns = this.createDatatableColumns();
  }

  public createDatatableColumns(): Array<ColumnDatatable> {
    const columns: Array<ColumnDatatable> = [];

    columns.push(new ColumnDatatable('product', 'general.product', true, true));
    columns.push(new ColumnDatatable('amount', 'general.amount', true));
    columns.push(new ColumnDatatable('expireDate', 'general.expire_date', true, false, 'date'));
    columns.push(new ColumnDatatable('actions', 'datatable.actions', false));

    return columns;
  }

  public createDatatableRows(products: Array<Product>): Array<any> {
    const rows: Array<any> = [];

    if (products) {
      products.forEach(product => {
        const row = {
          id: product.id,
          product: product.name,
          productRouterLink: '/storage-system/product/' + product.id,
          expireDate: product.expireDate,
          amount: product.amount,
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
