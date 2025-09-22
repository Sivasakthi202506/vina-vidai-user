import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';

import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, NgChartsModule],
  templateUrl: './progress.page.html',
  styleUrls: ['./progress.page.scss'],
})
export class ProgressPage implements OnInit {
  segment: 'daily' | 'weekly' | 'subjects' = 'daily';

  uid: string | null = null;
  userDocData: any = null;

  // --- Daily chart ---
  dailyLabels: string[] = [];
  dailyDataSet = [{ 
    data: [] as number[], 
    label: 'Daily Points x2', 
    backgroundColor: '#00c9a7' 
  }];
  dailyChartData: any = { labels: this.dailyLabels, datasets: this.dailyDataSet };
  dailyOptions: any = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { stepSize: 2 } } // adjust step size if needed
    }
  };

  // --- Weekly chart ---
  weeklyLabels: string[] = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  weeklyDataSet = [{ 
    data: [] as number[], 
    label: 'Weekly Points x2', 
    fill: true,
    backgroundColor: 'rgba(0,201,167,0.2)', 
    borderColor: '#00c9a7', 
    borderWidth: 2 
  }];
  weeklyChartData: any = { labels: this.weeklyLabels, datasets: this.weeklyDataSet };
  weeklyOptions: any = {
    responsive: true,
    elements: { line: { tension: 0.4, fill: true } },
    scales: { x: { grid: { display: false } }, y: { beginAtZero: true, ticks: { stepSize: 2 } } },
    plugins: { legend: { display: false } }
  };

  // --- Subject pie chart ---
  subjectLabels: string[] = [];
  subjectData: number[] = [];
  subjectColors: string[] = ['#00c9a7','#ff6384','#36a2eb','#ffcd56','#9966ff','#ff9f40','#8c564b'];
  subjectChartData: any = { labels: this.subjectLabels, datasets: [{ data: this.subjectData, backgroundColor: this.subjectColors }] };
  subjectOptions: any = { responsive: true, plugins: { legend: { position: 'bottom' } } };

  totalPoints: number = 0;
  lastUpdated: string = '';

  constructor(private firestore: Firestore, private auth: Auth) {}

  ngOnInit(): void {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      this.uid = currentUser.uid;
      this.loadUserProgress();
    } else {
      onAuthStateChanged(this.auth, (user: User | null) => {
        if (user) {
          this.uid = user.uid;
          this.loadUserProgress();
        }
      });
    }
  }

  private async loadUserProgress() {
  if (!this.uid) return;

  try {
    const docRef = doc(this.firestore, 'users', this.uid);
    const snap = await getDoc(docRef);

    if (!snap.exists()) return;

    const data = snap.data() as any;
    this.userDocData = data;

    // Total points & last updated
    this.totalPoints = data.points ?? 0;
    this.lastUpdated = data.date?.toDate
      ? data.date.toDate().toLocaleString()
      : new Date().toLocaleString();

    // --- Daily chart ---
// --- Daily chart ---
let dailyObj: any = {};
if (typeof data.daily === 'string') {
  dailyObj = safeParse(data.daily);
} else {
  dailyObj = data.daily || {};
}

// Sort keys as real dates
const sortedKeys = Object.keys(dailyObj).sort(
  (a, b) => new Date(a).getTime() - new Date(b).getTime()
);

// ✅ Directly use Firestore keys as x-axis labels
this.dailyLabels = sortedKeys.map(dateStr => {
  const dt = new Date(dateStr);
  return dt.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
});


// Set dataset values
this.dailyDataSet[0].data = sortedKeys.map(k => (Number(dailyObj[k]) || 0) );

// Assign to chart
this.dailyChartData = {
  labels: [...this.dailyLabels],
  datasets: [...this.dailyDataSet]
};

function safeParse(str: string): any {
  try {
    const fixed = str
      .replace(/(\w+):/g, '"$1":')   // add quotes around keys
      .replace(/,}/g, '}')           // remove trailing commas
      .replace(/,]/g, ']');          // remove trailing commas
    return JSON.parse(fixed);
  } catch (err) {
    console.error("❌ Failed to parse:", err, "Input:", str);
    return {};
  }
}



    // --- Weekly chart ---
   // --- Weekly chart ---
let weeklyObj: any = {};
try {
  if (typeof data.weekly === 'string') {
    weeklyObj = JSON.parse(data.weekly);   // parse Firestore string
  } else {
    weeklyObj = data.weekly || {};
  }
} catch (err) {
  console.error('Failed to parse weekly:', err);
  weeklyObj = {};
}

this.weeklyLabels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

// Fill chart dataset
this.weeklyDataSet[0].data = this.weeklyLabels.map(day =>
  Number(weeklyObj[day]) ? Number(weeklyObj[day]) : 0
);

// Force chart refresh
this.weeklyChartData = {
  labels: [...this.weeklyLabels],
  datasets: JSON.parse(JSON.stringify(this.weeklyDataSet))  // deep copy so chart updates
};



    // --- Subject chart ---
    let subjObj: any = {};
    try {
      subjObj = JSON.parse(data.subjects); // 👈 Parse string
    } catch {
      subjObj = {};
    }

    this.subjectLabels = Object.keys(subjObj);
    this.subjectData = this.subjectLabels.map(s => Number(subjObj[s]) || 0);

    this.subjectChartData = {
      labels: [...this.subjectLabels],
      datasets: [{
        data: [...this.subjectData],
        backgroundColor: this.subjectLabels.map(
          (_, i) => this.subjectColors[i % this.subjectColors.length]
        )
      }]
    };

  } catch (err) {
    console.error('❌ Failed to load user progress:', err);
  }
}

  setSegment(s: 'daily' | 'weekly' | 'subjects') {
    this.segment = s;
  }
}
