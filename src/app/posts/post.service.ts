import { Injectable } from "@angular/core";
import { HttpClient }  from "@angular/common/http"
import { map, Subject } from "rxjs";
import { Post } from "./post.model";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})

export class PostService{
  private posts: Post[] = []
  private postsUpdated = new Subject<Post[]>()

  constructor(private http: HttpClient, private router: Router){

  }

  getPosts(){
    this.http.get<{message: string, posts: any[]}>("http://localhost:3000/api/posts")
      .pipe(
        map(
          (postData) => {
            return postData.posts.map(post => {
              return {
                id: post._id,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath
              }
            })
          }
        )
      )
      .subscribe({
        next: (transformedPosts) => {
          this.posts = transformedPosts
          this.postsUpdated.next([...this.posts])
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

    this.http.post<{message: string, post: Post}>("http://localhost:3000/api/posts", postData)
      .subscribe({
        next: (resData) => {
          const post: Post = {
            id: resData.post.id,
            title: resData.post.title,
            content: resData.post.content,
            imagePath: resData.post.imagePath
          }
          this.posts.push(post);
          this.postsUpdated.next([...this.posts])
          this.router.navigate(["/"]);
        }
      })
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    console.log(image)
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
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  deletePost(id: string){
    this.http.delete("http://localhost:3000/api/posts/" + id)
      .subscribe({
        next: () => {
          this.posts = this.posts.filter(post => post.id !== id )
          this.postsUpdated.next([...this.posts])
        }
      })
  }
}
