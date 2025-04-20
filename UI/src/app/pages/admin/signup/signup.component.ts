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
      userName:['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
      password: ['', [Validators.required]]
    });

  }

  get f() {
    return this.signupForm.controls;
  }

  navigateToHome() {
    this.router.navigate(['/landingPage']);
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.signupForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('firstName', this.signupForm.value.firstName);
    formData.append('lastName', this.signupForm.value.lastName);
    formData.append('userName', this.signupForm.value.userName);
    formData.append('email', this.signupForm.value.email);
    formData.append('password', this.signupForm.value.password);

    this.auth.Register(formData).subscribe((res: any) => {
      if (res.isSuccess) {
        this.signupForm.reset();
        this.toastr.success(res.message, 'Success');
        this.router.navigateByUrl('/login')
      }
    },
      (err: any) => {
        this.toastr.error(err.error, 'Error');
      }
    );
  }
}
