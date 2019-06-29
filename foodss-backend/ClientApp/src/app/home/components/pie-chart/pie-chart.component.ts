import { Component, OnInit } from '@angular/core';
import {Chart, ChartDataSets} from 'chart.js';
import {HttpService} from '../../../core/http/http.service';
import {ProductItemDTO} from '../../../product/model/product-item-dto.model';
import * as Highcharts from 'highcharts';
import {MessageUtil} from '../../../shared/util/message.util';
import * as _ from 'lodash';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html'
})
export class PieChartComponent implements OnInit {

  public options: any = {
    chart: {
      type: 'line',
      height: 400
    },
    title: {
      text: 'Products'
    },
    credits: {
      enabled: false
    },
    tooltip: {
      formatter() {
        return '<b>Month</b>: ' + this.x + '<br/><b>Amount:</b> ' + this.y;
      }
    },
    xAxis: {
      categories: []
    },
    series: [],
  };

  constructor(private httpService: HttpService, private messageUtil: MessageUtil) { }

  ngOnInit() {
    this.httpService.get('productitem/all').subscribe((productItemsDTOs: Array<ProductItemDTO>) => {
      const groupedByMonthYear = _.groupBy(productItemsDTOs, (productItemsDTO) => {
        const addedDate = new Date(productItemsDTO.addedDate);
        return (addedDate.getMonth() + 1) + '/' + addedDate.getFullYear();
      });
      const serieForRegisteredProducts = {
        name: 'Registered Products',
        data: []
      };
      const serieForConsumedProducts = {
        name: 'Consumed Products',
        data: []
      };
      Object.keys(groupedByMonthYear).forEach(key => {
        this.options.xAxis.categories.push(key);
        serieForRegisteredProducts.data.push(groupedByMonthYear[key].length);

        // let consumedProducts = 0;
        // groupedByMonthYear[key].forEach((productItemsDTO: ProductItemDTO) => {
        //   if (productItemsDTO.consumedDate) {
        //     consumedProducts++;
        //   }
        // });
      });
      this.httpService.get('productitem/consumed')
        .subscribe((consumedProductItems: Array<{id: number, consumedDate: Date}>) => {

          const groupedConsumedProductsByMonthYear = _.groupBy(consumedProductItems, (consumedProductItem) => {
            const consumedDate = new Date(consumedProductItem.consumedDate);
            return (consumedDate.getMonth() + 1) + '/' + consumedDate.getFullYear();
          });
          Object.keys(groupedConsumedProductsByMonthYear).forEach(key => {
            if (this.options.xAxis.categories.indexOf(key) < 0) {
              this.options.xAxis.categories.push(key);
            }
            serieForConsumedProducts.data.push(groupedConsumedProductsByMonthYear[key].length);
          });
          this.options.series.push(serieForRegisteredProducts);
          this.options.series.push(serieForConsumedProducts);
          Highcharts.chart('container', this.options);
        }, error => {
          this.messageUtil.addErrorMessage('Consumed Products', error.message);
        });
    }, error => {
      this.messageUtil.addErrorMessage('Registered Products', error.message);
    });
  }

}
