import {ProductExpiryLevel} from '../../storage/components/details-product-modal/enums-interfaces/enums-interfaces.util';

export class DateUtil {

  public static formatExpiryDate(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year.toString().padStart(4, '0')}`;
  }

  protected static getExpiryDateInt(date: Date): number {
    const minDate = new Date(0);

    const diffTime = Math.abs(date.getTime() - minDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  /**
   * Returns how many days remain from today until the date
   *
   * @param date param
   */
  public static getRemainingDays(date: Date): number {
    const today = new Date(Date.now());

    const todayInt = this.getExpiryDateInt(today);
    const dateInt = this.getExpiryDateInt(date);

    return dateInt - todayInt;
  }

  private static getRemainingDaysLevel(days: number): ProductExpiryLevel {
    if (days < 0) {
      return ProductExpiryLevel.Expired;
    } else if (days <= 7) {
      return ProductExpiryLevel.Close;
    } else {
      return ProductExpiryLevel.Distant;
    }
  }

  public static getExpiryDateLevel(date: Date): ProductExpiryLevel {
    return this.getRemainingDaysLevel(this.getRemainingDays(date));
  }
}
