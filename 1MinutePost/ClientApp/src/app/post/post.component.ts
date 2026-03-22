import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ErrorService } from '../Services/error.service';
import { VoteService } from '../Services/vote-service.service';

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.css'],
    standalone: false
})
export class PostComponent implements OnInit, OnDestroy
{
  @Input('text') Text : string;
  @Input('username') Username: string;
  @Input('created') Created: Date | string;
  @Input('pid') Pid: string;
  @Input('vote-count') VoteCount;
  @Input('voted') Voted;
  @Output('delete') Delete: EventEmitter<string> = new EventEmitter();
  displayTime = '10:00';

  numberVotes: number = 0;
  arrowVoted: boolean = false;
  errorNotLoggedIn: boolean = false;
  private expired = false;
  private expirationTimerId: number | null = null;
  private timeLeftMs = 0;
  private timeLeftSeconds = 600;
  private tickTimerId: number | null = null;

  constructor(private voteService: VoteService, private errorService: ErrorService) { }

  ngOnInit()
  {
    this.arrowVoted = this.Voted === true || this.Voted === "true";
    this.numberVotes = Number(this.VoteCount ?? 0) || 0;
    this.configureTime();
    this.scheduleExpiration();
    this.startTicking();

    this.errorService.NotLoggedIn.subscribe(e => {
      if (e === false)
        this.errorNotLoggedIn = e;
    });
  }

  ngOnDestroy()
  {
    this.clearExpirationTimer();
    this.clearTickTimer();
  }

  configureTime() {
    const createdAtMs = this.parseCreatedTime(this.Created);

    if (createdAtMs === null) {
      this.timeLeftMs = 0;
      this.timeLeftSeconds = 0;
      this.updateDisplayTime();
      return;
    }

    const elapsedMs = Date.now() - createdAtMs;
    const totalMs = 600000 + 60000 * this.numberVotes;
    this.timeLeftMs = Math.max(0, totalMs - elapsedMs);

    this.timeLeftSeconds = Math.max(0, Math.floor(this.timeLeftMs / 1000));
    this.updateDisplayTime();
  }

  private scheduleExpiration() {
    this.clearExpirationTimer();

    if (this.timeLeftMs <= 0) {
      setTimeout(() => this.emitDelete(), 0);
      return;
    }

    this.expirationTimerId = window.setTimeout(() => {
      this.emitDelete();
    }, this.timeLeftMs);
  }

  private clearExpirationTimer() {
    if (this.expirationTimerId !== null) {
      window.clearTimeout(this.expirationTimerId);
      this.expirationTimerId = null;
    }
  }

  private startTicking() {
    this.clearTickTimer();

    if (this.timeLeftSeconds <= 0) {
      this.updateDisplayTime();
      return;
    }

    this.tickTimerId = window.setInterval(() => {
      if (this.expired) {
        this.clearTickTimer();
        return;
      }

      this.timeLeftSeconds = Math.max(0, this.timeLeftSeconds - 1);
      this.updateDisplayTime();

      if (this.timeLeftSeconds <= 0) {
        this.emitDelete();
      }
    }, 1000);
  }

  private clearTickTimer() {
    if (this.tickTimerId !== null) {
      window.clearInterval(this.tickTimerId);
      this.tickTimerId = null;
    }
  }

  private updateDisplayTime() {
    const minutes = Math.floor(this.timeLeftSeconds / 60);
    const seconds = this.timeLeftSeconds % 60;
    this.displayTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  private parseCreatedTime(created: Date | string): number | null {
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

  private emitDelete() {
    if (this.expired) {
      return;
    }

    this.expired = true;
    this.clearExpirationTimer();
    this.clearTickTimer();
    this.Delete.emit(this.Pid);
  }

  vote() {
    this.voteService.vote(this.Pid).subscribe(response => {
      if (this.arrowVoted) {
        this.arrowVoted = false;
        this.numberVotes--;
        this.configureTime();
        this.scheduleExpiration();
        this.startTicking();
      }
      else {
        this.arrowVoted = true;
        this.numberVotes++;
        this.configureTime();
        this.scheduleExpiration();
        this.startTicking();
      }
    }, (error) => {
      this.errorService.setError();
      this.errorNotLoggedIn = true;
    });
  }
}
