import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../authservice/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor{

  constructor(private authenticationService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    if (this.authenticationService.isLoggedIn) {
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${this.authenticationService.token}`
            }
        });
    }

    return next.handle(request);
}
}
