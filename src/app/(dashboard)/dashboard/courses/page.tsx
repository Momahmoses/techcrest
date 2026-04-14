'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookMarked, Award, Play, RotateCcw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getCourseById, getUserProgressAll } from '@/lib/courses';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CATEGORY_ICONS } from '@/constants';
import type { Course, Progress } from '@/types';

export default function MyCoursesPage() {
  const { user } = useAuth();
  const [courses,  setCourses]  = useState<Course[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const [progs, courseList] = await Promise.all([
          getUserProgressAll(user.id),
          Promise.all((user.enrolledCourses ?? []).map(id => getCourseById(id))),
        ]);
        setProgress(progs);
        setCourses(courseList.filter(Boolean) as Course[]);
      } catch {}
      finally { setLoading(false); }
    };
    load();
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-3xl text-navy-900">My Courses</h1>
        <p className="text-gray-500 mt-1 text-sm">
          <span className="font-bold text-navy-900">{courses.length}</span>{' '}
          enrolled course{courses.length !== 1 ? 's' : ''}
        </p>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3].map(i => <div key={i} className="h-64 rounded-3xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : courses.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map(course => {
            const prog = progress.find(p => p.courseId === course.id);
            const pct  = prog?.percentComplete ?? 0;
            return (
              <div key={course.id} className="group bg-white rounded-3xl border border-gray-100 shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-400 overflow-hidden flex flex-col">
                {/* Thumbnail */}
                <div className="h-44 bg-gradient-to-br from-navy-800 to-navy-950 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-navy-700/80 to-navy-950" />
                  <span className="relative z-10 text-6xl select-none drop-shadow-lg">
                    {CATEGORY_ICONS[course.category] ?? '📚'}
                  </span>
                  {/* Progress overlay */}
                  {pct > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1">
                      <div
                        className="h-full bg-gradient-to-r from-accent-400 to-accent-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  )}
                  {pct === 100 && (
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                      ✓ Done
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1 gap-3">
                  <p className="text-xs font-bold text-accent-600 uppercase tracking-wide">{course.category}</p>
                  <h3 className="font-display font-bold text-navy-900 text-sm leading-snug line-clamp-2 group-hover:text-accent-600 transition-colors flex-1">
                    {course.title}
                  </h3>

                  <div className="flex items-center justify-between">
                    <Badge
                      variant={pct === 100 ? 'success' : pct > 0 ? 'warning' : 'default'}
                      size="sm"
                    >
                      {pct === 100 ? 'Completed' : pct > 0 ? 'In Progress' : 'Not Started'}
                    </Badge>
                    <span className="text-xs font-bold text-gray-500">{pct}%</span>
                  </div>

                  <ProgressBar value={pct} size="sm" color={pct === 100 ? 'green' : 'accent'} />

                  <div className="flex flex-col gap-2 pt-1">
                    <Link href={`/dashboard/courses/${course.slug}`}>
                      <Button
                        size="sm"
                        fullWidth
                        variant={pct > 0 ? 'primary' : 'outline'}
                        className={pct > 0 ? 'bg-gradient-to-r from-accent-500 to-accent-600 shadow-glow' : ''}
                      >
                        {pct === 100
                          ? <><RotateCcw size={13} /> Review Course</>
                          : pct > 0
                            ? <><Play size={13} /> Continue</>
                            : 'Start Learning'
                        }
                      </Button>
                    </Link>
                    {pct === 100 && (
                      <Link href={`/dashboard/courses/${course.slug}/certificate`}>
                        <Button size="sm" fullWidth variant="outline" className="border-gold-300 text-gold-600 hover:bg-gold-50">
                          <Award size={13} /> View Certificate
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl bg-white/50">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <BookMarked size={28} className="text-gray-300" />
          </div>
          <p className="font-display font-bold text-gray-500 text-lg">No enrolled courses</p>
          <p className="text-sm text-gray-400 mb-6 mt-1">Browse our catalog and purchase a course to get started.</p>
          <Link href="/courses">
            <Button className="bg-gradient-to-r from-accent-500 to-accent-600 shadow-glow">
              Browse Courses
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
