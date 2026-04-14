'use client';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';
import { isFirebaseConfigured } from './demo-data';
import type { User } from '@/types';

function requireFirebase(): void {
  if (!isFirebaseConfigured()) {
    throw new Error(
      'Firebase is not configured. Add your Firebase keys to .env.local to enable authentication.',
    );
  }
}

export async function signUp(name: string, email: string, password: string) {
  requireFirebase();
  const credential = await createUserWithEmailAndPassword(auth!, email, password);
  const user = credential.user;

  await setDoc(doc(db!, 'users', user.uid), {
    name,
    email,
    role:            'student',
    enrolledCourses: [],
    createdAt:       serverTimestamp(),
  });

  return user;
}

export async function signIn(email: string, password: string) {
  requireFirebase();
  return signInWithEmailAndPassword(auth!, email, password);
}

export async function signInWithGoogle() {
  requireFirebase();
  const result = await signInWithPopup(auth!, googleProvider!);
  const user = result.user;

  const userRef = doc(db!, 'users', user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      name:            user.displayName ?? 'Student',
      email:           user.email,
      role:            'student',
      photoURL:        user.photoURL ?? '',
      enrolledCourses: [],
      createdAt:       serverTimestamp(),
    });
  }

  return user;
}

export async function signOut() {
  if (!isFirebaseConfigured()) return;
  return firebaseSignOut(auth!);
}

export async function resetPassword(email: string) {
  requireFirebase();
  return sendPasswordResetEmail(auth!, email);
}

export async function changePassword(
  currentUser: FirebaseUser,
  currentPassword: string,
  newPassword: string,
) {
  requireFirebase();
  const credential = EmailAuthProvider.credential(
    currentUser.email!,
    currentPassword,
  );
  await reauthenticateWithCredential(currentUser, credential);
  return updatePassword(currentUser, newPassword);
}

export async function getUserProfile(uid: string): Promise<User | null> {
  if (!isFirebaseConfigured() || !db) return null;
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as User;
}
