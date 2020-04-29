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
  title = 'OurCloudFrontEnd';

  constructor(
    private router: Router,
    public authenticationService: AuthService) {
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
}
}
