import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  private _notLoggedInError: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public NotLoggedIn: Observable<boolean> = this._notLoggedInError.asObservable();

  constructor() { }

  setError() {
    this._notLoggedInError.next(true);
  }

  clearErrors() {
    this._notLoggedInError.next(false);
  }
}
