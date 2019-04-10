import {ColumnDatatable} from '../../components/custom-datatable/model/column.datatable';
import {ActionButtonDatatable} from '../../components/custom-datatable/model/action-button.datatable';

export abstract class DatatablePageContent<T> {

  constructor() {}

  abstract createDatatableColumns(): Array<ColumnDatatable>;
  abstract createDatatableRows(entity: T): Array<any>;
  abstract executeEditAction(event: any): void;
  abstract executeDeleteAction(event: any): void;

  public createDatatableActionButtons(): Array<ActionButtonDatatable> {
    const editButtonClass = 'btn border-info bg-white';
    const editButtonIconClass = 'icon-pencil';
    const editButton: ActionButtonDatatable = new ActionButtonDatatable('edit', editButtonClass, editButtonIconClass);

    const deleteButtonClass = 'btn border-danger bg-white';
    const deleteButtonIconClass = 'icon-trash';
    const deleteButton: ActionButtonDatatable = new ActionButtonDatatable('delete', deleteButtonClass, deleteButtonIconClass);

    return [editButton, deleteButton];
  }

  public callbackEventOnClickActionButton(event: any): void {
    this.executeButtonAction(event);
  }

  public executeButtonAction(event: any): void {
    switch (event.button.type) {
      case 'edit':
        this.executeEditAction(event.row);
        break;
      case 'delete':
        this.executeDeleteAction(event.row);
        break;
      default:
        break;
    }
  }

}
