import {Component, Input, OnInit} from '@angular/core';
import {InfoCard} from './model/info-card.model';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent implements OnInit {

  // public defaultColor = {
  //   borderColor: 'rgba(255, 255, 255, 0.5)',
  //   backgroundColor: 'rgba(0,0,0,0)',
  // };
  //
  // public defaultOptions = {
  //   responsive: true,
  //   legend: {
  //     display: false
  //   },
  //   scales: {
  //     xAxes: [{
  //       display: false,
  //       gridLines: {
  //         display: false
  //       },
  //       ticks: {
  //         display: false
  //       }
  //     }],
  //     yAxes: [{
  //       display: false,
  //       gridLines: {
  //         display: false
  //       },
  //       ticks: {
  //         display: false
  //       }
  //     }]
  //   }
  // };

  @Input() infoCard: InfoCard;

  constructor() { }

  ngOnInit() {
    this.infoCard.infoCardClass = 'card text-white info-card ' + this.infoCard.infoCardClass;
  }

}
