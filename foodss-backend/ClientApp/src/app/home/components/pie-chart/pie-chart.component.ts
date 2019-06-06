import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html'
})
export class PieChartComponent implements OnInit {
  constructor() { }

  ngOnInit() {
    var canvas = <HTMLCanvasElement>document.getElementById("okCanvas2");
    var ctx = canvas.getContext("2d");
    var myChart = new Chart(ctx, {
      type: 'pie',
      data: {
        datasets: [{
          data: [10, 20, 30]
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
          'Red',
          'Yellow',
          'Blue'
        ]
      },
      options: {
      }
    });
  }

}
