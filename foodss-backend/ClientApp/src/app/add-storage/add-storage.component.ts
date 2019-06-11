import { Component, enableProdMode, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpService } from '../core/http/http.service';
import { Observable } from 'rxjs/Observable';
import { mergeMap } from 'rxjs/operators';

enableProdMode();

@Component({
  selector: 'stepper-errors-example',
  templateUrl: './add-storage.component.html',
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
  }]
})
export class AddStorageComponent implements OnInit {
  citiesSource: Observable<any>;
  selected: string;

  formGroup: FormGroup;

  options: string[] = ['Pessoal', 'Partilhada'];
  show: string = 'Partilhada';
  goalstorage: string;
  namestorage: string;
  citynamestorage: any;
  citystorage: any;
  delete: string = '';
  // Will contain the returned object after saving
  savedStorage: any = null;

  @Input()
  required: boolean;

  constructor(private formBuilder: FormBuilder, private http: HttpService, private router: Router) {
    this.citiesSource = Observable
      .create((observer: any) => observer.next(this.citynamestorage))
      .pipe(mergeMap((name: string) => this.searchCities(name)));
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      nameCtrl: this.formBuilder.control('', [Validators.required]),
      cityCtrl: this.formBuilder.control('', []),
      typeCtrl: this.formBuilder.control('', [Validators.required]),
      emails: this.formBuilder.array([])
    });

    this.addEmail();
  }

  searchCities(city: string) {
    return this.http.get('city/search', {
      params: { name: city }
    });
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
    return !(this.formGroup.get('nameCtrl').errors != null || this.formGroup.get('typeCtrl').errors != null || this.formGroup.get('cityCtrl').errors != null);
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
        city: this.citystorage != null ? { id: this.citystorage.id } : null
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

