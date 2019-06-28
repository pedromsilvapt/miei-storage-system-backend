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
  constructor(private infoCardService: InfoCardService, private httpService: HttpService,
              private sanitizer: DomSanitizer, private messageUtil: MessageUtil) { }

  public infoCardBlue: InfoCard;
  public infoCardGreen: InfoCard;
  public infoCardYellow: InfoCard;
  public infoCardRed: InfoCard;
  public googletask;
  ShowSpinner = false;

  async ngOnInit() {
    this.buildInfoCardBlue();
    // this.buildInfoCardGreen();
    this.buildInfoCardYellow();
    this.buildInfoCardRed();
  }

  buildInfoCardBlue(): void {
    this.infoCardService.getProductsOnStock().subscribe((amount: number) => {
      this.infoCardBlue = new InfoCard(amount,
        'info_cards.registered_products', 'ic-blue',
        '#');
    }, error => {
      this.messageUtil.addErrorMessage('Info Cards', error.message);
    });
  }

  // buildInfoCardGreen(): void {
  //   return new InfoCard(this.infoCardService.getProductsNearExpirationDate(),
  //     'info_cards.products_consumed_this_month', 'ic-green',
  //     '#');
  // }

  buildInfoCardYellow(): void {
    this.infoCardService.getProductsExpiring().subscribe((amount: number) => {
      this.infoCardYellow = new InfoCard(amount,
        'info_cards.products_expiring', 'ic-yellow',
        '#');
    }, error => {
      this.messageUtil.addErrorMessage('Info Cards', error.message);
    });
  }

  buildInfoCardRed(): void {
    this.infoCardService.getProductsExpired().subscribe((amount: number) => {
      this.infoCardRed = new InfoCard(amount,
        'info_cards.products_expired', 'ic-red',
        '#');
    }, error => {
      this.messageUtil.addErrorMessage('Info Cards', error.message);
    });
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
    } else {
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
    const blob = new Blob([data], { type });

    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob);
      return;
    }

    const dataURL = window.URL.createObjectURL(blob);

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
