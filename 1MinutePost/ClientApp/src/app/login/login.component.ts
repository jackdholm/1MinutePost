import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginPopupComponent } from '../login-popup/login-popup.component';
import { RegisterPopupComponent } from '../register-popup/register-popup.component';
import { AuthService } from '../Services/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public CurrentUser: string;
  LoggedIn = false;

  constructor(private dialogRef: MatDialog, private aService: AuthService) { }

  ngOnInit() {
    this.aService.User.subscribe(user => {
      if (user == null) {
        console.log("Not logged in");
        this.CurrentUser = "";
        this.LoggedIn = false;
      }
      else {
        console.log(user);
        console.log("logged in as " + user.username);
        this.CurrentUser = user.username;
        this.LoggedIn = true;
      }
    }, error => console.log(error));
  }

  OpenLogin() {
    this.dialogRef.open(LoginPopupComponent);
    //this.dialogRef.open(LoginPopupComponent, {
    //  width: '250px',
    //  position: { right: '0' }
    //});
  }

  OpenRegister() {
    this.dialogRef.open(RegisterPopupComponent);
  }

  LogOut() {
    this.aService.Logout();
  }
}
