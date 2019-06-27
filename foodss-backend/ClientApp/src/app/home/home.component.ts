import {Component, OnInit} from '@angular/core';
import {InfoCard} from './components/info-card/model/info-card.model';
import {InfoCardService} from './components/info-card/info-card.service';
import { HttpService } from '../core/http/http.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageUtil } from '../shared/util/message.util';
import { Language } from 'angular-l10n';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  @Language() lang: string;
  fileUrl;
  constructor(private infoCardService: InfoCardService, private httpService: HttpService, private sanitizer: DomSanitizer, private messageUtil: MessageUtil) { }

  public infoCardBlue;
  public infoCardGreen;
  public infoCardYellow;
  public infoCardRed;
  public googletask;
  ShowSpinner = false;

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

  async openTask() {
    this.ShowSpinner = true;
    this.googletask = await this.httpService.get('shoppinglist/Task', { responseType: 'int' }).toPromise();
    if (this.googletask == 1) {
      this.messageUtil.addSuccessMessage('general.add_shopping_list', 'general.googleTask');
      this.ShowSpinner = false;
    }
    else {
      this.messageUtil.addErrorMessage('error.ERROR_ADD_GOOGLETASK', 'error.GOOGLETASK_ERROR');
      this.ShowSpinner = false;
    }
  }


  /**
   * Method is use to download file.
   * @param data - Array Buffer data
   * @param type - type of the document.
   */
  downloadFile(data: any, type: string, name: string) {
    let blob = new Blob([data], { type });

    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob);
      return;
    }

    let dataURL = window.URL.createObjectURL(blob);

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
