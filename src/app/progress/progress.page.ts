import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-progress',
  standalone: true,
  templateUrl: './progress.page.html',
  styleUrls: ['./progress.page.scss'],
  imports: [
    CommonModule,   
    IonicModule,    
    DatePipe        
  ],
})
export class ProgressPage implements OnInit {
  progressData: any[] = [];

  constructor(private firestore: Firestore, private auth: Auth) {}

  async ngOnInit() {
    const user = this.auth.currentUser;
    if (!user) return;

    const colRef = collection(this.firestore, `users/${user.uid}/progress`);
    const snapshot = await getDocs(colRef);

    this.progressData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }
}
