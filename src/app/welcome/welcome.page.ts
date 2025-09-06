import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class WelcomePage {
  constructor(private router: Router) {}

  goToSignin() {
    this.router.navigate(['/signin']);
  }

  goToSignup() {
    this.router.navigate(['/login']);
  }
}
