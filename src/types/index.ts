export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bio?: string;
  photoURL?: string;
  enrolledCourses: string[];
  createdAt: string;
}

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type CourseCategory =
  | 'Cybersecurity'
  | 'Web Development'
  | 'Data Science'
  | 'Cloud Computing'
  | 'Mobile Development'
  | 'DevOps'
  | 'UI/UX Design'
  | 'Networking';

export interface Lesson {
  title: string;
  videoURL: string;
  duration: string;
}

export interface Module {
  moduleTitle: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: CourseCategory;
  level: CourseLevel;
  price: number;
  originalPrice?: number;
  duration: string;
  lessons: number;
  students: number;
  rating: number;
  instructor: string;
  instructorBio: string;
  instructorPhoto?: string;
  thumbnail: string;
  curriculum: Module[];
  published: boolean;
  createdAt: string;
  tags?: string[];
  whatYoullLearn?: string[];
}

export interface Transaction {
  id: string;
  reference: string;
  amount: number;
  studentId: string;
  studentName?: string;
  courseId: string;
  courseTitle?: string;
  status: 'success' | 'failed' | 'pending';
  paymentMethod?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  courseId: string;
  studentId: string;
  studentName: string;
  studentPhoto?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface Progress {
  id: string;           // `${userId}_${courseId}`
  userId: string;
  courseId: string;
  completedLessons: string[];
  lastAccessed: string;
  percentComplete: number;
}
