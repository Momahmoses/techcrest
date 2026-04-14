import type { Metadata } from 'next';
import { CourseCatalogClient } from './CourseCatalogClient';
import { getPublishedCourses } from '@/lib/courses';

export const metadata: Metadata = { title: 'All Courses' };

export default async function CoursesPage() {
  let courses: Awaited<ReturnType<typeof getPublishedCourses>> = [];
  try {
    courses = await getPublishedCourses();
  } catch {
    // Firebase not yet configured
  }

  return <CourseCatalogClient initialCourses={courses} />;
}
