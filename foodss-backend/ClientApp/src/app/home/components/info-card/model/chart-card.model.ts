export class ChartCard {
  lineChartData: Array<number>;
  lineChartLabels: Array<string>;
  lineChartOptions: object;
  lineChartType: string;

  constructor(lineChartData: Array<number>, lineChartLabels: Array<string>, lineChartOptions: object,
              lineChartType: string) {
    this.lineChartData = lineChartData;
    this.lineChartLabels = lineChartLabels;
    this.lineChartOptions = lineChartOptions;
    this.lineChartType = lineChartType;
  }
}
