import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService, ToastNoAnimation } from 'ngx-toastr';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitted: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService, private toastr: ToastrService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });

  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('email', this.loginForm.value.email);
    formData.append('password', this.loginForm.value.password);

    this.auth.login(formData).subscribe((res: any) => {
      if (res.isSuccess) {
        sessionStorage.setItem('token', res.token);
        sessionStorage.setItem('isUser', res.isUser);

        const redirectPath = sessionStorage.getItem('redirectAfterLogin');
        if (res.isUser) {
          if (redirectPath) {
            sessionStorage.removeItem('redirectAfterLogin');
            this.router.navigateByUrl(redirectPath);
          } else {
            this.router.navigate(['/book-listing']);
          }
        }
        else {
          this.router.navigateByUrl('/admin/dashboard');
        }
        this.toastr.success(res.message, 'Success');
      }
    },
      (err: any) => {
        this.toastr.error(err.error, 'Error');
      }
    );
  }

  navigateToHome() {
    this.router.navigate(['/landingPage']);
  }
}
