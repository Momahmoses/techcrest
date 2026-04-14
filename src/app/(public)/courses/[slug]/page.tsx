import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCourseBySlug, getCourseReviews } from '@/lib/courses';
import { CourseDetailClient } from './CourseDetailClient';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const course = await getCourseBySlug(params.slug);
    if (!course) return { title: 'Course Not Found' };
    return {
      title: course.title,
      description: course.description,
      openGraph: {
        title:       course.title,
        description: course.description,
        images:      course.thumbnail ? [{ url: course.thumbnail }] : [],
      },
    };
  } catch {
    return { title: 'Course' };
  }
}

export default async function CourseDetailPage({ params }: Props) {
  let course = null;
  let reviews: import('@/types').Review[] = [];

  try {
    course  = await getCourseBySlug(params.slug);
    if (course) reviews = await getCourseReviews(course.id);
  } catch {
    // Firebase not configured — show demo
  }

  if (!course && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    notFound();
  }

  return <CourseDetailClient course={course} reviews={reviews} />;
}
