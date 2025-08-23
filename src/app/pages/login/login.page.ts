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

  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  async onSubmit() {
    if (this.password !== this.confirmPassword) {
      alert('❌ Passwords do not match!');
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
