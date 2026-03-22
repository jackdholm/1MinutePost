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
  private pruneTimerId: number;

  constructor(private http: HttpClient, @Inject('BASE_URL') url: string)
  {
    this.baseUrl = url;
    this.pruneTimerId = window.setInterval(() => this.pruneExpiredPosts(), 1000);
    this.Get();
  }

  Get()
  {
    this.http.get<IPost[]>(this.baseUrl + 'api/post').subscribe(
      (data: IPost[]) => {
      this._list = data;
      this.pruneExpiredPosts();
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

  Delete(pid: string)
  {
    this._list = (this._list || []).filter(post => this.getPid(post) !== pid);
    this._sourceList.next([...this._list]);
  }

  private pruneExpiredPosts()
  {
    const currentPosts = this._list || [];
    const activePosts = currentPosts.filter(post => !this.isExpired(post));

    if (activePosts.length !== currentPosts.length) {
      this._list = activePosts;
      this._sourceList.next([...this._list]);
      return;
    }

    this._sourceList.next([...activePosts]);
  }

  private isExpired(post: IPost)
  {
    const createdAt = this.parseCreatedTime(this.getCreated(post));

    if (createdAt === null) {
      return false;
    }

    const lifetimeMs = (10 + this.getVoteCount(post)) * 60 * 1000;
    return Date.now() >= createdAt + lifetimeMs;
  }

  private getCreated(post: IPost)
  {
    return (post as any).created ?? (post as any).Created;
  }

  private parseCreatedTime(created: unknown): number | null
  {
    if (created instanceof Date) {
      const ms = created.getTime();
      return Number.isNaN(ms) ? null : ms;
    }

    if (typeof created === 'string') {
      const hasTimezone = /[zZ]|[+-]\d{2}:\d{2}$/.test(created);
      const normalized = hasTimezone ? created : `${created}Z`;
      const ms = new Date(normalized).getTime();
      return Number.isNaN(ms) ? null : ms;
    }

    return null;
  }

  private getVoteCount(post: IPost)
  {
    return Number((post as any).voteCount ?? (post as any).VoteCount ?? 0);
  }

  private getPid(post: IPost)
  {
    return (post as any).pid ?? (post as any).Pid;
  }
}
