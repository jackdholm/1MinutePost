import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginPopupComponent } from '../login-popup/login-popup.component';
import { RegisterPopupComponent } from '../register-popup/register-popup.component';
import { AuthService } from '../Services/auth-service.service';
import { ErrorService } from '../Services/error.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public CurrentUser: string;
  LoggedIn = false;

  constructor(private dialogRef: MatDialog, private aService: AuthService, private errorService: ErrorService) { }

  ngOnInit() {
    this.aService.User.subscribe(user => {
      if (user == null) {
        this.CurrentUser = "";
        this.LoggedIn = false;
      }
      else {
        this.CurrentUser = user.username;
        this.LoggedIn = true;
      }
    }, error => console.log(error));
  }

  OpenLogin() {
    this.dialogRef.open(LoginPopupComponent);
    this.errorService.clearErrors();
    //this.dialogRef.open(LoginPopupComponent, {
    //  width: '250px',
    //  position: { right: '0' }
    //});
  }

  OpenRegister() {
    this.dialogRef.open(RegisterPopupComponent);
    this.errorService.clearErrors();
  }

  LogOut() {
    this.aService.Logout();
  }
}
