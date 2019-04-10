import {Component, OnInit} from '@angular/core';
import {InfoCard} from '../components/info-card/model/InfoCard';
import {InfoCardService} from '../components/info-card/info-card.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private infoCardService: InfoCardService) { }

  public infoCardBlue;
  public infoCardGreen;
  public infoCardYellow;
  public infoCardRed;

  ngOnInit() {
    this.infoCardBlue = this.buildInfoCardBlue();
    this.infoCardRed = this.buildInfoCardRed();
    this.infoCardYellow = this.buildInfoCardYellow();
    this.infoCardGreen = this.buildInfoCardGreen();
  }

  buildInfoCardBlue(): InfoCard {
    return new InfoCard(this.infoCardService.getProductsOnStock(),
      'Produtos registados', 'ic-blue',
      '#');
  }

  buildInfoCardRed(): InfoCard {
    return new InfoCard(this.infoCardService.getProductsConsumedThisMonth(),
      'Produtos próximos de expirar', 'ic-red',
      '#');
  }

  buildInfoCardYellow(): InfoCard {
    return new InfoCard(this.infoCardService.getProductsNearToEnd(),
      'Produtos próximos de acabar', 'ic-yellow',
      '#');
  }

  buildInfoCardGreen(): InfoCard {
    return new InfoCard(this.infoCardService.getProductsNearExpirationDate(),
      'Produtos utilizados este mês', 'ic-green',
      '#');
  }

}
