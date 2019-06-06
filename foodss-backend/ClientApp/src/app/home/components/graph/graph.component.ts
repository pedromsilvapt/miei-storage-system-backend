import { Component, OnInit, } from '@angular/core';
import * as CanvasJS from './canvasjs.min';
import { Product } from '../../../product/model/product.model';
@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html'
})
export class GraphComponent implements OnInit {
  public data = [];
  public products = [
    {
      id: 1,
      name: 'Arroz',
      amount: 1,
      barCode: '10001',
      hasExpireDate: true,
      userOwner: {
        id: 1,
        name: 'José'
      },
      isShared: false,
      expireDate: new Date('2019-04-11'),
      addedDate: new Date('2019-03-10'),
      consumedDate: null
    },
    {
      id: 2,
      name: 'Café',
      amount: 2,
      barCode: '10002',
      hasExpireDate: true,
      userOwner: {
        id: 1,
        name: 'José'
      },
      isShared: false,
      expireDate: new Date('2019-04-12'),
      addedDate: new Date('2019-03-10'),
      consumedDate: null
    },
    {
      id: 3,
      name: 'Bolacha',
      amount: 3,
      barCode: '10003',
      hasExpireDate: true,
      userOwner: {
        id: 1,
        name: 'José'
      },
      isShared: false,
      expireDate: new Date('2019-04-13'),
      addedDate: new Date('2019-03-10'),
      consumedDate: null
    },
    {
      id: 4,
      name: 'Leite',
      amount: 4,
      barCode: '10004',
      hasExpireDate: true,
      userOwner: {
        id: 1,
        name: 'José'
      },
      isShared: false,
      expireDate: new Date('2019-04-14'),
      addedDate: new Date('2019-03-10'),
      consumedDate: null
    },
    {
      id: 5,
      name: 'Ovos',
      amount: 5,
      barCode: '10005',
      hasExpireDate: true,
      userOwner: {
        id: 1,
        name: 'José'
      },
      isShared: false,
      expireDate: new Date('2019-04-15'),
      addedDate: new Date('2019-03-10'),
      consumedDate: null
    },
    {
      id: 6,
      name: 'Carne',
      amount: 6,
      barCode: '10006',
      hasExpireDate: true,
      userOwner: {
        id: 1,
        name: 'José'
      },
      isShared: false,
      expireDate: new Date('2019-04-16'),
      addedDate: new Date('2019-03-10'),
      consumedDate: null
    }
  ];

  constructor() { }

  ngOnInit() {
    let chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: false,
      exportEnabled: true,
      title: {
        text: "Products in Range of Expire Date Left"
      },
      data: [{
        type: "column",
        dataPoints: [
          { y: 71, label: "Expirado" },
          { y: 71, label: "1 Semana" },
          { y: 71, label: "2 Semanas" },
          { y: 55, label: "1 Mês" },
          { y: 50, label: "3 Meses" },
          { y: 65, label: "6 Meses" },
          { y: 95, label: "1 ano" }
        ]
      }]
    });
    chart.render();
  }

}
