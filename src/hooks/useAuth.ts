'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserProfile } from '@/lib/auth';
import { isFirebaseConfigured } from '@/lib/demo-data';
import type { User } from '@/types';

interface AuthState {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    firebaseUser: null,
    user:         null,
    loading:      isFirebaseConfigured(), // only show loading spinner when Firebase is present
  });

  useEffect(() => {
    // In demo mode (no Firebase) there's nothing to listen to
    if (!isFirebaseConfigured() || !auth) {
      setState({ firebaseUser: null, user: null, loading: false });
      return;
    }

    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const profile = await getUserProfile(fbUser.uid);
        setState({ firebaseUser: fbUser, user: profile, loading: false });
      } else {
        setState({ firebaseUser: null, user: null, loading: false });
      }
    });
    return unsub;
  }, []);

  return state;
}
