import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.css']
})
export class LoginPopupComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  submitLogin(value: any)
  {
    console.log(value);
  }
}