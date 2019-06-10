import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {DateUtil} from '../../util/date-util';
import {ProductExpiryLevel} from '../../../storage/components/details-product-modal/enums-interfaces/enums-interfaces.util';

@Directive({
  selector: '[appExpireDate]'
})
export class ExpireDateDirective implements OnInit {

  @Input() colorfy = false;
  @Input() distantColorGray = false;
  @Input() date: Date;

  constructor(public elementRef: ElementRef) {
  }

  public expiryLevelClasses = {
    [ProductExpiryLevel.Expired]: 'text-danger',
    [ProductExpiryLevel.Close]: 'text-warning',
    [ProductExpiryLevel.Distant]: ''
  };

  ngOnInit(): void {
    Promise.resolve(null).then(() => this.formatDate());
  }

  formatDate(): void {
    if (!isNaN(new Date(this.elementRef.nativeElement.textContent).valueOf())) {
      const date = new Date(this.elementRef.nativeElement.textContent);
      this.colorfyDate(date);
      this.elementRef.nativeElement.textContent = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    } else if (this.date) {
      this.colorfyDate(this.date);
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
