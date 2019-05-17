import {Component, OnInit} from '@angular/core';
import {InfoCard} from './components/info-card/model/info-card.model';
import {InfoCardService} from './components/info-card/info-card.service';
import { HttpService } from '../core/http/http.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  
  fileUrl;
  constructor(private infoCardService: InfoCardService, private httpService: HttpService, private sanitizer: DomSanitizer) { }

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

  async openPDF() {
    
    const blob = await this.httpService.get('shoppinglist/pdf', { responseType: 'arraybuffer' }).toPromise();
    this.downloadFile(blob, 'application/pdf', 'ShoppingList.pdf');

  }

  /**
   * Method is use to download file.
   * @param data - Array Buffer data
   * @param type - type of the document.
   */
  downloadFile(data: any, type: string, name: string) {
    var blob = new Blob([data], { type: type });

    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob);
      return;
    }

    var dataURL = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = dataURL;
    link.download = name;
    link.target = '_blank';
    link.style.display = 'none';

    document.body.appendChild(link);

    link.click();

    setTimeout(() => {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(dataURL);
      link.remove();
    }, 100);
  }

}
