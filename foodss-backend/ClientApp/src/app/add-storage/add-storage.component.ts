import { Component, enableProdMode, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpService } from '../core/http/http.service';

enableProdMode();

@Component({
  selector: 'stepper-errors-example',
  templateUrl: './add-storage.component.html',
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
  }]
})
export class AddStorageComponent implements OnInit {

  formGroup: FormGroup;

  options: string[] = ['Pessoal', 'Partilhada'];
  show: string = 'Partilhada';
  goalstorage: string;
  namestorage: string;
  delete: string = '';
  // Will contain the returned object after saving
  savedStorage: any = null;

  @Input()
  required: boolean;

  constructor(private formBuilder: FormBuilder, private http: HttpService, private router: Router) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      nameCtrl: this.formBuilder.control('', [Validators.required]),
      typeCtrl: this.formBuilder.control('', [Validators.required]),
      emails: this.formBuilder.array([])
    });

    this.addEmail();
  }

  get em() {
    return this.formGroup.get('emails') as FormArray;
  }

  addEmail() {
    this.em.push(this.formBuilder.control('', [Validators.required, Validators.email]));
  }

  deleteEmail(index) {
    this.em.removeAt(index);
  }

  firstStepValid() {
    return !(this.formGroup.get('nameCtrl').errors != null || this.formGroup.get('typeCtrl').errors != null);
  }

  allEmailsValid() {
    if (this.em.length === 0) {
      return false;
    }

    for (let i = 0; i < this.em.length; i++) {
      if (this.em.at(i).errors != null) {
        return false;
      }
    }

    return true;
  }

  addStorage(stepIndex: number) {
    if (stepIndex == 2 || (stepIndex == 1 && this.goalstorage != this.show)) {
      this.http.post('storage', {
        name: this.namestorage,
        // this.em.value is Array<string>, but since the server expects Array<{userEmail: string}> (an array of objects, each with a single variable "userEmail"), we have to convert it before sending
        invitations: this.em.value.map(userEmail => ({ userEmail })),
      }).subscribe((result: any) => {
        this.savedStorage = result;
      });
    }
  }

  openStoragePage() {
    if (this.savedStorage != null && this.savedStorage.id != null) {
      // In the future if we have a storage details page, we can redirect there instead of the storages' list page
      //this.router.navigate(['storage-system', 'storage', this.savedStorage.id]);
      this.router.navigate(['storage-system', 'storage']);
    }
  }
}

