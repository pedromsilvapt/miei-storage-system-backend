import {Component, OnInit} from '@angular/core';
import {DatatablePageContent} from '../../../shared/page/content/datatable-page.content';
import {ColumnDatatable} from '../../../shared/components/custom-datatable/model/column.datatable';
import {ColumnType} from '../../../shared/components/custom-datatable/model/column-type.enum';
import {ProductService} from '../../../product/product.service';
import {ProductItemDTO} from '../../../product/model/product-item-dto.model';
import {MessageUtil} from '../../../shared/util/message.util';
import * as _ from 'lodash';
import {Language} from 'angular-l10n';

@Component({
  selector: 'app-expire-date-table',
  templateUrl: './expire-date-table.component.html'

})
export class ExpireDateTableComponent extends DatatablePageContent implements OnInit {

  constructor(private productService: ProductService, private messageUtil: MessageUtil) {
    super();
  }

  @Language() lang;

  public productItemDTOs: Array<ProductItemDTO> = [];

  public productItemDTOsNearExpiringDate: Array<ProductItemDTO> = [];
  public productItemDTOsAfterExpiringDate: Array<ProductItemDTO> = [];

  public rowsForTableWithProductsNearExpiringDate: Array<any> = [];
  public rowsForTableWithProductsAfterExpiringDate: Array<any> = [];

  public columns: Array<ColumnDatatable> = [];

  ngOnInit() {
    this.fetchProductsItems();
  }

  private fetchProductsItems(): void {
    this.productService.getProductsNearExpiringDate().subscribe((productItemDTOs: Array<ProductItemDTO>) => {
      this.productItemDTOs = productItemDTOs;
      this.createTables(this.productItemDTOs);
    }, error => {
      this.messageUtil.addErrorMessage('general.product', error.message);
    });
  }

  private createTables(productItemDTOs: Array<ProductItemDTO>): void {
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    this.productItemDTOsNearExpiringDate = productItemDTOs
      .filter(productItemDTO => new Date(productItemDTO.expiryDate).getTime() >= todayDate.getTime());

    this.productItemDTOsAfterExpiringDate = productItemDTOs
      .filter(productItemDTO => new Date(productItemDTO.expiryDate).getTime() < todayDate.getTime());

    this.createTableWithProductsNearExpiringDate(this.productItemDTOsNearExpiringDate);
    this.createTableWithProductsAfterExpiringDate(this.productItemDTOsAfterExpiringDate);
  }

  private createTableWithProductsNearExpiringDate(productItemDTOs: Array<ProductItemDTO>): void {
    this.rowsForTableWithProductsNearExpiringDate = this.createDatatableRows(productItemDTOs);
    this.columns = this.createDatatableColumns();
  }

  private createTableWithProductsAfterExpiringDate(productItemDTOs: Array<ProductItemDTO>): void {
    this.rowsForTableWithProductsAfterExpiringDate = this.createDatatableRows(productItemDTOs);
    this.columns = this.createDatatableColumns();
  }

  public createDatatableColumns(): Array<ColumnDatatable> {
    const columns: Array<ColumnDatatable> = [];

    columns.push(new ColumnDatatable('name', 'general.product', true, true));
    columns.push(new ColumnDatatable('expireDate', 'general.expire_date', true, false, ColumnType.ExpireDate));

    return columns;
  }

  public createDatatableRows(productItemDTOs: Array<ProductItemDTO>): Array<any> {
    const rows: Array<any> = [];

    const data = _(productItemDTOs).groupBy(productItemDTO => productItemDTO.productName)
      .map((value, key) => ({name: key, productItemDTO: value})).value();

    if (productItemDTOs) {
      data.forEach(product => {
        const row = {
          id: product.productItemDTO[0].productId,
          name: product.productItemDTO[0].productName + ' (' + product.productItemDTO.length + ')',
          productId: product.productItemDTO[0].productId,
          storageId: product.productItemDTO[0].storageId,
          expireDate: product.productItemDTO[0].expiryDate,
          nameRouterLink: 'storage/' + product.productItemDTO[0].storageId + ';storage=' +
            product.productItemDTO[0].storageId + ';product=' + product.productItemDTO[0].productId
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
    this.productService.deleteProductItem(event.storageId, event.productId, event.id).subscribe(() => {
      this.messageUtil.addSuccessMessage('general.product');
      this.productItemDTOs.splice(this.productItemDTOs.findIndex(productItemDTO => productItemDTO.id === event.id), 1);
      this.createTables(this.productItemDTOs);
    }, error => {
      this.messageUtil.addErrorMessage('general.product', error.message);
    });
  }
}
