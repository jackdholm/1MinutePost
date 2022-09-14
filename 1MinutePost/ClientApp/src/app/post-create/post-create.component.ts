import { COMPILER_OPTIONS, Component, OnInit } from '@angular/core';
import { IPost } from '../IPost';
import { PostService } from '../Services/post-service.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  constructor(private pService: PostService) { }

  ngOnInit() {
  }
  createPost(value: IPost): void
  {
    this.pService.post(value);
  }
}
