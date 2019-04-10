import {Component, OnInit} from '@angular/core';
import {InfoCard} from '../shared/components/info-card/model/InfoCard';
import {InfoCardService} from '../shared/components/info-card/info-card.service';

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
      'info-cards.registered_products', 'ic-blue',
      '#');
  }

  buildInfoCardRed(): InfoCard {
    return new InfoCard(this.infoCardService.getProductsConsumedThisMonth(),
      'info-cards.products_near_expire_date', 'ic-red',
      '#');
  }

  buildInfoCardYellow(): InfoCard {
    return new InfoCard(this.infoCardService.getProductsNearToEnd(),
      'info-cards.products_near_to_end', 'ic-yellow',
      '#');
  }

  buildInfoCardGreen(): InfoCard {
    return new InfoCard(this.infoCardService.getProductsNearExpirationDate(),
      'info-cards.products_consumed_this_month', 'ic-green',
      '#');
  }

}
