import {Component, OnInit} from '@angular/core';
import {DatatablePageContent} from '../../../shared/page/content/datatable-page.content';
import {ColumnDatatable} from '../../../shared/components/custom-datatable/model/column.datatable';
import {MessageUtil} from '../../../shared/util/message.util';
import {ShoppingListDTO} from './dto/shopping-list-dto.model';
import {ShoppingListService} from './shopping-list.service';
import {ActionButtonDatatable} from '../../../shared/components/custom-datatable/model/action-button.datatable';
import * as _ from 'lodash';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html'
})
export class ShoppingListComponent extends DatatablePageContent implements OnInit {

  constructor(private shoppingListService: ShoppingListService, private messageUtil: MessageUtil) {
    super();
  }

  public shoppingListDTOs: Array<ShoppingListDTO> = [];

  public rows: Array<any> = [];
  public columns: Array<ColumnDatatable> = [];
  public disableAmountButtons = false;

  ngOnInit() {
    this.fetchShoppingListProducts();
  }

  private fetchShoppingListProducts(): void {
    this.shoppingListService.getShoppingListProducts().subscribe((shoppingListDTOs: Array<ShoppingListDTO>) => {
      this.shoppingListDTOs = shoppingListDTOs;
      this.createTable(shoppingListDTOs);
    }, error => {
      this.messageUtil.addErrorMessage('shopping_list.shopping_list', error.message);
    });
  }

  private createTable(shoppingListDTOs: Array<ShoppingListDTO>): void {
    this.rows = this.createDatatableRows(shoppingListDTOs);
    this.columns = this.createDatatableColumns();
  }

  public createDatatableColumns(): Array<ColumnDatatable> {
    const columns: Array<ColumnDatatable> = [];

    columns.push(new ColumnDatatable('name', 'general.product', true, true));
    columns.push(new ColumnDatatable('amountWithAction', 'general.amount', true));
    columns.push(new ColumnDatatable('actions', 'datatable.actions', false));

    return columns;
  }

  public createDatatableActionButtons(): Array<ActionButtonDatatable> {
    const deleteButtonClass = 'btn border-danger bg-white text-dark-danger';
    const deleteButtonIconClass = 'fas fa-trash-alt';
    const deleteButton: ActionButtonDatatable = new ActionButtonDatatable('delete',
      deleteButtonClass, deleteButtonIconClass);

    return [deleteButton];
  }

  public createDatatableRows(shoppingListDTOs: Array<ShoppingListDTO>): Array<any> {
    const rows: Array<any> = [];

    if (shoppingListDTOs) {
      shoppingListDTOs.forEach(shoppingListDTO => {
        const row = {
          id: shoppingListDTO.id,
          name: shoppingListDTO.productName,
          nameRouterLink: 'product/' + shoppingListDTO.idProduct,
          amountWithAction: shoppingListDTO.count,
          actions: this.createDatatableActionButtons()
        };
        rows.push(row);
      });
    }

    return rows;
  }

  public updateAmount(row: {id, count}) {
    this.disableAmountButtons = true;
    this.shoppingListService.updateShoppingListItemAmount(row)
      .subscribe(response => {
        const index = _.findIndex(this.shoppingListDTOs, {id: row.id});
        this.shoppingListDTOs[index].count = response.count;
        const rowIndex = _.findIndex(this.shoppingListDTOs, {id: row.id});
        this.rows[rowIndex].amountWithAction = response.count;
        this.disableAmountButtons = false;
      }, error => {
        this.disableAmountButtons = false;
        this.fetchShoppingListProducts();
        this.messageUtil.addErrorMessage('Datatable', error.message);
      });
  }

  public executeEditAction(event: any): void {
    console.log('Editou o produto de id: ' + event.id);
  }

  public executeDeleteAction(event: any): void {
    this.shoppingListService.deleteShoppingListItem(event.id).subscribe(() => {
      this.messageUtil.addSuccessMessage('product.shopping_list');
      this.shoppingListDTOs.splice(this.shoppingListDTOs.findIndex(shoppingListDTO => shoppingListDTO.id === event.id), 1);
      this.createTable(this.shoppingListDTOs);
    }, error => {
      this.messageUtil.addErrorMessage('product.shopping_list', error.message);
    });
  }
}
