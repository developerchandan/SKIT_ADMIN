import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../model/auth';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  signupFormGroup!: FormGroup;
  passwordView!: string;
  avail!: boolean;
  msg: any = [];

  isSubmitted: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.signupFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      // role: ['', Validators.required],
    });
  }

  onSubmitSignUp() {
    debugger
    console.log('this is register', this.signupFormGroup.value);
    this.isSubmitted = true;

    if (this.signupFormGroup.invalid) {
      return;
    }
    const user: User = {
      name: this.userForm['name'].value,
      email: this.userForm['email'].value,
      password: this.userForm['password'].value,
      phone: this.userForm['phone'].value,
      // role: this.userForm['role'].value,
    };
    this.auth.createUser(user).subscribe(

      (user: User) =>

        {

          if ((<any>user)['msg']) {
            this.msg = (<any>user)['msg'];
            this.avail = true;
            return;
          }

      alert("Sussfully")
        this.signupFormGroup.reset();
        this.router.navigate(['/']);
        console.log(user);
      },
      (error) => {
        alert("Not Sussfully")
      }
    );
  }

  get userForm() {
    return this.signupFormGroup.controls;
  }
}
