import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { ILogin } from '../ILogin';
import { IRegister } from '../IRegister';
import { IUser } from '../IUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService
{
  private _baseUrl: string
  private _user: any
  private _currentUser: BehaviorSubject<any> = new BehaviorSubject(null);
  public User = this._currentUser.asObservable();

  constructor(private http: HttpClient, @Inject('BASE_URL') url: string)
  {
    this._baseUrl = url + 'api/auth/';
    this.Get();
  }

  private Get()
  {
    this.http.get<IUser>(this._baseUrl + 'user').subscribe(data => {
      this._user = data;
      this._currentUser.next(this._user);
    }, error => {
        this._user = null;
        this._currentUser.next(this._user);
    });

  }

  public Register(user: IRegister)
  {
    var observable = this.http.post(this._baseUrl + 'register', user).pipe(shareReplay())
    observable.subscribe(data => {
      let l: ILogin = { username: user.username, password: user.password };
      this.Login(l);
    }, error => console.log(error));

    return observable;
  }

  public Login(user: ILogin)
  {
    var observable = this.http.post(this._baseUrl + 'login', user, { withCredentials: true, responseType: "text" }).pipe(shareReplay());
    observable.subscribe(data => {
      this.Get();
    }, error => console.log(error));
    return observable;
  }

  public Logout()
  {
    this.http.post(this._baseUrl + 'logout', null, { withCredentials: true, responseType: "text" }).subscribe(data => {
      this._user = null;
      this._currentUser.next(this._user);
    });
  }
}
