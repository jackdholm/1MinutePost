import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ILogin } from '../ILogin';
import { AuthService } from '../Services/auth-service.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.css']
})
export class LoginPopupComponent implements OnInit {
  ErrorInvalidCredentials = false;
  unknownError = false;

  constructor(private dialogRef: MatDialog, private aService: AuthService) { }

  ngOnInit() {
  }

  submitLogin(form: NgForm) {
    this.ErrorInvalidCredentials = false;
    this.unknownError = false;
    this.aService.Login(form.value).subscribe(data => {
      this.dialogRef.closeAll();
      form.reset();
    }, error => {
      if (error.status === 401) {
        this.ErrorInvalidCredentials = true;
      }
      else {
        this.unknownError = true;
      }

    });
  }
}
