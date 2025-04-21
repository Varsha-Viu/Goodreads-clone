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
  activeTab: 'profile' | 'challenge' = 'profile';
  readingChallenge: any = null;
  readingChallengeProgress: number = 0;
  userId: any;
  isAddChallengeModalOpen = false;
  targetBooks: number = 0;

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService, private userService: UserService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required, Validators.pattern('^[0-9]{10}$')]
    });

    this.getUserProfile();
    this.userId = this.authService.getUserId(); // Replace with your actual auth logic
    if (this.userId) {
      this.fetchReadingChallenge(this.userId);
    }
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

  openProfileTab() {
    this.activeTab = 'profile';
    this.getUserProfile()
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
  }
  
  fetchReadingChallenge(userId: string): void {
    this.userService.getUserChallenge(userId).subscribe({
      next: (res: any) => {
        this.readingChallenge = res;
        this.calculateChallengeProgress();
      },
      error: (err) => {
        console.error('Failed to fetch reading challenge', err);
      }
    });
  }

  calculateChallengeProgress(): void {
    if (this.readingChallenge && this.readingChallenge.targetBooks > 0) {
      const completed = this.readingChallenge.completedBooks || 0;
      const target = this.readingChallenge.targetBooks;
      this.targetBooks = this.readingChallenge.targetBooks;
      this.readingChallengeProgress = (completed / target) * 100;
    } else {
      this.readingChallengeProgress = 0;
    }
  }

  openAddChallengeModal(): void {
    this.isAddChallengeModalOpen = true;
  }

  closeAddChallengeModal(): void {
    this.isAddChallengeModalOpen = false;
    this.targetBooks = 0;
  }
  submitReadingChallenge(): void {
    if (this.targetBooks > 0) {
      const d = new Date();
      let year = d.getFullYear();
      const payload = {
        targetBooks: this.targetBooks,
        userId: this.userId,
        year: year,
        CompletedBooks: this.readingChallenge.completedBooks,
      };

      this.userService.updateChallenge(this.readingChallenge.id, payload).subscribe({
        next: (res) => {
          this.toastr.success('Challenge updated!');
          this.readingChallenge = res;
          this.readingChallengeProgress = 0;
          this.fetchReadingChallenge(this.userId)
          this.closeAddChallengeModal();
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Failed to add challenge');
        },
      });
    }
  }
}

