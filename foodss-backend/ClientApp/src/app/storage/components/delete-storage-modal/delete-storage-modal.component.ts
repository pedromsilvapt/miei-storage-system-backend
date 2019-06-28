import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpService } from 'src/app/core/http/http.service';
import { StorageModel } from '../../model/storage.model';
import { BsModalRef } from 'ngx-bootstrap';
import { MessageUtil } from 'src/app/shared/util/message.util';

@Component({
  selector: 'delete-storage-modal',
  templateUrl: './delete-storage-modal.component.html',
  styleUrls: ['./delete-storage-modal.component.scss']
})
export class DeleteStorageModalComponent {
  @Input('storage') storage: StorageModel;

  @Output('close') closeEvent: EventEmitter<void>;

  public modalRef: BsModalRef;

  public http: HttpService;

  public confirmation: boolean = false;

  public removing: boolean = false;

  public toastr: MessageUtil;

  constructor(modalRef: BsModalRef, http: HttpService, toastr : MessageUtil) {
    this.modalRef = modalRef;
    this.http = http;
    this.toastr = toastr;
  }

  async remove() {
    if (!this.confirmation || this.removing) return;

    try {
      this.removing = true;
      
      this.modalRef.hide();

      await this.http.delete("storage/" + this.storage.id).toPromise();

      this.toastr.addSuccessMessage("Deleting Storage", "Storage successfuly deleted.")
    } catch (err) {
      this.toastr.addErrorMessage("Deleting Storage", "Could not delete the storage.");

      this.removing = false;
    }
  }
}

