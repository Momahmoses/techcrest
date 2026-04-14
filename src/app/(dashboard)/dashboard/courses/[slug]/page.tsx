'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Circle, ChevronRight, Menu, X, ArrowLeft, Play, Zap } from 'lucide-react';
import { getCourseBySlug, getProgress, markLessonComplete } from '@/lib/courses';
import { useAuth } from '@/hooks/useAuth';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { Course, Progress } from '@/types';

export default function CoursePlayerPage({ params }: { params: { slug: string } }) {
  const { user }  = useAuth();
  const router    = useRouter();
  const [course,      setCourse]      = useState<Course | null>(null);
  const [progress,    setProgress]    = useState<Progress | null>(null);
  const [activeKey,   setActiveKey]   = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading,     setLoading]     = useState(true);
  const [completing,  setCompleting]  = useState(false);

  const lessonKey    = (mi: number, li: number) => `${mi}-${li}`;
  const totalLessons = course?.curriculum.reduce((s, m) => s + m.lessons.length, 0) ?? 0;

  useEffect(() => {
    const load = async () => {
      try {
        const c = await getCourseBySlug(params.slug);
        if (!c) { router.push('/dashboard/courses'); return; }
        setCourse(c);
        if (user) {
          const p = await getProgress(user.id, c.id);
          setProgress(p);
        }
        if (c.curriculum.length > 0 && c.curriculum[0].lessons.length > 0) {
          setActiveKey('0-0');
        }
      } catch {
        // Firebase not configured, demo mode
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.slug, user, router]);

  const getActiveLesson = useCallback(() => {
    if (!course || !activeKey) return null;
    const [mi, li] = activeKey.split('-').map(Number);
    return course.curriculum[mi]?.lessons[li] ?? null;
  }, [course, activeKey]);

  const isCompleted = (key: string) => progress?.completedLessons?.includes(key) ?? false;

  const handleMarkComplete = async () => {
    if (!user || !course || !activeKey) return;
    setCompleting(true);
    try {
      await markLessonComplete(user.id, course.id, activeKey, totalLessons);
      const updated = await getProgress(user.id, course.id);
      setProgress(updated);
      toast.success('Lesson marked complete!');

      const [mi, li] = activeKey.split('-').map(Number);
      const nextLi = li + 1;
      if (nextLi < course.curriculum[mi].lessons.length) {
        setActiveKey(lessonKey(mi, nextLi));
      } else if (mi + 1 < course.curriculum.length) {
        setActiveKey(lessonKey(mi + 1, 0));
      }
    } catch {
      toast.error('Failed to save progress.');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center animate-pulse shadow-glow">
            <Zap size={18} className="text-white" />
          </div>
          <p className="text-gray-400 text-sm font-medium">Loading course…</p>
        </div>
      </div>
    );
  }

  const activeLesson = getActiveLesson();
  const pct = progress?.percentComplete ?? 0;

  const CurriculumContent = () => (
    <>
      {course?.curriculum.map((mod, mi) => (
        <div key={mi}>
          <p className="px-4 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">
            {mod.moduleTitle}
          </p>
          {mod.lessons.map((lesson, li) => {
            const key    = lessonKey(mi, li);
            const done   = isCompleted(key);
            const active = activeKey === key;
            return (
              <button
                key={li}
                onClick={() => { setActiveKey(key); setSidebarOpen(false); }}
                className={cn(
                  'w-full flex items-start gap-3 px-4 py-3 text-left transition-all duration-200',
                  active
                    ? 'bg-accent-500/10 border-r-2 border-accent-500'
                    : 'hover:bg-gray-50',
                )}
              >
                {done ? (
                  <CheckCircle2 size={15} className="text-emerald-500 mt-0.5 shrink-0" />
                ) : (
                  <Circle size={15} className={cn('mt-0.5 shrink-0', active ? 'text-accent-500' : 'text-gray-300')} />
                )}
                <div className="min-w-0">
                  <p className={cn(
                    'text-xs leading-snug truncate',
                    active ? 'font-bold text-accent-700' : done ? 'text-gray-400' : 'text-gray-700 font-medium',
                  )}>
                    {lesson.title}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{lesson.duration}</p>
                </div>
              </button>
            );
          })}
        </div>
      ))}
    </>
  );

  return (
    <div className="h-full flex -m-4 sm:-m-6 lg:-m-8 overflow-hidden">

      {/* Desktop sidebar */}
      <div className="hidden md:flex w-72 shrink-0 bg-white border-r border-gray-100 flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <button
            onClick={() => router.push('/dashboard/courses')}
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-accent-600 mb-4 transition-colors font-semibold group"
          >
            <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
            Back to Courses
          </button>
          <h2 className="font-display font-bold text-navy-900 text-sm line-clamp-2 leading-snug">
            {course?.title}
          </h2>
          <div className="mt-3">
            <ProgressBar value={pct} showPercent size="sm" />
          </div>
        </div>
        {/* Lesson list */}
        <div className="flex-1 overflow-y-auto py-1">
          <CurriculumContent />
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-navy-950/70 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col shadow-dark-lg">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
              <p className="font-display font-bold text-sm text-navy-900">Curriculum</p>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-1">
              <CurriculumContent />
            </div>
          </div>
        </div>
      )}

      {/* Main player */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50/60">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 sm:px-5 py-3 bg-white/90 backdrop-blur-md border-b border-gray-100/80 shrink-0 shadow-xs">
          <button
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={18} />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-navy-900 truncate">
              {activeLesson?.title ?? 'Select a lesson'}
            </p>
          </div>
          <Button
            size="sm"
            variant={isCompleted(activeKey ?? '') ? 'secondary' : 'primary'}
            loading={completing}
            onClick={handleMarkComplete}
            disabled={!activeKey || isCompleted(activeKey)}
            className={!isCompleted(activeKey ?? '') ? 'bg-gradient-to-r from-accent-500 to-accent-600 shadow-glow' : ''}
          >
            {isCompleted(activeKey ?? '') ? (
              <><CheckCircle2 size={14} /> Done</>
            ) : (
              <>Mark Complete <ChevronRight size={14} /></>
            )}
          </Button>
        </div>

        {/* Video area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Video player */}
            <div className="aspect-video bg-navy-950 rounded-3xl overflow-hidden mb-5 flex items-center justify-center relative shadow-dark-lg">
              {activeLesson?.videoURL ? (
                <video
                  src={activeLesson.videoURL}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-grid-lines opacity-20 pointer-events-none" />
                  <div className="text-center relative z-10">
                    <div className="w-20 h-20 rounded-3xl bg-white/10 border border-white/15 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                      <Play size={36} className="text-white/40 ml-1" />
                    </div>
                    <p className="font-display font-bold text-white/70 text-base">
                      {activeLesson?.title ?? 'Select a lesson from the sidebar'}
                    </p>
                    {activeLesson && (
                      <p className="text-xs text-white/30 mt-2">Video URL not configured yet</p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Lesson info */}
            {activeLesson && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
                <h2 className="font-display font-bold text-xl text-navy-900 mb-2">{activeLesson.title}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Play size={13} className="text-gray-400" />
                    {activeLesson.duration}
                  </span>
                  {isCompleted(activeKey ?? '') && (
                    <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                      <CheckCircle2 size={14} /> Completed
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
