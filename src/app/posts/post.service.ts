import { Injectable } from "@angular/core";
import { HttpClient }  from "@angular/common/http"
import { map, Subject } from "rxjs";
import { Post } from "./post.model";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})

export class PostService{
  private posts: Post[] = [];
  private totalPosts: number = 0;
  private postsUpdated = new Subject<{posts: Post[], totalPosts: number}>()

  constructor(private http: HttpClient, private router: Router){

  }

  getPosts(pageIndex, pageSize){
    this.http.get<{message: string, posts: any[], totalPosts: number}>("http://localhost:3000/api/posts", {
      params: {
        pageIndex: pageIndex,
        pageSize: pageSize
      }
    })
      .pipe(
        map(
          (postData) => {
            return {
              posts: postData.posts.map(post => {
                return {
                  id: post._id,
                  title: post.title,
                  content: post.content,
                  imagePath: post.imagePath
                }
              }),
              totalPosts: postData.totalPosts
            } 
          }
        )
      )
      .subscribe({
        next: (transformedPosts) => {
          this.posts = transformedPosts.posts
          this.totalPosts = transformedPosts.totalPosts;
          this.postsUpdated.next({
            posts: [...this.posts],
            totalPosts: transformedPosts.totalPosts,
          });
        },
        error: (error) => {
          console.log(error)
        }
      })
  }

  getPost(id: string) {
    return this.http.get<Post>("http://localhost:3000/api/posts/" + id)
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable()
  }

  addPost(title: string, content: string, image: File){
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);

    this.http.post<{message: string, post: Post, totalPosts: number}>("http://localhost:3000/api/posts", postData)
      .subscribe({
        next: (resData) => {
          const post: Post = {
            id: resData.post.id,
            title: resData.post.title,
            content: resData.post.content,
            imagePath: resData.post.imagePath
          }
          this.posts.push(post);
          this.totalPosts = resData.totalPosts;
          this.postsUpdated.next({
            posts: [...this.posts],
            totalPosts: resData.totalPosts,
          });
          this.router.navigate(["/"]);
        }
      })
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      };
    }
    this.http
      .put("http://localhost:3000/api/posts/" + id, postData)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {
          id: id,
          title: title,
          content: content,
          imagePath: ""
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next({posts: [...this.posts], totalPosts: this.totalPosts});
        this.router.navigate(["/"]);
      });
  }

  deletePost(id: string){
    this.http.delete("http://localhost:3000/api/posts/" + id)
      .subscribe({
        next: () => {
          this.posts = this.posts.filter(post => post.id !== id )
          this.postsUpdated.next({posts: [...this.posts], totalPosts: this.totalPosts});
        }
      })
  }
}
