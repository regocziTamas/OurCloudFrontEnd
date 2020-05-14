import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { User } from 'src/app/models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, flatMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isLoggedIn: boolean = false;
  public username = "Thomaster"
  public token: string
  public usedBytes : number

  constructor(private http: HttpClient) {
    
  }

  login(username: string, password: string) {

    return this.http.post<any>(`${environment.serverUrl}/login`, { 'username': username, 'password' : password }, { observe: 'response' })
        .pipe(
          flatMap(res => {
            this.token = res.headers.get('Authorization')

            localStorage.setItem('token', this.token)

            this.isLoggedIn = true

            return this.queryUserDetails().pipe(
              map(
                result => {
                  this.username = result.username
                  this.usedBytes = result.usedBytes
                }
              )
            )
          })
        );
  }

  logout() {
    this.isLoggedIn = false
  }

  queryUserDetails() : Observable<any>{
    return this.http.get(`${environment.serverUrl}/user/current`);
  }

  attemptAutoLogin() {

    let storedToken = localStorage.getItem('token')

    if(storedToken){

      this.token = storedToken

      return this.queryUserDetails().pipe(map(
        result => {
          this.username = result.username
          this.usedBytes = result.usedBytes
          this.isLoggedIn = true
        },
        error => {
          this.token = null
          this.isLoggedIn = false
          throwError(error)
        }
      ))
    }
    
    return throwError("Cannot autologin")
  }

}
