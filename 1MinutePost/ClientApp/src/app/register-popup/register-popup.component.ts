import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IRegister } from '../IRegister';
import { AuthService } from '../Services/auth-service.service';

@Component({
  selector: 'app-register-popup',
  templateUrl: './register-popup.component.html',
  styleUrls: ['./register-popup.component.css']
})
export class RegisterPopupComponent implements OnInit {
  ErrorExistingUser = false;

  constructor(private dialogRef: MatDialog, private aService: AuthService) { }

  ngOnInit() {
  }

  submitRegistration(value: IRegister) {
    this.ErrorExistingUser = false;
    this.aService.Register(value).subscribe(data => {
      console.log("REGISTERED");
      this.dialogRef.closeAll();
    }, error => {
        console.log(error);
        this.ErrorExistingUser = true;
    });
  }
}
