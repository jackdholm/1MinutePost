import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { IPost } from '../IPost';
import { PostService } from '../Services/post-service.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-post-container',
  templateUrl: './post-container.component.html',
  styleUrls: ['./post-container.component.css']
})
export class PostContainerComponent implements OnInit
{
  public Posts: IPost[];
  loading: boolean = false;

  constructor(private pService: PostService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void
  {
    this.spinner.show();
    this.pService.Posts.subscribe(data => {
      if (data.length > 0)
        this.spinner.hide();
      console.log("Data: ", data);
      this.Posts = data;
    });
  }

  deletePost(post: number)
  {
    this.pService.Delete(post);
  }
}
