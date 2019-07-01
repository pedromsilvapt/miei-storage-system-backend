import {Directive, ElementRef, Input, OnChanges} from '@angular/core';
import {DateUtil} from '../../util/date-util';
import {ProductExpiryLevel} from '../../../storage/components/details-product-modal/enums-interfaces/enums-interfaces.util';

@Directive({
  selector: '[appExpireDate]'
})
export class ExpireDateDirective implements OnChanges {

  @Input() colorfy = false;
  @Input() distantColorGray = false;
  @Input() date: Date;
  @Input() display: boolean = true;


  constructor(public elementRef: ElementRef) {
  }

  public expiryLevelClasses = {
    [ProductExpiryLevel.Expired]: 'text-danger',
    [ProductExpiryLevel.Close]: 'text-warning',
    [ProductExpiryLevel.Distant]: ''
  };

  ngOnChanges(): void {
    Promise.resolve(null).then(() => this.formatDate());
  }

  formatDate(): void {
    var date = new Date(this.date);

    if (this.date && !isNaN(date.valueOf())) {
      this.colorfyDate(date);
      if (this.display) {
        // Add zero paddings
        var day = date.getDate().toString().padStart(2, '0');
        var month = (date.getMonth() + 1).toString().padStart(2, '0');
        var year = date.getFullYear();

        this.elementRef.nativeElement.textContent = day + '/' + month + '/' + year;
      }
    }
  }

  colorfyDate(date: Date) {
    if (this.colorfy) {
      const expiryDateLevel: ProductExpiryLevel = DateUtil.getExpiryDateLevel(date);
      if (this.distantColorGray) {
        this.elementRef.nativeElement.classList.add(this.expiryLevelClasses[expiryDateLevel] || 'text-secondary');
      } else {
        this.elementRef.nativeElement.classList.add(this.expiryLevelClasses[expiryDateLevel] || 'text-black');
      }
    }
  }
}
