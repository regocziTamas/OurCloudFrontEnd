import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/authservice/auth.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'OurCloud';
  loggedInUsername : string;

  constructor(
    private router: Router,
    public authenticationService: AuthService) {
    
  }

  ngOnInit() {
    this.authenticationService.getUsernameAsObservable().subscribe(newName => this.loggedInUsername = newName)
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
