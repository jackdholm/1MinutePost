import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginPopupComponent } from '../login-popup/login-popup.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private  dialogRef: MatDialog) { }

  ngOnInit() {
  }

  openDialog() {
    this.dialogRef.open(LoginPopupComponent);
    //this.dialogRef.open(LoginPopupComponent, {
    //  width: '250px',
    //  position: { right: '0' }
    //});
  }
}
