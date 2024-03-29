import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoteService {
  baseUrl: string

  constructor(private http: HttpClient, @Inject('BASE_URL') url: string) {
    this.baseUrl = url;
  }

  getVotes(postId: string) {
    this.http.get<number>(this.baseUrl + `api/vote/GetVotesForPost/${postId}`);
  }

  vote(postId: string): Observable<any> {
    return this.http.post(this.baseUrl + `api/vote/VotePost/${postId}`, null);
  }
}
