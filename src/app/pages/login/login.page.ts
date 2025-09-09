import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebaseauth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  icons = {
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  };

  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  updateIcon(field: 'username' | 'email' | 'password' | 'confirmPassword') {
    this.icons[field] = this[field].trim().length > 0;
  }

  // ✅ validation helpers
  isUsernameValid(): boolean {
    return /^[A-Za-z]+$/.test(this.username);
  }

  isEmailValid(): boolean {
    return this.emailPattern.test(this.email);
  }

  isPasswordValid(): boolean {
    return this.password.length >= 6;
  }

  isConfirmPasswordValid(): boolean {
    return this.password === this.confirmPassword;
  }

  isFormValid(): boolean {
    return (
      this.isUsernameValid() &&
      this.isEmailValid() &&
      this.isPasswordValid() &&
      this.isConfirmPasswordValid()
    );
  }

  async onSubmit() {
    if (!this.isFormValid()) {
      alert('❌ Please fix validation errors before submitting.');
      return;
    }

    try {
      await this.firebaseService.signUp(this.email, this.password, this.username);
      console.log('✅ Signed up successfully!');
      this.router.navigate(['/signin']);
    } catch (error: any) {
      console.error('Signup error:', error);
      console.log(`❌ Sign-up failed: ${error.message}`);
    }
  }

  goToSignin() {
    this.router.navigate(['/signin']);
  }
}
