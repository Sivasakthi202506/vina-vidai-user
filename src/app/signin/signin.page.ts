import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebaseauth.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage {
  emailOrUsername: string = '';
  password: string = '';

  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  async onSignIn() {
    try {
      if (this.emailOrUsername.includes('@')) {
        // Login with email
        await this.firebaseService.signInWithEmail(this.emailOrUsername, this.password);
      } else {
        // Login with username
        await this.firebaseService.signInWithUsername(this.emailOrUsername, this.password);
      }

      alert('✅ Sign in successful!');
      this.router.navigate(['/tabs']);
    } catch (error: any) {
      console.error('Sign in error:', error);
      alert(`❌ Sign in failed: ${error.message}`);
    }
  }

  goToSignup() {
    this.router.navigate(['/login']);
  }
}
