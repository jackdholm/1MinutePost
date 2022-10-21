import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IPost } from '../IPost';

@Injectable({
  providedIn: 'root'
})
export class PostService
{
  baseUrl: string
  private _list: IPost[]
  private _sourceList : BehaviorSubject<IPost[]> = new BehaviorSubject([]);
  public Posts = this._sourceList.asObservable();

  constructor(private http: HttpClient, @Inject('BASE_URL') url: string)
  {
    this.baseUrl = url;
    this.Get();
  }

  Get()
  {
    this.http.get<IPost[]>(this.baseUrl + 'api/post').subscribe(data => {
      this._list = data;
      this._sourceList.next(this._list);
    });
  }
  getAll(): Observable<IPost[]>
  {
    return this.http.get<IPost[]>(this.baseUrl + 'api/post');
  }

  post(p)
  {
    console.log(p);
    this.http.post(this.baseUrl + 'api/post', p).subscribe(data => this.Get());
  }

  Delete(i: number)
  {
    this._list.splice(i, 1);
    this._sourceList.next(this._list);
  }
}
