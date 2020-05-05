import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isLoggedIn: boolean = false;
  public username = "Thomaster"
  public token: String

  constructor(private http: HttpClient) { 
  }

  login(username: string, password: string) {

    return this.http.post<any>(`${environment.serverUrl}/login`, { 'username': username, 'password' : password }, { observe: 'response' })
        .pipe(
          map(res => {
            this.token = res.headers.get('Authorization')
            this.isLoggedIn = true
            this.username = username;
        }));
  }

  logout() {
    this.isLoggedIn = false
  }

}
