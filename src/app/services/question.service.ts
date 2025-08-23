// src/app/services/question.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, query, limit } from '@angular/fire/firestore';
import { from, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private firestore: Firestore) {}

  getQuestions(count: number) {
    const questionsRef = collection(this.firestore, 'questions');
    const q = query(questionsRef, limit(count));
    return from(getDocs(q)).pipe(
      map(snapshot =>
        snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      )
    );
  }
}
