'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookMarked, Award, Clock, ArrowRight, TrendingUp, Sparkles, Play } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getCourseById, getUserProgressAll } from '@/lib/courses';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import type { Course, Progress } from '@/types';

export default function DashboardPage() {
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
      } catch {
        // Firebase not configured
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const completedCount    = progress.filter(p => p.percentComplete === 100).length;
  const inProgressCourse  = courses.find(c => {
    const p = progress.find(pr => pr.courseId === c.id);
    return p && p.percentComplete > 0 && p.percentComplete < 100;
  });
  const inProgressData    = inProgressCourse
    ? progress.find(p => p.courseId === inProgressCourse.id)
    : null;

  const stats = [
    { icon: BookMarked, label: 'Enrolled',    value: user?.enrolledCourses?.length ?? 0, gradient: 'from-accent-500 to-accent-600',   bg: 'bg-accent-50',  text: 'text-accent-600' },
    { icon: TrendingUp, label: 'In Progress', value: (user?.enrolledCourses?.length ?? 0) - completedCount, gradient: 'from-amber-400 to-orange-500', bg: 'bg-amber-50',  text: 'text-amber-600'  },
    { icon: Award,      label: 'Completed',   value: completedCount, gradient: 'from-emerald-400 to-teal-500',  bg: 'bg-emerald-50', text: 'text-emerald-600' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* Welcome banner */}
      <div className="relative bg-gradient-to-r from-navy-900 to-navy-800 rounded-3xl p-7 overflow-hidden">
        <div className="absolute inset-0 bg-grid-lines opacity-30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/10 rounded-full blur-4xl pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1 mb-4">
            <Sparkles size={12} className="text-gold-400" />
            <span className="text-white/70 text-xs font-medium">
              {new Date().toLocaleDateString('en-NG', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <h1 className="font-display font-extrabold text-3xl text-white mb-1">
            Welcome back, <span className="text-accent-400">{user?.name?.split(' ')[0]}</span>!
          </h1>
          <p className="text-gray-400 text-sm">Keep the momentum going — great things take consistent effort.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 shadow-sm`}>
                <Icon size={18} className="text-white" />
              </div>
              <p className="font-display font-extrabold text-3xl text-navy-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Continue learning */}
      {inProgressCourse && inProgressData && (
        <div className="relative bg-white rounded-3xl border border-gray-100 shadow-card p-6 overflow-hidden">
          {/* Decorative gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-400 via-accent-500 to-accent-600 rounded-t-3xl" />
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <p className="text-xs font-bold text-accent-600 uppercase tracking-[0.12em] mb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" />
                Continue Learning
              </p>
              <h2 className="font-display font-bold text-xl text-navy-900 leading-snug">{inProgressCourse.title}</h2>
              <p className="text-sm text-gray-500 mt-1">By {inProgressCourse.instructor}</p>
            </div>
            <Link href={`/dashboard/courses/${inProgressCourse.slug}`}>
              <Button size="sm" className="shrink-0 bg-gradient-to-r from-accent-500 to-accent-600 shadow-glow">
                <Play size={13} />
                Resume
              </Button>
            </Link>
          </div>
          <ProgressBar value={inProgressData.percentComplete} showPercent label="Progress" size="lg" />
          {inProgressData.lastAccessed && (
            <p className="text-xs text-gray-400 mt-2.5 flex items-center gap-1.5">
              <Clock size={11} />
              Last accessed: {formatDate(inProgressData.lastAccessed)}
            </p>
          )}
        </div>
      )}

      {/* Enrolled courses */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-xl text-navy-900">My Courses</h2>
          <Link
            href="/dashboard/courses"
            className="flex items-center gap-1 text-accent-600 text-sm font-semibold hover:text-accent-500 transition-colors group"
          >
            View all
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {[1,2].map(i => (
              <div key={i} className="h-32 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {courses.slice(0, 4).map(course => {
              const prog = progress.find(p => p.courseId === course.id);
              const pct  = prog?.percentComplete ?? 0;
              return (
                <Link key={course.id} href={`/dashboard/courses/${course.slug}`}>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                    <p className="text-xs text-accent-600 font-bold uppercase tracking-wide mb-1.5">{course.category}</p>
                    <h3 className="font-display font-semibold text-navy-900 text-sm leading-snug mb-4 line-clamp-2 group-hover:text-accent-600 transition-colors">
                      {course.title}
                    </h3>
                    <ProgressBar value={pct} showPercent size="sm" />
                    {pct === 100 && (
                      <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
                        <Award size={11} /> Completed — Certificate available
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <BookMarked size={28} className="text-gray-300" />
            </div>
            <p className="font-display font-bold text-gray-500 text-lg">No courses yet</p>
            <p className="text-sm text-gray-400 mb-6 mt-1">Explore our catalog and start learning today.</p>
            <Link href="/courses">
              <Button variant="outline">Browse Courses</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
