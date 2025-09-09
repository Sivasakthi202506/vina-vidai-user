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

  // icons state
  icons: { emailOrUsername: boolean; password: boolean } = {
    emailOrUsername: false,
    password: false,
  };

  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  updateIcon(field: 'emailOrUsername' | 'password') {
    this.icons[field] = this[field].trim().length > 0;
  }

  async onSignIn() {
    try {
      if (this.password.length < 6) {
        console.error('❌ Password too short');
        return;
      }

      if (this.emailOrUsername.includes('@')) {
        await this.firebaseService.signInWithEmail(this.emailOrUsername, this.password);
      } else {
        await this.firebaseService.signInWithUsername(this.emailOrUsername, this.password);
      }

      console.log('✅ Sign in successful!');
      this.router.navigate(['/tabs']);
    } catch (error: any) {
      console.error('Sign in error:', error);
      console.log(`❌ Sign in failed: ${error.message}`);
    }
  }

  goToSignup() {
    this.router.navigate(['/login']);
  }

  
}
