export class ColumnDatatable {

  name: string;
  translationKey: string;
  sortable: boolean;
  hasLink: boolean;

  constructor(name: string, translationKey: string, sortable: boolean, hasLink: boolean = false) {
    this.name = name;
    this.translationKey = translationKey;
    this.sortable = sortable;
    this.hasLink = hasLink;
  }
}
