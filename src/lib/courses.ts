import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  arrayUnion,
} from 'firebase/firestore';
import { db } from './firebase';
import { DEMO_COURSES, DEMO_REVIEWS, isFirebaseConfigured } from './demo-data';
import type { Course, Review, Progress } from '@/types';

// ── Courses ──────────────────────────────────────────────────────────────────

export async function getPublishedCourses(): Promise<Course[]> {
  if (!isFirebaseConfigured()) {
    return DEMO_COURSES.filter(c => c.published);
  }
  const snap = await getDocs(query(collection(db!, 'courses'), where('published', '==', true)));
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }) as Course)
    .sort((a, b) => {
      const aMs = (a.createdAt as any)?.toMillis?.() ?? 0;
      const bMs = (b.createdAt as any)?.toMillis?.() ?? 0;
      return bMs - aMs;
    });
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  if (!isFirebaseConfigured()) {
    return DEMO_COURSES.find(c => c.slug === slug || c.id === slug) ?? null;
  }
  const q = query(collection(db!, 'courses'), where('slug', '==', slug));
  const snap = await getDocs(q);
  if (!snap.empty) {
    const d = snap.docs[0];
    return { id: d.id, ...d.data() } as Course;
  }
  // Fallback: treat the param as a document ID (for courses without a slug)
  return getCourseById(slug);
}

export async function getCourseById(id: string): Promise<Course | null> {
  if (!isFirebaseConfigured()) {
    return DEMO_COURSES.find(c => c.id === id) ?? null;
  }
  const snap = await getDoc(doc(db!, 'courses', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Course;
}

export async function getAllCourses(): Promise<Course[]> {
  if (!isFirebaseConfigured()) {
    return DEMO_COURSES;
  }
  const snap = await getDocs(collection(db!, 'courses'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Course);
}

export async function createCourse(data: Omit<Course, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db!, 'courses'), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateCourse(id: string, data: Partial<Course>) {
  await updateDoc(doc(db!, 'courses', id), data);
}

export async function deleteCourse(id: string) {
  await deleteDoc(doc(db!, 'courses', id));
}

// ── Reviews ──────────────────────────────────────────────────────────────────

export async function getCourseReviews(courseId: string): Promise<Review[]> {
  if (!isFirebaseConfigured()) {
    return DEMO_REVIEWS.filter(r => r.courseId === courseId);
  }
  const q = query(
    collection(db!, 'reviews'),
    where('courseId', '==', courseId),
    orderBy('createdAt', 'desc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Review);
}

export async function addReview(data: Omit<Review, 'id'>) {
  await addDoc(collection(db!, 'reviews'), {
    ...data,
    createdAt: serverTimestamp(),
  });
  const reviews = await getCourseReviews(data.courseId);
  const avg = reviews.reduce((s, r) => s + r.rating, data.rating) / (reviews.length + 1);
  await updateDoc(doc(db!, 'courses', data.courseId), { rating: Math.round(avg * 10) / 10 });
}

// ── Progress ─────────────────────────────────────────────────────────────────

export async function getProgress(userId: string, courseId: string): Promise<Progress | null> {
  if (!isFirebaseConfigured()) return null;
  const id = `${userId}_${courseId}`;
  const snap = await getDoc(doc(db!, 'progress', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Progress;
}

export async function markLessonComplete(
  userId: string,
  courseId: string,
  lessonKey: string,
  totalLessons: number,
) {
  if (!isFirebaseConfigured()) return;
  const { setDoc } = await import('firebase/firestore');
  const id  = `${userId}_${courseId}`;
  const ref = doc(db!, 'progress', id);
  const snap = await getDoc(ref as Parameters<typeof getDoc>[0]);

  if (!snap.exists()) {
    await setDoc(ref, {
      userId,
      courseId,
      completedLessons: [lessonKey],
      lastAccessed:     serverTimestamp(),
      percentComplete:  Math.round((1 / totalLessons) * 100),
    });
  } else {
    const data = snap.data() as Progress;
    if (data.completedLessons.includes(lessonKey)) return;
    const newCompleted = [...data.completedLessons, lessonKey];
    await updateDoc(ref, {
      completedLessons: arrayUnion(lessonKey),
      lastAccessed:     serverTimestamp(),
      percentComplete:  Math.round((newCompleted.length / totalLessons) * 100),
    });
  }
}

export async function getUserProgressAll(userId: string): Promise<Progress[]> {
  if (!isFirebaseConfigured()) return [];
  const q = query(collection(db!, 'progress'), where('userId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Progress);
}
