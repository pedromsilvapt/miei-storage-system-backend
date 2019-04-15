import {Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  // styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    public email: string;

    public password: string;

    private http: HttpClient;

    private router: Router;

    constructor(http: HttpClient, router: Router ) {
        this.http = http;
        this.router = router;
    }

    ngOnInit() {
    }

    login() {
        // TODO URL should be dynamic and injected by the server
      this.http.post( 'http://localhost:60947/api/user/authenticate', {
            email: this.email,
            password: this.password
        } ).subscribe( ( result: any ) => {
            this.router.navigate( [ 'storage-system' ] );
        } );
    }
}
