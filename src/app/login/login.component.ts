import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/authservice/auth.service';
import { first } from 'rxjs/operators';
import { error } from 'protractor';
import { of, throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthService)
  {
    authenticationService.attemptAutoLogin().subscribe(
      success => {
        this.router.navigate(['/files'], { replaceUrl: true , queryParams: {file: authenticationService.username}});
      },
      error => {
      }
    )
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get form() { 
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
        return;
    }

    this.authenticationService.login(this.form.username.value, this.form.password.value)
        .subscribe(
            data => {
                this.router.navigate(["files"], { replaceUrl: true , queryParams: {file: this.authenticationService.username}});
            },
            error => {
            });

    
  }

}
