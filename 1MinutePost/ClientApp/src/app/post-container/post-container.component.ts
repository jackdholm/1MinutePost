import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { IPost } from '../IPost';
import { PostService } from '../Services/post-service.service';

@Component({
  selector: 'app-post-container',
  templateUrl: './post-container.component.html',
  styleUrls: ['./post-container.component.css']
})
export class PostContainerComponent implements OnInit
{
  public Posts: IPost[];
  constructor(private pService: PostService) { }
  ngOnInit(): void
  {
    this.pService.Posts.subscribe(data => this.Posts = data);
    //this.pService.getAll().subscribe(data => this.Posts = data);
  }

  deletePost(post: number)
  {
    this.pService.Delete(post);
  }
}
