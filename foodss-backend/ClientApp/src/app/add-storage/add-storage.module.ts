import {NgModule} from '@angular/core';
import { AddStorageComponent } from './add-storage.component';
import { CommonModule } from '@angular/common';  
import { SharedModule } from '../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule, MatInputModule, MatButtonModule, MatAutocompleteModule, MatIconModule, MatRadioModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { TranslationModule } from 'angular-l10n';

@NgModule({
  declarations: [AddStorageComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    FormsModule,
    MatIconModule,
    MatRadioModule,
    BrowserModule,
    TypeaheadModule.forRoot(),
    TranslationModule
  ]
})
export class AddStorageModule { }
