import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub: Subscription

  constructor(private postService: PostService) {

  }

  ngOnInit() {
    this.posts = this.postService.getPosts();

    this.postsSub = this.postService.getPostUpdateListener().subscribe({
      next: (posts) => {
        this.posts = posts;
      }
    })
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }
}
