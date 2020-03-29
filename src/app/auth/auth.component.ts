import { Component, OnInit } from '@angular/core';
import { Auth } from '../models/Auth';
import { ApiService } from "../api.service";
import { Router } from "@angular/router";
import { getString, setString } from "tns-core-modules/application-settings";
import { SnackBar } from 'nativescript-material-snackbar';

@Component({
  selector: 'ns-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  public registerMode: boolean;
  public auth: Auth;

  constructor(
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    const myToken = getString("mr-token");
    if (myToken) {
      console.log(myToken)
      this.router.navigate(['/items']);
    } else {
      this.auth = {username: "", password:""};
    }
  }

  submitForm() {
    if(this.registerMode) {
      this.apiService.registerUser(this.auth).subscribe(
        (results: any) => {
          this.loginFunction();
        },
        err => {
          console.log(err)
          const snackbar = new SnackBar();
          snackbar.simple(err.error.username[0])
        }
      )
    } else {
      this.loginFunction();
    }
  }

  loginFunction() {
    this.apiService.loginUser(this.auth).subscribe(
      (results: any) => {
        console.log(results)
        setString("mr-token", results.token)
        this.router.navigate(['/items'])
      },
      err => {
        const snackbar = new SnackBar();
        snackbar.simple(err.error.non_field_errors[0])
      }
    )
  }

}
