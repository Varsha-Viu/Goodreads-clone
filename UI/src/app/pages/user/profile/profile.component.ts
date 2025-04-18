import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../shared/services/user.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  profileForm!: FormGroup;
  message: string = '';
  user: any;

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService, private userService: UserService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required]
    });

    this.getUserProfile();
    // Optional: Load existing user data here via GET request
  }

  getUserProfile() {
    const userId = this.authService.getUserId();
    this.userService.getUserProfile(userId).subscribe(
      (res:any)=> {
        this.user = res;
        console.log(res)
        this.profileForm.patchValue({
          firstName: res.firstName,
          lastName: res.lastName,
          email: res.email,
          userName: res.userName,
          address: res.address,
          phoneNumber: res.phoneNumber
        })
      }
    )
  }

  updateProfile(): void {
    if (this.profileForm.invalid) return;

    const userId = this.authService.getUserId();
    

    const formData = this.profileForm.value;

    this.userService.UpdateUser(userId, formData).subscribe(
      (res: any) => {
        this.toastr.success("Profile updated successfully", "Success");
        this.getUserProfile();
      },
      (err: any) => {
        this.toastr.error("Error updating user", "Error");
      }
    )

    // this.http.put(`https://your-api-url.com/api/user/update/${userId}`, formData)
    //   .subscribe({
    //     next: (res: any) => this.message = res.message,
    //     error: err => {
    //       console.error(err);
    //       this.message = 'Something went wrong.';
    //     }
    //   });
  }
  
}
