import {Component, enableProdMode, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

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

  @Input()
  required: boolean;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) { }

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

  addstorage() {
    // TODO URL should be dynamic and injected by the server
    this.http.post('api/storage', {
      name: this.namestorage,
      invitations: this.em.value,
    }).subscribe((result: any) => {
      this.router.navigate(['storage-system', 'storage']);
    });
  }
}

