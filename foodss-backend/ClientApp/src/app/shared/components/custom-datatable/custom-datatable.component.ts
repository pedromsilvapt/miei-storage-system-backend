import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  IterableDiffer,
  IterableDiffers,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {TranslationService} from 'angular-l10n';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {MessageUtil} from '../../util/message.util';
import { validateConfig } from '@angular/router/src/config';

@Component({
  selector: 'app-custom-datatable',
  templateUrl: './custom-datatable.component.html',
  styleUrls: ['./custom-datatable.component.scss']
})
export class CustomDatatableComponent implements OnInit, DoCheck {

  @ViewChild(DatatableComponent) datatableComponent: DatatableComponent;

  lastFilter: string = '';
  rows: Array<any> = [];
  @Input() columns: Array<any> = [];
  @Input() sortDefaultColumn: string;
  @Input() disableAmountButtons = false;

  @Output() clickActionButton: EventEmitter<any> = new EventEmitter();
  @Output() clickAmountButton: EventEmitter<any> = new EventEmitter();

  @Input() allRows: Array<any> = [];
  private iterableDifferForRows: IterableDiffer<any>;

  public datatableLengthLimit = 5;

  constructor(public translationService: TranslationService, private messageUtil: MessageUtil,
              private differs: IterableDiffers) {
    this.iterableDifferForRows = this.differs.find([]).create(null);
  }

  ngOnInit() {
    this.rows = [...this.allRows];
  }

  ngDoCheck(): void {
    const changesInRow = this.iterableDifferForRows.diff(this.allRows);
    if (changesInRow) {
      this.updateFilter();
    }
  }

  public onClickActionButton(event: any): void {
    const thisComponent = this;
    if (event.button.type === 'delete') {
      this.messageUtil.addSwalRemoval(event.row.name, (response) => {
        if (response.value) {
          thisComponent.clickActionButton.next(event);
        }
      });
    } else {
      this.clickActionButton.next(event);
    }
  }

  public updateFilter(event: any = null) {
    const value = event ? event.target.value.toLowerCase() : this.lastFilter;
    this.lastFilter = value;
    this.rows = this.allRows.filter((d) => {
      let hasLine = false;
      Object.keys(d).forEach(column => {
        if (String(d.name).toLowerCase().indexOf(value) !== -1) {
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
    if (this.rows.length !== this.allRows.length) {
      datatableTotalMessage = ' ' + this.translationService.translate('general.of') + ' ' + this.allRows.length;
    }
    return {
      emptyMessage: this.translationService.translate('datatable.empty_message'),
      totalMessage: this.allRows.length > 1 ? datatableTotalMessage + ' ' +
        this.translationService.translate('datatable.total_message_plural') :
        this.translationService.translate('datatable.total_message'),
      selectedMessage: this.translationService.translate('datatable.selected_message'),
    };
  }

  public onClickAmountButton(row: {id, count}) {
    this.clickAmountButton.next(row);
  }
}
