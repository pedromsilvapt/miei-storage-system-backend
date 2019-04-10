import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {TranslationService} from 'angular-l10n';
import {DatatableComponent} from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-custom-datatable',
  templateUrl: './custom-datatable.component.html',
  styleUrls: ['./custom-datatable.component.scss']
})
export class CustomDatatableComponent implements OnInit {

  constructor(private translationService: TranslationService) { }

  private temp: Array<any> = [];

  datatableLengthLimit = 5;

  @ViewChild(DatatableComponent) datatableComponent: DatatableComponent;

  @Input() rows: Array<any> = [];
  @Input() columns: Array<any> = [];
  @Input() sortDefaultColumn: string;

  @Output() clickActionButton: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    this.temp = [...this.rows];
  }

  public onClickActionButton(event: any): void {
    const thisComponent = this;
    if (event.button.type === 'delete') {
      // TODO add swal for delete
      console.log('Remember to add swal');
      thisComponent.clickActionButton.next(event);
    } else {
      this.clickActionButton.next(event);
    }
  }

  public updateFilter(event: any) {
    const value = event.target.value.toLowerCase();
    this.rows = this.temp.filter((d) => {
      let hasLine = false;
      Object.keys(d).forEach(column => {
        if (String(d[column]).toLowerCase().indexOf(value) !== -1) {
          hasLine = true;
        }
      });
      return hasLine;
    });
    this.datatableComponent.offset = 0;
  }

  public updateLength(event: any) {
    this.datatableLengthLimit = Number(event.text);
  }

  public translateDefaultDatatableMessages(): any {
    let datatableTotalMessage = '';
    if (this.rows.length !== this.temp.length) {
      datatableTotalMessage = ' ' + this.translationService.translate('general.of') + ' ' + this.temp.length;
    }
    return {
      emptyMessage: this.translationService.translate('datatable.empty_message'),
      totalMessage: this.temp.length > 1 ? datatableTotalMessage + ' ' +
        this.translationService.translate('datatable.total_message_plural') :
        this.translationService.translate('datatable.total_message'),
      selectedMessage: this.translationService.translate('datatable.selected_message'),
    };
  }

}
