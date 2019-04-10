export class ActionButtonDatatable {

  type: string;
  buttonClass: string;
  iconClass: string;
  translationKey: string;

  constructor(type: string, buttonClass: string, iconClass?: string, translationKey?: string) {
    this.type = type;
    this.buttonClass = buttonClass;
    this.iconClass = iconClass;
    this.translationKey = translationKey;
  }
}
