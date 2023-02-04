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
    this.aService.Login(value).subscribe(data => {
      this.dialogRef.closeAll();
    }, error => {
        this.ErrorInvalidCredentials = true;
    });
  }
}
