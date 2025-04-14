import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupForm: FormGroup;
  isSubmitted: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService, private toastr: ToastrService) {
    this.signupForm = this.fb.group({
      firstName:['', [Validators.required]],
      lastName:['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

  }

  get f() {
    return this.signupForm.controls;
  }

  onSubmit() {
    // this.isSubmitted = true;
    // if (this.loginForm.invalid) {
    //   return;
    // }

    // const formData = new FormData();
    // formData.append('email', this.loginForm.value.email);
    // formData.append('password', this.loginForm.value.password);

    // this.auth.login(formData).subscribe((res: any) => {
    //   if (res.isSuccess) {
    //     if (res.isUser) {
    //       this.toastr.error('You are not an admin', 'Error');
    //       return;
    //     }
    //     sessionStorage.setItem('token', res.token);
    //     sessionStorage.setItem('isUser', res.isUser);
    //     this.toastr.success(res.message, 'Success');
    //     this.router.navigateByUrl('/admin/dashboard')
    //   }
    // },
    //   (err: any) => {
    //     this.toastr.error(err.error, 'Error');
    //   }
    // );
  }
}
