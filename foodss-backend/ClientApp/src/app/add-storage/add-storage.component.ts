import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { enableProdMode } from '@angular/core';
import { Elementos, Allemails } from '../add-storage/Elementos'
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

enableProdMode();

@Component({
  selector: 'stepper-errors-example',
  templateUrl: './add-storage.component.html',
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
  }]
  // styleUrls: ['./login.component.scss']
})
export class AddStorageComponent implements OnInit {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  radiobutton: FormGroup;
  ElementosForm: FormGroup;

  options: string[] = ['Pessoal', 'Partilhada'];
  show: string = 'Partilhada';
  goalstorage: string;
  namestorage: string;
  delete: string = '';
  public user: Elementos = new Elementos();

  private http: HttpClient;

  private router: Router;

  @Input()
  required: boolean

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: new FormControl()
    });

    this.radiobutton = this._formBuilder.group({
      radioCtrl: ['', Validators.required]
    });

    this.ElementosForm = this._formBuilder.group({
      email: [],
      emails: this._formBuilder.array([this._formBuilder.group({ point: ['', [Validators.required, Validators.email]] })])
    });
  }

  get em() {
    return this.ElementosForm.get('emails') as FormArray;
  }

  addEmail() {
    this.em.push(this._formBuilder.group({ point: '' }));
  }

  deleteEmail(index) {
    this.em.removeAt(index);
  }

  addstorage() {
    // TODO URL should be dynamic and injected by the server
    this.http.post('http://localhost:60947/api/Storage/CreateStorage', {
      namestorage: this.namestorage,
      goalstorage: this.goalstorage,
      user: this.user.emails,
    }).subscribe((result: any) => {
      this.router.navigate(['storage-system/storage']);
    });
  }

}
