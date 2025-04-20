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
  openForgotPasswordModal: boolean = false;
  isForgotPasswordFormSubmitted = false;
  forgotPasswordForm: FormGroup;
  ResetPasswordForm: FormGroup;
  isResetPasswordFormSubmitted = false;
  openResetPasswordModal: boolean = false;
  response: any;

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService, private toastr: ToastrService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });

    this.forgotPasswordForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
        ]
      ]
    });
    this.ResetPasswordForm = this.fb.group({
      newPassword: [
        '',
        [
          Validators.required,
          // Validators.pattern('^(?=.[a-z])(?=.[A-Z])(?=.\\d)(?=.[@$!%?&#])[A-Za-z\\d@$!%?&#]{8,}$')
        ]
      ],
      confirmPassword: [
        '',
        [
          Validators.required
        ]
      ]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  get email() {
    return this.forgotPasswordForm.controls;
  }

  get p() {
    return this.ResetPasswordForm.controls;
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
            this.router.navigateByUrl(redirectPath);
            sessionStorage.removeItem('redirectAfterLogin');
          } else {
            this.router.navigate(['/Home']);
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

  submitForgotPassword() {
    this.isForgotPasswordFormSubmitted = true;

    if (this.forgotPasswordForm.invalid) {
      return;
    }

    const emailValue = this.forgotPasswordForm.value.email;

    this.auth.ForgotPassword(emailValue).subscribe(
      (res: any) => {
        if (res.isSuccess) {
          console.log(res);
          this.response = res;

          // 1. Show success message
          this.toastr.success('Reset link sent. Opening password reset in 2 seconds...', 'Success');

          // 2. Close forgot modal
          this.closeModal();

          // 3. Delay before opening reset modal
          setTimeout(() => {
            this.openResetPasswordModal = true;
          }, 2000); // 2000 = 2 seconds
        }
      },
      (err: any) => {
        this.toastr.error(err.error, "Error");
      }
    );

    // Handle your email submission logic here
    // console.log('Sending reset link to:', emailValue);

    // Optionally reset or close modal

  }

  submitResetPassword() {
    debugger
    this.isResetPasswordFormSubmitted = true;

    if (this.ResetPasswordForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('email', this.response.email);
    formData.append('token', this.response.resetToken);
    formData.append('newPassword', this.ResetPasswordForm.value.newPassword);
    // const emailValue = this.forgotPasswordForm.value.email;
    this.auth.ResetPassword(formData).subscribe(
      (res: any) => {
        console.log(res);
        this.toastr.success(res.message, "Success!");
        this.closeModal();
      },
      (err: any) => {
        this.toastr.error(err.error, "Error");
      }
    )
    // Handle your email submission logic here
    // console.log('Sending reset link to:', emailValue);

    // Optionally reset or close modal

  }

  openModal() {
    this.openForgotPasswordModal = true;
  }

  closeModal() {
    this.openForgotPasswordModal = false;
    this.forgotPasswordForm.reset();
    this.isForgotPasswordFormSubmitted = false;
    this.ResetPasswordForm.reset();
    this.isResetPasswordFormSubmitted = false;
    this.openResetPasswordModal = false;
  }
}
