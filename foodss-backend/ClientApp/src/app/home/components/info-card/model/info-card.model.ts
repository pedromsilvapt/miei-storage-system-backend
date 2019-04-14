import {ChartCard} from './chart-card.model';

export class InfoCard {
  value: number;
  title: string;
  action: string;
  infoCardClass: string;
  chartCard: ChartCard;

  constructor(value: number, title: string, infoCardClass: string, action: string) {
    this.value = value;
    this.title = title;
    this.action = action;
    this.infoCardClass = infoCardClass;
  }
}
