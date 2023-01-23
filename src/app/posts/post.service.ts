import { Injectable } from "@angular/core";
import { HttpClient }  from "@angular/common/http"
import { map, Subject } from "rxjs";
import { Post } from "./post.model";

@Injectable({
  providedIn: 'root'
})

export class PostService{
  private posts: Post[] = []
  private postsUpdated = new Subject<Post[]>()

  constructor(private http: HttpClient){

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
                content: post.content
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

  getPostUpdateListener() {
    return this.postsUpdated.asObservable()
  }

  addPost(title: string, content: string){
    const post: Post = {
      id: null,
      title: title, 
      content: content
    }
    this.http.post<{message: string, post: any}>("http://localhost:3000/api/posts", post)
      .subscribe({
        next: (resData) => {
          post.id = resData.post._id
          this.posts.push(post);
          this.postsUpdated.next([...this.posts])
        }
      })
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
