import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-test',
  standalone: true,
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
  imports: [CommonModule, IonicModule],
})
export class TestPage implements OnInit, OnDestroy {
  questions: any[] = [];
  currentQuestionIndex = 0;
  timer: number = 0;
  timerInterval: any;
  duration: number = 0;

  answered = false;
  selectedOption: string | null = null;

  // ✅ State
  correctCount: number = 0;
  showResult: boolean = false;
  reviewMode: boolean = false;
  resultColor: string = '';
  userAnswers: any = {};

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private router: Router,
    
  ) {}

  async ngOnInit() {
  // ✅ Read params exactly as sent
  const numQuestions =
    Number(this.route.snapshot.queryParamMap.get('questions')) || 5;
  this.duration =
    Number(this.route.snapshot.queryParamMap.get('time')) || 600; // seconds

  // ✅ Timer directly uses user-given seconds
  this.timer = this.duration;

  await this.loadQuestions(numQuestions);
}


  ngOnDestroy() {
    this.stopTimer();
  }

  ionViewWillEnter() {
    this.startTimer();
  }

  ionViewWillLeave() {
    this.stopTimer();
  }

  startTimer() {
    if (this.timerInterval) return;
    this.timerInterval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        this.stopTimer();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' + s : s}`;
  }

  async loadQuestions(numQuestions: number) {
    const colRef = collection(this.firestore, 'questions');
    const snapshot = await getDocs(colRef);

    let allQuestions: any[] = [];
    snapshot.forEach((doc) => {
      allQuestions.push({ id: doc.id, ...doc.data() });
    });

    allQuestions = allQuestions.sort(() => Math.random() - 0.5);
    this.questions = allQuestions.slice(0, numQuestions);
  }

  selectOption(option: string) {
    this.answered = true;
    this.selectedOption = option;

    // ✅ Save answer
    this.userAnswers[this.questions[this.currentQuestionIndex].id] = option;
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.loadStoredAnswer();
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.loadStoredAnswer();
    }
  }

  private loadStoredAnswer() {
    const qId = this.questions[this.currentQuestionIndex].id;
    if (this.userAnswers[qId]) {
      this.selectedOption = this.userAnswers[qId];
      this.answered = true;
    } else {
      this.selectedOption = null;
      this.answered = false;
    }
  }

 

  get progress() {
    return `${this.currentQuestionIndex + 1}/${this.questions.length}`;
  }

  goToReview() {
    this.showResult = false;
    this.reviewMode = true;
  }
  timeBonus: number = 0;
totalPoints: number = 0;
  submitQuiz() {
  this.correctCount = 0;

  // ✅ Count correct answers
  this.questions.forEach((q) => {
    if (this.userAnswers[q.id] === q.answer) {
      this.correctCount++;
    }
  });

  // ✅ Time bonus (1 point for every 30 seconds left, adjust as you like)
  this.timeBonus = Math.floor(this.timer / 30);

  // ✅ Total points
  this.totalPoints = this.correctCount * 10 + this.timeBonus;

  // ✅ Show result card
  this.showResult = true;

  // ✅ Stop timer
  this.stopTimer();
}

}
