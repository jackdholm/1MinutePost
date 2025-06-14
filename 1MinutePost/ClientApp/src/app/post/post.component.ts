import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { CountdownComponent, CountdownConfig, CountdownEvent } from 'ngx-countdown';
import { error } from 'protractor';
import { Observable } from 'rxjs';
import { ErrorService } from '../Services/error.service';
import { VoteService } from '../Services/vote-service.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit
{
  @Input('text') Text : string;
  @Input('username') Username: string;
  @Input('created') Created: Date;
  @Input('pid') Pid: string;
  @Input('position') Position: number;
  @Input('vote-count') VoteCount;
  @Input('voted') Voted;
  @Output('delete') Delete: EventEmitter<number> = new EventEmitter();

  TimeConfig: CountdownConfig = { leftTime: 600, format: 'm:ss' };

  numberVotes: number = 0;
  arrowVoted: boolean = false;
  errorNotLoggedIn: boolean = false;

  constructor(private voteService: VoteService, private errorService: ErrorService) { }

  ngOnInit()
  {
    this.arrowVoted = this.Voted === "true" ? true : false;
    this.numberVotes = +this.VoteCount;
    this.configureTime();
    this.errorService.NotLoggedIn.subscribe(e => {
      if (e === false)
        this.errorNotLoggedIn = e;
    });
  }

  configureTime() {
    var time = 600000 - (new Date().getTime() - new Date(this.Created).getTime()) + 60000 * this.numberVotes;
    this.TimeConfig = { leftTime: time / 1000, format: 'm:ss' };
  }

  HandleEvent(e: CountdownEvent)
  {
    if (e.action === 'done')
      this.Delete.emit(this.Position);
  }

  vote() {
    this.voteService.vote(this.Pid).subscribe(response => {
      if (this.arrowVoted) {
        this.arrowVoted = false;
        this.numberVotes--;
      }
      else {
        this.arrowVoted = true;
        this.numberVotes++;
        this.configureTime();
      }
    }, (error) => {
      this.errorService.setError();
      this.errorNotLoggedIn = true;
    });
  }
}
