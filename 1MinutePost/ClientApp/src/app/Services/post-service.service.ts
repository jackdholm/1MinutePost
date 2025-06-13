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
  private _sourceList: BehaviorSubject<IPost[]> = new BehaviorSubject([]);
  public Posts: Observable<IPost[]> = this._sourceList.asObservable();
  private _loadingSubject = new BehaviorSubject<boolean>(true);
  public loading$ = this._loadingSubject.asObservable();

  constructor(private http: HttpClient, @Inject('BASE_URL') url: string)
  {
    this.baseUrl = url;
    this.Get();
  }

  Get()
  {
    this.http.get<IPost[]>(this.baseUrl + 'api/post').subscribe(
      (data: IPost[]) => {
      this._list = data;
      this._sourceList.next(this._list);
    }, (err) => {
      console.error(err);
    }, () => {
      this._loadingSubject.next(false);
    });
  }
  getAll(): Observable<IPost[]>
  {
    return this.http.get<IPost[]>(this.baseUrl + 'api/post');
  }

  post(p)
  {
    this.http.post(this.baseUrl + 'api/post', p).subscribe(data => {
      if (this._list.length === 0) {
        this._loadingSubject.next(true);
      }
      this.Get();
    });
  }

  Delete(i: number)
  {
    this._list.splice(i, 1);
    this._sourceList.next(this._list);
  }
}
