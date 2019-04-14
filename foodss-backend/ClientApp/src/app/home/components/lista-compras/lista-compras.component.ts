import { Component, OnInit } from '@angular/core';
import {DatatablePageContent} from '../../../shared/page/content/datatable-page.content';
import {ColumnDatatable} from '../../../shared/components/custom-datatable/model/column.datatable';
import {Product} from '../../../product/model/product.model';

@Component({
  selector: 'app-lista-compras',
  templateUrl: './lista-compras.component.html'
})
export class ListaComprasComponent extends DatatablePageContent<Array<Product>> implements OnInit {

  constructor() {
    super();
  }

  public products = [
    { id: 1, name: 'Jacob', amount: 1 },
    { id: 2, name: 'Michael', amount: 1 },
    { id: 3, name: 'Joshua', amount: 1 },
    { id: 4, name: 'Matthew', amount: 1 },
    { id: 5, name: 'Ethan', amount: 1 },
    { id: 6, name: 'Andrew', amount: 1 },
    { id: 7, name: 'Daniel', amount: 1 },
    { id: 8, name: 'Anthony', amount: 1 },
    { id: 9, name: 'Christopher', amount: 1 },
    { id: 10, name: 'Joseph', amount: 2 },
    { id: 11, name: 'William', amount: 2 },
    { id: 12, name: 'Alexander', amount: 2 },
    { id: 13, name: 'Ryan', amount: 2 },
    { id: 14, name: 'David', amount: 2 },
    { id: 15, name: 'Nicholas', amount: 2 },
    { id: 16, name: 'Tyler', amount: 2 },
    { id: 17, name: 'James', amount: 2 },
    { id: 18, name: 'John', amount: 2 },
    { id: 19, name: 'Jonathan', amount: 3 },
    { id: 20, name: 'Nathan', amount: 3 },
    { id: 21, name: 'Samuel', amount: 3 },
    { id: 22, name: 'Christian', amount: 3 },
    { id: 23, name: 'Noah', amount: 3 },
    { id: 24, name: 'Dylan', amount: 3 },
    { id: 25, name: 'Benjamin', amount: 3 },
    { id: 26, name: 'Logan', amount: 3 },
    { id: 27, name: 'Jose', amount: 3 },
    { id: 28, name: 'Gabriel', amount: 4 },
    { id: 29, name: 'Zachary', amount: 4 },
    { id: 30, name: 'Jose', amount: 4 },
    { id: 31, name: 'Emily', amount: 4 },
    { id: 32, name: 'Emma', amount: 4 },
    { id: 33, name: 'Madison', amount: 4 },
    { id: 34, name: 'Abigail', amount: 4 },
    { id: 35, name: 'Olivia', amount: 4 },
    { id: 36, name: 'Isabella', amount: 4 },
    { id: 37, name: 'Hannah', amount: 5 },
    { id: 38, name: 'Samantha', amount: 5 },
    { id: 39, name: 'Ava', amount: 5 },
    { id: 40, name: 'Ashley', amount: 5 },
    { id: 41, name: 'Sophia', amount: 5 },
    { id: 42, name: 'Elizabeth', amount: 5 },
    { id: 43, name: 'Alexis', amount: 5 },
    { id: 44, name: 'Grace', amount: 5 },
    { id: 45, name: 'Sarah', amount: 5 },
    { id: 46, name: 'Alyssa', amount: 6 },
    { id: 47, name: 'Mia', amount: 6 },
    { id: 48, name: 'Natalie', amount: 6 },
    { id: 49, name: 'Chloe', amount: 6 },
    { id: 50, name: 'Brianna', amount: 6 },
    { id: 51, name: 'Lauren', amount: 6 },
    { id: 52, name: 'Ella', amount: 6 },
    { id: 53, name: 'Anna', amount: 6 },
    { id: 54, name: 'Taylor', amount: 6 },
    { id: 55, name: 'Kayla', amount: 7 },
    { id: 56, name: 'Hailey', amount: 7 },
    { id: 57, name: 'Jessica', amount: 7 },
    { id: 58, name: 'Victoria', amount: 7 },
    { id: 59, name: 'Jasmine', amount: 7 },
    { id: 60, name: 'Sydney', amount: 7 },
  ];
  public rows: Array<object> = [];
  public columns: Array<ColumnDatatable> = [];

  ngOnInit() {
    this.rows = this.createDatatableRows(this.products);
    this.columns = this.createDatatableColumns();
  }

  public createDatatableColumns(): Array<ColumnDatatable> {
    const columns: Array<ColumnDatatable> = [];

    columns.push(new ColumnDatatable('product', 'general.product', true, true));
    columns.push(new ColumnDatatable('amount', 'general.amount', true));
    columns.push(new ColumnDatatable('actions', 'datatable.actions', false));

    return columns;
  }

  // TODO edit 'any' from parameter from the function below after REST is implemented!!
  public createDatatableRows(products: Array<any>): Array<any> {
    const rows: Array<any> = [];

    if (products) {
      products.forEach(product => {
        const row = {
          id: product.id,
          product: product.name,
          productRouterLink: 'product/' + product.id,
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
