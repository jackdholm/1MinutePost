import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ILogin } from '../ILogin';
import { AuthService } from '../Services/auth-service.service';

@Component({
  selector: 'app-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.css']
})
export class LoginPopupComponent implements OnInit {
  ErrorInvalidCredentials = false;

  constructor(private dialogRef: MatDialog, private aService: AuthService) { }

  ngOnInit() {
  }

  submitLogin(value: ILogin)
  {
    this.ErrorInvalidCredentials = false;
    console.log(value);
    this.aService.Login(value).subscribe(data => {
      console.log("LOGGED IN");
      this.dialogRef.closeAll();
    }, error => {
        console.log(error);
        this.ErrorInvalidCredentials = true;
    });
  }
}
