import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_ADMIN_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
      privateKey:  process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

async function setAdmin(uid: string) {
  const ref = db.collection('users').doc(uid);
  const snap = await ref.get();

  if (!snap.exists) {
    // Create the document if it doesn't exist yet
    await ref.set({ role: 'admin', enrolledCourses: [], createdAt: new Date() });
    console.log(`Created user document and set role to admin for UID: ${uid}`);
  } else {
    await ref.update({ role: 'admin' });
    console.log(`Updated role to admin for UID: ${uid}`);
  }
}

setAdmin('VAmGpi6XU2TDaXgjvGvr1VopzXB2').catch(console.error);
