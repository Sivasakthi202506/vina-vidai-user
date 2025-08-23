import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, UserCredential } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, collection, query, where, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {}

  // 🔹 Sign up new user
  async signUp(email: string, password: string, username: string): Promise<UserCredential> {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

    // Save additional user data to Firestore
    const uid = userCredential.user.uid;
    await setDoc(doc(this.firestore, 'users', uid), {
      username,
      email
    });

    return userCredential;
  }

  // 🔹 Sign in with email
  async signInWithEmail(email: string, password: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  // 🔹 Sign in with username (resolve to email first)
  async signInWithUsername(username: string, password: string): Promise<UserCredential> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error('Username not found');
    }

    const userDoc = querySnapshot.docs[0];
    const email = userDoc.data()['email'];

    return await this.signInWithEmail(email, password);
  }

  // 🔹 Get user details by UID
  async getUser(uid: string): Promise<any> {
    const docRef = doc(this.firestore, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error('No such user!');
    }
  }

  // 🔹 Sign out current user
  async logout(): Promise<void> {
    await signOut(this.auth);
  }
}
