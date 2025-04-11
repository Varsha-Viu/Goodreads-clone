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
      password: ['', [Validators.required]]
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
        if (res.isUser) {
          this.toastr.error('You are not an admin', 'Error');
          return;
        }
        localStorage.setItem('token', res.token);
        localStorage.setItem('isUser', res.isUser);
        this.toastr.success(res.message, 'Success');
        this.router.navigateByUrl('/admin/dashboard')
      }
    },
      (err: any) => {
        this.toastr.error(err.error, 'Error');
      }
    );
  }
}
