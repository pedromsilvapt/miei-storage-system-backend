import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {TranslationService} from 'angular-l10n';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MessageUtil {

  private successMessage: string;

  constructor(private toastrService: ToastrService, private translationService: TranslationService) {
    this.successMessage = this.translationService.translate('general.operation_performed_successfully');
    this.translationService.translationChanged().subscribe(() => {
      this.successMessage = this.translationService.translate('general.operation_performed_successfully');
    });
  }

  addSuccessMessage(useCase: string, message?: string) {
    const body: string = message ? this.translationService.translate(message) : this.successMessage;
    this.toastrService.success(body, this.translationService.translate(useCase));
  }

  addErrorMessage(useCase: string, message: string) {
    this.toastrService.error(this.translationService.translate(message), this.translationService.translate(useCase));
  }

  addErrorMessages(useCase: string, errors: Array<any>) {
    for (const error of errors) {
      this.addErrorMessage(useCase, error);
    }
  }

  addSwalRemoval(entity: string, callback) {
    Swal.fire({
      title: this.translationService.translate('confirm_removal.remove') + ' ' + entity + '?',
      text: this.translationService.translate('confirm_removal.message'),
      showCancelButton: true,
      confirmButtonText: this.translationService.translate('confirm_removal.remove'),
      cancelButtonText: this.translationService.translate('confirm_removal.cancel')
    }).then(result => {
      if (result.value) {
        callback(result);
      }
    }).catch(() => {});
  }
}
