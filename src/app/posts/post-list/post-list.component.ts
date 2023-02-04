import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  totalPosts = 0;
  pageIndex = 0;
  pageSize = 2;
  pageSizeOptions = [1, 2, 5, 10];
  isLoading: boolean = false;
  private postsSub: Subscription

  constructor(private postService: PostService) {

  }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.pageIndex, this.pageSize);

    this.postsSub = this.postService.getPostUpdateListener().subscribe({
      next: (res) => {
      this.isLoading = false;
        this.posts = res.posts;
        this.totalPosts = res.totalPosts;
      }
    })
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

  onDeletePost(id: string){
    this.postService.deletePost(id)
  }

  onPageSizeChange(event: PageEvent){
    this.isLoading = true;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.postService.getPosts(this.pageIndex, this.pageSize);
  }
}
