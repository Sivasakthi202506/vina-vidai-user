import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './question.page.html',
  styleUrls: ['./question.page.scss'],
})
export class QuestionPage {
  step = 1;
  numQuestions: number | null = null;
  timeSelected: number | null = null;

  constructor(private router: Router) {}

 nextStep() {
  if (this.step === 1 && this.numQuestions != null) {
    this.step = 2;
  } else if (this.step === 2 && this.timeSelected != null) {
    const timeMap: { [key: number]: number } = {
      1: 600,  // 10 minutes  (10*60)
      2: 1200, // 20 minutes
      3: 1800, // 30 minutes
      4: 605,  // 10 minutes 5 seconds
      5: 610,  // 10 minutes 10 seconds
    };

    const totalSeconds = timeMap[this.timeSelected];

    this.router.navigate(['/tabs', 'test'], {
      queryParams: {
        questions: this.numQuestions,
        time: totalSeconds,  // send in seconds
      },
    });
  }
}


  prevStep() {
    if (this.step > 1) this.step--;
  }
}
