import {Component, OnInit} from '@angular/core';
import {InfoCard} from './components/info-card/model/info-card.model';
import {InfoCardService} from './components/info-card/info-card.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
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
      'info_cards.registered_products', 'ic-blue',
      '#');
  }

  buildInfoCardRed(): InfoCard {
    return new InfoCard(this.infoCardService.getProductsConsumedThisMonth(),
      'info_cards.products_near_expire_date', 'ic-red',
      '#');
  }

  buildInfoCardYellow(): InfoCard {
    return new InfoCard(this.infoCardService.getProductsNearToEnd(),
      'info_cards.products_near_to_end', 'ic-yellow',
      '#');
  }

  buildInfoCardGreen(): InfoCard {
    return new InfoCard(this.infoCardService.getProductsNearExpirationDate(),
      'info_cards.products_consumed_this_month', 'ic-green',
      '#');
  }

}
