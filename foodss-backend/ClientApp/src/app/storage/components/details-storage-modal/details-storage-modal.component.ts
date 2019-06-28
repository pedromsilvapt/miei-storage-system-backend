import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpService } from 'src/app/core/http/http.service';
import { StorageModel } from '../../model/storage.model';
import { BsModalRef } from 'ngx-bootstrap';
import { StorageInvitation, StorageUser, User } from './enums-interfaces/enums-interfaces.util';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { MessageUtil } from 'src/app/shared/util/message.util';

@Component({
  selector: 'details-storage-modal',
  templateUrl: './details-storage-modal.component.html',
  styleUrls: ['./details-storage-modal.component.scss']
})
export class DetailsStorageModalComponent {
  @Input('storageId') storageId: number;

  @Input('storage') storage: StorageModel;

  @Output('close') closeEvent: EventEmitter<void>;

  public citiesSource: Observable<any>;

  public modalRef: BsModalRef;

  public http: HttpService;

  public storageCityName: string = null;

  public loading: boolean = false;

  public newInvitation: string = null;

  public removingMember: User = null;

  public removingInvitation: StorageInvitation = null;

  public members: User[] = [];

  public invitations: StorageInvitation[] = [];

  public toastr: MessageUtil;

  public removedMembers: number[] = [];
  public removedInvitations: string[] = [];
  public addedInvitations: string[] = [];

  constructor(modalRef: BsModalRef, http: HttpService, toastr : MessageUtil) {
    this.modalRef = modalRef;
    this.http = http;
    this.toastr = toastr;

    this.citiesSource = Observable
      .create((observer: any) => observer.next(this.storageCityName))
      .pipe(mergeMap((name: string) => this.searchCities(name)));
  }

  async ngOnInit() {
    if (this.storage == null) {
      this.storage = await this.http.get(`storage/${this.storageId}`, { params: { includeOwner: true, includeCity: true } }).toPromise();

      if (this.storage.city != null) {
        this.storageCityName = this.storage.city.name + ', ' + this.storage.city.country;
      }
    }

    const [invitations, members] = await Promise.all([
      this.http.get(`storage/${this.storage.id}/invitation`).toPromise(),
      this.http.get(`storage/${this.storage.id}/user`).toPromise()
    ]);

    this.members = members;
    this.invitations = invitations;
  }

  getCity(id : number) {
    return this.http.get('city/' + id).toPromise();
  }

  searchCities(city: string) {
    return this.http.get('city/search', {
      params: { name: city }
    });
  }

  removeMember(member: User) {
    this.removedMembers.push(member.id);

    const index = this.members.indexOf(member);

    if (index >= 0) {
      this.members.splice(index, 1);
    }

    if (this.removingMember == member) {
      this.removingMember = null;
    }
  }

  removeInvitation(invitation: StorageInvitation) {
    const emailIndex = this.addedInvitations.indexOf(invitation.userEmail);

    if (emailIndex >= 0) {
      this.addedInvitations.splice(emailIndex, 1);
    } else {
      this.removedInvitations.push(invitation.userEmail);
    }

    const index = this.invitations.indexOf(invitation);

    if (index >= 0) {
      this.invitations.splice(index, 1);
    }

    if (this.removingInvitation == invitation) {
      this.removingInvitation = null;
    }
  }

  addInvitation() {
    if (!this.newInvitation) return;

    const email = this.newInvitation;

    this.addedInvitations.push(email);

    this.invitations.push({
      storageId: this.storage.id,
      userEmail: email,
      authorId: 0,
    });

    this.newInvitation = null;
  }

  async save() {
    const removedMembers = this.removedMembers.slice();
    const removedInvitations = this.removedInvitations.slice();
    const addedInvitations = this.addedInvitations.slice();

    try {
      await this.http.post("storage/" + this.storage.id, {
        name: this.storage.name,
        city: this.storage.city != null ? { id: this.storage.city.id } : null,
        invitations: [],
      });

      for (let invitation of removedInvitations) {
        await this.http.delete("storage/" + this.storage.id + "/invitation/" + invitation).toPromise().catch(err => this.toastr.addErrorMessage("Removing Invitation", "Could not remove invitation to " + invitation));
      }

      for (let invitation of addedInvitations) {
        await this.http.post("storage/" + this.storage.id + "/invitation/", { userEmail: invitation }).toPromise().catch(err => this.toastr.addErrorMessage("Adding Invitation", "Could not add invitation to " + invitation));
      }

      for (let member of removedMembers) {
        await this.http.delete("storage/" + this.storage.id + "/user/" + member).toPromise().catch(err => this.toastr.addErrorMessage("Removing Member", "Could not remove member " + member));
      }

      this.modalRef.hide();

      this.toastr.addSuccessMessage("Saving Storage", "Changes were successfuly saved.")
    } catch (err) {
      this.toastr.addErrorMessage("Saving Storage", "Could not save the changes");
    }
  }
}

