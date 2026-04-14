import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getPublishedCourses } from '@/lib/courses';
import { CourseCard } from '@/components/courses/CourseCard';
import { Button } from '@/components/ui/Button';

export async function FeaturedCourses() {
  let courses: Awaited<ReturnType<typeof getPublishedCourses>> = [];
  try {
    const all = await getPublishedCourses();
    courses = all.slice(0, 6);
  } catch {
    // Firebase not configured
  }

  return (
    <section className="py-28 bg-gray-50/60 relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-grid opacity-50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <span className="section-label">
              <Sparkles size={12} />
              Featured Courses
            </span>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-navy-900 leading-tight">
              Learn from the
              <br />
              <span className="text-gradient">Best in Africa</span>
            </h2>
            <p className="text-gray-500 mt-4 max-w-lg text-base leading-relaxed">
              Handpicked courses taught by industry professionals. Start your transformation today.
            </p>
          </div>
          <Link href="/courses" className="shrink-0">
            <Button variant="outline" className="group">
              View All Courses
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </Link>
        </div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {courses.map((course, i) => (
              <div
                key={course.id}
                className="animate-delayed animate-in"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-5">
              <span className="text-4xl">📚</span>
            </div>
            <p className="font-display font-bold text-xl text-gray-500">No courses published yet</p>
            <p className="text-gray-400 text-sm mt-2">Check back soon — great content is on the way.</p>
          </div>
        )}
      </div>
    </section>
  );
}
