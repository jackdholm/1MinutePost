import { Component, Input, OnInit } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { CountdownConfig, CountdownEvent, CountdownGlobalConfig } from 'ngx-countdown';

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
  @Input('position') Position: number;
  @Output('delete') Delete: EventEmitter<number> = new EventEmitter();

  TimeConfig: CountdownConfig = { leftTime: 600, format: 'm:ss' };

  constructor() { }

  ngOnInit()
  {
    var time = 600000 - (new Date().getTime() - new Date(this.Created).getTime()); 
    this.TimeConfig.leftTime = time / 1000;
  }

  HandleEvent(e: CountdownEvent)
  {
    if (e.action === 'done')
      this.Delete.emit(this.Position);
  }
}
