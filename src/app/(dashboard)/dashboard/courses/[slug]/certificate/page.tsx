'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCourseBySlug, getProgress } from '@/lib/courses';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Award, Download, ArrowLeft } from 'lucide-react';
import type { Course, Progress } from '@/types';

export default function CertificatePage({ params }: { params: { slug: string } }) {
  const { user }  = useAuth();
  const router    = useRouter();
  const [course,   setCourse]   = useState<Course | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading,  setLoading]  = useState(true);

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
      } catch {} finally { setLoading(false); }
    };
    load();
  }, [params.slug, user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-gray-400">Loading certificate…</div>
      </div>
    );
  }

  if (!course || !progress || progress.percentComplete < 100) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <Award size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="font-display font-bold text-2xl text-navy-900 mb-2">
          Certificate Not Available
        </h2>
        <p className="text-gray-500 mb-6">
          Complete 100% of the course to earn your certificate.
          {progress && (
            <span className="block mt-1 text-sm font-semibold text-accent-600">
              You're at {progress.percentComplete}% — keep going!
            </span>
          )}
        </p>
        <Link href={`/dashboard/courses/${params.slug}`}>
          <Button>Back to Course</Button>
        </Link>
      </div>
    );
  }

  const completionDate = progress.lastAccessed
    ? new Date(progress.lastAccessed).toLocaleDateString('en-NG', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : new Date().toLocaleDateString('en-NG', {
        year: 'numeric', month: 'long', day: 'numeric',
      });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link
          href={`/dashboard/courses/${params.slug}`}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-accent-600 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Course
        </Link>
        <Button onClick={() => window.print()} size="sm">
          <Download size={15} /> Download / Print
        </Button>
      </div>

      {/* Certificate card */}
      <div
        id="certificate"
        className="bg-white border-8 border-double border-navy-900 rounded-2xl p-10 sm:p-14 text-center relative overflow-hidden print:shadow-none"
      >
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute top-0 left-0 w-60 h-60 bg-accent-500 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-navy-900 rounded-full translate-x-1/2 translate-y-1/2" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-[40px] border-accent-500/10 rounded-full" />
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-accent-500 flex items-center justify-center shadow-md">
              <Award size={24} className="text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-navy-900 tracking-tight">
              TechCrest
            </span>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.35em] text-gray-400 mb-6">
            Certificate of Completion
          </p>

          <p className="text-gray-500 text-base mb-2">This is to certify that</p>

          <h1 className="font-display font-bold text-4xl sm:text-5xl text-navy-900 mb-1 pb-2 border-b-2 border-accent-500 inline-block">
            {user?.name}
          </h1>

          <p className="text-gray-500 text-base mt-5 mb-2">has successfully completed</p>

          <h2 className="font-display font-bold text-2xl sm:text-3xl text-navy-900 mb-8 max-w-xl mx-auto leading-snug">
            {course.title}
          </h2>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-6 sm:gap-12 text-sm mb-10">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Duration</p>
              <p className="font-semibold text-navy-900">{course.duration}</p>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Instructor</p>
              <p className="font-semibold text-navy-900">{course.instructor}</p>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Completed</p>
              <p className="font-semibold text-navy-900">{completionDate}</p>
            </div>
          </div>

          {/* Seal */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-full border-4 border-navy-900 flex flex-col items-center justify-center">
              <Award size={28} className="text-navy-900" />
              <p className="text-[8px] font-bold uppercase tracking-widest text-navy-900 mt-0.5">Verified</p>
            </div>
          </div>

          <div className="w-40 h-px bg-navy-900 mx-auto mb-2" />
          <p className="text-xs text-gray-400">TechCrest Institute · hello@techcrest.ng</p>
        </div>
      </div>

      <style>{`
        @media print {
          body > * { display: none; }
          #certificate { display: block !important; border: 8px double #0a1628 !important; }
        }
      `}</style>
    </div>
  );
}
