import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm!: FormGroup;
  avail!: boolean;
  msg: any = [];
  isSubmitted: boolean = false;
  emailSent: boolean = false;
  isLoggedIn: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private auth: AuthService,

  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  checkIfLoggedIn() {
    // check if user is logged in
    const usersData = localStorage.getItem('usersdata');
    if (usersData) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }
  onSubmit() {
    this.isSubmitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    this.auth.loginUser(email, password).subscribe(
      (user) => {
        if (user['msg']) {
          this.msg = user['msg'];
          this.avail = true;
        } else if (!user['role']) {
          if (user.isVerified) {
            const data = {
              name: user.name,
              email: user.email,
              token: user.token,
              userId: user.userId,
              // role: user.role
            };
            localStorage.setItem('usersdata', JSON.stringify(data));
            this.isLoggedIn = true;
            this.navigateToHomepage();
          } else {
            this.router.navigate(['/verify-user-profile']);
          }
        } else {
          this.router.navigate(['/']);
        }
      },
      (error) => {
        console.error('Login failed:', error);
      }
    );
  }

  navigateToHomepage() {
    this.router.navigate(['/dashboard/all-course']).then(() => {
      window.location.reload();
    });
  }



  get LoginFormValue() {
    return this.loginForm.controls;
  }
}
