import { Component, OnInit } from '@angular/core';
import { DatatablePageContent } from '../../../shared/page/content/datatable-page.content';
import { ColumnDatatable } from '../../../shared/components/custom-datatable/model/column.datatable';
import { Product } from '../../../product/model/product.model';

@Component({
  selector: 'app-expire-date-table',
  templateUrl: './expire-date-table.component.html'

})
export class ExpireDateTableComponent extends DatatablePageContent<Array<Product>> implements OnInit {

  constructor() {
    super();
  }
  public products = [
      {
        id: 1,
        name: 'Arroz',
        amount: 1,
        barCode: '10001',
        hasExpireDate: true,
        userOwner: {
          id: 1,
          name: 'José'
        },
        isShared: false,
        expireDate: new Date('2019-04-11'),
        addedDate: new Date('2019-03-10'),
        consumedDate: null
      },
      {
        id: 2,
        name: 'Café',
        amount: 2,
        barCode: '10002',
        hasExpireDate: true,
        userOwner: {
          id: 1,
          name: 'José'
        },
        isShared: false,
        expireDate: new Date('2019-04-12'),
        addedDate: new Date('2019-03-10'),
        consumedDate: null
      },
      {
        id: 3,
        name: 'Bolacha',
        amount: 3,
        barCode: '10003',
        hasExpireDate: true,
        userOwner: {
          id: 1,
          name: 'José'
        },
        isShared: false,
        expireDate: new Date('2019-04-13'),
        addedDate: new Date('2019-03-10'),
        consumedDate: null
      },
      {
        id: 4,
        name: 'Leite',
        amount: 4,
        barCode: '10004',
        hasExpireDate: true,
        userOwner: {
          id: 1,
          name: 'José'
        },
        isShared: false,
        expireDate: new Date('2019-04-14'),
        addedDate: new Date('2019-03-10'),
        consumedDate: null
      },
      {
        id: 5,
        name: 'Ovos',
        amount: 5,
        barCode: '10005',
        hasExpireDate: true,
        userOwner: {
          id: 1,
          name: 'José'
        },
        isShared: false,
        expireDate: new Date('2019-04-15'),
        addedDate: new Date('2019-03-10'),
        consumedDate: null
      },
      {
        id: 6,
        name: 'Carne',
        amount: 6,
        barCode: '10006',
        hasExpireDate: true,
        userOwner: {
          id: 1,
          name: 'José'
        },
        isShared: false,
        expireDate: new Date('2019-04-16'),
        addedDate: new Date('2019-03-10'),
        consumedDate: null
      }
  ];

  public rows: Array<object> = [];
  public columns: Array<ColumnDatatable> = [];

  ngOnInit() {
    this.rows = this.createDatatableRows(this.products);
    this.columns = this.createDatatableColumns();
  }

  public createDatatableColumns(): Array<ColumnDatatable> {
    const columns: Array<ColumnDatatable> = [];

    columns.push(new ColumnDatatable('name', 'general.product', true, true));
    columns.push(new ColumnDatatable('amount', 'general.amount', true));
    columns.push(new ColumnDatatable('expireDate', 'general.expire_date', true, false, 'date'));
    columns.push(new ColumnDatatable('actions', 'datatable.actions', false));

    return columns;
  }

  // TODO edit 'any' from parameter from the function below after REST is implemented.
  public createDatatableRows(products: Array<any>): Array<any> {
    const rows: Array<any> = [];

    if (products) {
      products.forEach(product => {
        const row = {
          id: product.id,
          name: product.name,
          expireDate: product.expireDate,
          nameRouterLink: 'product/' + product.id,
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
