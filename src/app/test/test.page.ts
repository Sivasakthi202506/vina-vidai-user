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

  answered = false;
  selectedOption: string | null = null;

  showStars = false;
  showSad = false;

  private duration: number = 0; // store total duration (seconds)

  // ✅ New state
  correctCount: number = 0;
  showResult: boolean = false;
  resultMessage: string = '';
  resultColor: string = '';
  resultEmoji: string = '';

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private router: Router
  ) {}

  async ngOnInit() {
    const numQuestions =
      Number(this.route.snapshot.queryParamMap.get('numQuestions')) || 5;
    this.duration =
      Number(this.route.snapshot.queryParamMap.get('duration')) || 10;

    this.timer = this.duration * 60; // convert to seconds
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

    let minText = m > 0 ? `${m} minute${m > 1 ? 's' : ''}` : '';
    let secText = s > 0 ? `${s} second${s > 1 ? 's' : ''}` : '';

    if (minText && secText) {
      return `${minText} ${secText}`;
    } else if (minText) {
      return minText;
    } else {
      return secText;
    }
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
    if (this.answered) return;

    this.answered = true;
    this.selectedOption = option;
    const correctAnswer = this.questions[this.currentQuestionIndex]?.answer;

    if (option === correctAnswer) {
      this.correctCount++; // ✅ Count correct answers
      this.showStars = true;
      setTimeout(() => (this.showStars = false), 2000);
    } else {
      this.showSad = true;
      setTimeout(() => (this.showSad = false), 2000);
    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.answered = false;
      this.selectedOption = null;
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.answered = false;
      this.selectedOption = null;
    }
  }

  submitQuiz() {
    const total = this.questions.length;
    const percentage = Math.round((this.correctCount / total) * 100);

    if (percentage <= 40) {
      this.resultColor = 'danger';
      this.resultMessage = 'Better luck next time!';
      this.resultEmoji = '😢';
    } else if (percentage < 80) {
      this.resultColor = 'warning';
      this.resultMessage = 'Good effort!';
      this.resultEmoji = '🙂';
    } else {
      this.resultColor = 'success';
      this.resultMessage = 'Excellent!';
      this.resultEmoji = '😃';
    }

    this.showResult = true;
    this.stopTimer();
  }

  get progress() {
    return `${this.currentQuestionIndex + 1}/${this.questions.length}`;
  }
  goHome() {
    this.router.navigate(['/home']);
  }

}
