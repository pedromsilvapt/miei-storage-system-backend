export class ColumnDatatable {

  name: string;
  translationKey: string;
  sortable: boolean;
  hasLink: boolean;
  type: string;

  constructor(name: string, translationKey: string, sortable: boolean, hasLink: boolean = false, type?: string) {
    this.name = name;
    this.translationKey = translationKey;
    this.sortable = sortable;
    this.hasLink = hasLink;
    this.type = type;
  }
}
