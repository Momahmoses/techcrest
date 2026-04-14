'use client';

import { useState } from 'react';
import {
  Clock, Users, BarChart2, CheckCircle2, ChevronDown, ChevronUp,
  PlayCircle, ShoppingCart, Lock, Star,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/ui/StarRating';
import { formatCurrency, calcDiscountPercent } from '@/lib/utils';
import { LEVEL_COLORS, CATEGORY_ICONS } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { initFlutterwavePayment, generateFlutterwaveRef } from '@/lib/flutterwave';
import { initPaystackPayment, generatePaystackRef } from '@/lib/paystack';
import { addReview } from '@/lib/courses';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import type { Course, Review } from '@/types';

type PaymentProvider = 'flutterwave' | 'paystack';

interface Props {
  course: Course | null;
  reviews: Review[];
}

const DEMO_COURSE: Course = {
  id: 'demo',
  title: 'Complete Ethical Hacking & Cybersecurity Bootcamp',
  slug: 'ethical-hacking-bootcamp',
  description: 'Master the art of ethical hacking and penetration testing. Learn to think like an attacker to build better defenses. This comprehensive bootcamp covers everything from network security to web application testing.',
  category: 'Cybersecurity',
  level: 'Intermediate',
  price: 45000,
  originalPrice: 75000,
  duration: '32 hours',
  lessons: 84,
  students: 1243,
  rating: 4.8,
  instructor: 'Dr. Chukwuemeka Obi',
  instructorBio: 'Dr. Obi is a certified ethical hacker (CEH) with 12+ years of experience in cybersecurity. Former security consultant for CBN and leading Nigerian banks.',
  thumbnail: '',
  whatYoullLearn: [
    'Penetration testing methodologies and best practices',
    'Network scanning, enumeration, and exploitation',
    'Web application vulnerabilities (OWASP Top 10)',
    'Password cracking and privilege escalation',
    'Writing professional security assessment reports',
    'Setting up and using Kali Linux effectively',
  ],
  curriculum: [
    {
      moduleTitle: 'Introduction to Ethical Hacking',
      lessons: [
        { title: 'What is Ethical Hacking?', videoURL: '', duration: '12 min' },
        { title: 'Setting Up Your Lab Environment', videoURL: '', duration: '25 min' },
        { title: 'Understanding Attack Methodologies', videoURL: '', duration: '18 min' },
      ],
    },
    {
      moduleTitle: 'Network Penetration Testing',
      lessons: [
        { title: 'Network Scanning with Nmap', videoURL: '', duration: '30 min' },
        { title: 'Vulnerability Assessment', videoURL: '', duration: '35 min' },
        { title: 'Exploitation with Metasploit', videoURL: '', duration: '45 min' },
      ],
    },
    {
      moduleTitle: 'Web Application Security',
      lessons: [
        { title: 'OWASP Top 10 Vulnerabilities', videoURL: '', duration: '28 min' },
        { title: 'SQL Injection Attacks & Defense', videoURL: '', duration: '40 min' },
        { title: 'XSS and CSRF Attacks', videoURL: '', duration: '32 min' },
      ],
    },
  ],
  published: true,
  createdAt: new Date().toISOString(),
};

export function CourseDetailClient({ course: serverCourse, reviews: initialReviews }: Props) {
  const course = serverCourse ?? DEMO_COURSE;

  const [openModule,       setOpenModule]       = useState<number | null>(0);
  const [purchasing,       setPurchasing]       = useState(false);
  const [paymentProvider,  setPaymentProvider]  = useState<PaymentProvider>('flutterwave');
  const [reviews,          setReviews]          = useState<Review[]>(initialReviews);
  const [showReviewForm,   setShowReviewForm]   = useState(false);
  const [reviewRating,     setReviewRating]     = useState(5);
  const [reviewComment,    setReviewComment]    = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { user } = useAuth();
  const router   = useRouter();

  const alreadyEnrolled = user?.enrolledCourses?.includes(course.id);
  const hasReviewed     = reviews.some(r => r.studentId === user?.id);
  const discount        = course.originalPrice ? calcDiscountPercent(course.originalPrice, course.price) : null;
  const totalLessons    = course.curriculum.reduce((s, m) => s + m.lessons.length, 0);

  const hasFlutterwave = !!process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY;
  const hasPaystack    = !!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  const bothAvailable  = hasFlutterwave && hasPaystack;

  // ── Payment handlers ──────────────────────────────────────────────────────

  const handleBuyNow = () => {
    if (!user) {
      toast.error('Please sign in to purchase this course.');
      router.push('/auth/login');
      return;
    }
    if (!hasFlutterwave && !hasPaystack) {
      toast.error('Payment system not configured yet.');
      return;
    }
    if (paymentProvider === 'paystack' && hasPaystack) {
      handleBuyWithPaystack();
    } else {
      handleBuyWithFlutterwave();
    }
  };

  const handleBuyWithFlutterwave = () => {
    setPurchasing(true);
    const txRef = generateFlutterwaveRef();
    initFlutterwavePayment({
      email:     user!.email,
      name:      user!.name,
      amount:    course.price,
      txRef,
      publicKey: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY!,
      meta: { courseId: course.id, courseTitle: course.title, studentId: user!.id },
      onSuccess: async (transactionId) => {
        setPurchasing(false);
        try {
          const res = await fetch('/api/flutterwave/verify', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ transactionId, courseId: course.id }),
          });
          const data = await res.json();
          if (data.success) {
            toast.success('Enrollment confirmed! Welcome to the course.');
            router.push('/dashboard/courses');
          } else {
            toast.error('Payment verification failed. Contact support.');
          }
        } catch {
          toast.error('Verification error. Please contact support.');
        }
      },
      onClose: () => {
        setPurchasing(false);
        toast('Payment cancelled.', { icon: 'ℹ️' });
      },
    });
  };

  const handleBuyWithPaystack = () => {
    if (!window.PaystackPop) {
      toast.error('Payment is still loading. Please try again.');
      return;
    }
    setPurchasing(true);
    const reference = generatePaystackRef();
    initPaystackPayment({
      email:     user!.email,
      amount:    course.price,
      reference,
      publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
      metadata:  { courseId: course.id, courseTitle: course.title, studentId: user!.id },
      onSuccess: async (ref) => {
        setPurchasing(false);
        try {
          const res = await fetch('/api/paystack/verify', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ reference: ref, courseId: course.id }),
          });
          const data = await res.json();
          if (data.success) {
            toast.success('Enrollment confirmed! Welcome to the course.');
            router.push('/dashboard/courses');
          } else {
            toast.error('Payment verification failed. Contact support.');
          }
        } catch {
          toast.error('Verification error. Please contact support.');
        }
      },
      onClose: () => {
        setPurchasing(false);
        toast('Payment cancelled.', { icon: 'ℹ️' });
      },
    });
  };

  // ── Review handler ────────────────────────────────────────────────────────

  const handleSubmitReview = async () => {
    if (!user || !reviewComment.trim()) {
      toast.error('Please write a comment before submitting.');
      return;
    }
    setSubmittingReview(true);
    try {
      await addReview({
        courseId:     course.id,
        studentId:    user.id,
        studentName:  user.name,
        studentPhoto: user.photoURL,
        rating:       reviewRating,
        comment:      reviewComment.trim(),
        createdAt:    new Date().toISOString(),
      });
      setReviews(prev => [{
        id:           Date.now().toString(),
        courseId:     course.id,
        studentId:    user.id,
        studentName:  user.name,
        studentPhoto: user.photoURL,
        rating:       reviewRating,
        comment:      reviewComment.trim(),
        createdAt:    new Date().toISOString(),
      }, ...prev]);
      toast.success('Review submitted!');
      setShowReviewForm(false);
      setReviewComment('');
      setReviewRating(5);
    } catch {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero */}
      <div className="relative bg-navy-950 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-lines opacity-40 pointer-events-none" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 30% 80%, rgba(0,180,216,0.1), transparent)' }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-500/40 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <Badge className={LEVEL_COLORS[course.level]}>{course.level}</Badge>
                <span className="text-accent-400 text-sm font-bold uppercase tracking-wide">{course.category}</span>
              </div>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-4 leading-tight">
                {course.title}
              </h1>
              <p className="text-gray-400 text-base mb-7 leading-relaxed max-w-2xl">{course.description}</p>

              <div className="flex flex-wrap items-center gap-5 mb-6">
                <div className="flex items-center gap-2">
                  <StarRating rating={course.rating} size={16} showValue />
                  <span className="text-gray-500 text-sm">({reviews.length} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                  <Users size={14} />{course.students.toLocaleString()} students
                </div>
                <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                  <Clock size={14} />{course.duration}
                </div>
                <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                  <BarChart2 size={14} />{totalLessons} lessons
                </div>
              </div>

              <p className="text-gray-500 text-sm">
                Instructor:{' '}
                <span className="text-accent-400 font-bold">{course.instructor}</span>
              </p>
            </div>

            {/* Purchase card — desktop */}
            <div className="hidden lg:block">
              <PurchaseCard
                course={course}
                discount={discount}
                alreadyEnrolled={!!alreadyEnrolled}
                purchasing={purchasing}
                paymentProvider={paymentProvider}
                setPaymentProvider={setPaymentProvider}
                bothAvailable={bothAvailable}
                onBuyNow={handleBuyNow}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">

              {/* What you'll learn */}
              {(course.whatYoullLearn ?? []).length > 0 && (
                <section>
                  <h2 className="font-display font-bold text-2xl text-navy-900 mb-5">What You'll Learn</h2>
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-6 grid sm:grid-cols-2 gap-3">
                    {course.whatYoullLearn!.map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <CheckCircle2 size={17} className="text-accent-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Curriculum */}
              <section>
                <h2 className="font-display font-bold text-2xl text-navy-900 mb-1.5">Course Curriculum</h2>
                <p className="text-gray-500 text-sm mb-5">
                  {course.curriculum.length} modules · {totalLessons} lessons · {course.duration} total
                </p>
                <div className="space-y-3">
                  {course.curriculum.map((mod, mi) => (
                    <div key={mi} className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
                      <button
                        onClick={() => setOpenModule(openModule === mi ? null : mi)}
                        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div>
                          <p className="font-bold text-navy-900 text-sm">{mod.moduleTitle}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{mod.lessons.length} lessons</p>
                        </div>
                        {openModule === mi
                          ? <ChevronUp size={17} className="text-gray-400 shrink-0" />
                          : <ChevronDown size={17} className="text-gray-400 shrink-0" />
                        }
                      </button>
                      {openModule === mi && (
                        <div className="divide-y divide-gray-50 border-t border-gray-100">
                          {mod.lessons.map((lesson, li) => (
                            <div key={li} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 transition-colors">
                              {alreadyEnrolled ? (
                                <div className="w-6 h-6 rounded-lg bg-accent-50 flex items-center justify-center shrink-0">
                                  <PlayCircle size={13} className="text-accent-500" />
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                  <Lock size={11} className="text-gray-400" />
                                </div>
                              )}
                              <span className="text-sm text-gray-700 flex-1">{lesson.title}</span>
                              <span className="text-xs text-gray-400 shrink-0">{lesson.duration}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Instructor */}
              <section>
                <h2 className="font-display font-bold text-2xl text-navy-900 mb-5">Your Instructor</h2>
                <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-6 flex items-start gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center text-white font-bold text-2xl font-display shrink-0 shadow-dark">
                    {course.instructor.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-navy-900">{course.instructor}</h3>
                    <p className="text-accent-600 text-xs font-bold uppercase tracking-wide mb-3 mt-0.5">{course.category} Expert</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{course.instructorBio}</p>
                  </div>
                </div>
              </section>

              {/* Reviews */}
              <section>
                <div className="flex items-center justify-between mb-5 gap-4">
                  <h2 className="font-display font-bold text-2xl text-navy-900">
                    Student Reviews
                    <span className="text-gray-400 font-normal ml-2 text-xl">({reviews.length})</span>
                  </h2>
                  {alreadyEnrolled && !hasReviewed && !showReviewForm && (
                    <Button variant="outline" size="sm" onClick={() => setShowReviewForm(true)}>
                      Write a Review
                    </Button>
                  )}
                </div>

                {/* Review form */}
                {showReviewForm && (
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-6 mb-6">
                    <h3 className="font-display font-bold text-lg text-navy-900 mb-4">Your Review</h3>
                    <div className="flex items-center gap-1.5 mb-4">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setReviewRating(n)}
                          className="transition-transform hover:scale-110 active:scale-95"
                        >
                          <Star
                            size={30}
                            className={n <= reviewRating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-300'}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-sm font-bold text-gray-700">{reviewRating} / 5</span>
                    </div>
                    <textarea
                      rows={4}
                      placeholder="Share what you found valuable about this course…"
                      value={reviewComment}
                      onChange={e => setReviewComment(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-body text-navy-900 placeholder:text-gray-400 outline-none focus:border-accent-500 focus:ring-3 focus:ring-accent-500/15 resize-none mb-4 hover:border-gray-300 transition-colors"
                    />
                    <div className="flex gap-3">
                      <Button onClick={handleSubmitReview} loading={submittingReview} disabled={!reviewComment.trim()}>
                        Submit Review
                      </Button>
                      <Button variant="ghost" onClick={() => { setShowReviewForm(false); setReviewComment(''); setReviewRating(5); }}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {reviews.length > 0 ? (
                  <>
                    <div className="flex items-center gap-6 mb-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-card">
                      <div className="text-center">
                        <p className="font-display font-extrabold text-6xl text-navy-900">{course.rating.toFixed(1)}</p>
                        <StarRating rating={course.rating} size={20} className="mt-2 justify-center" />
                        <p className="text-gray-500 text-xs mt-1 font-medium uppercase tracking-wide">Course Rating</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {reviews.map((r) => (
                        <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                              {r.studentName?.[0]?.toUpperCase() ?? 'S'}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                                <p className="font-bold text-navy-900 text-sm">{r.studentName}</p>
                                <StarRating rating={r.rating} size={13} />
                              </div>
                              <p className="text-gray-600 text-sm leading-relaxed">{r.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 shadow-card">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <Star size={22} className="text-gray-300" />
                    </div>
                    <p className="font-bold text-gray-500">No reviews yet.</p>
                    {alreadyEnrolled && !hasReviewed && (
                      <p className="text-sm text-gray-400 mt-1">Be the first to leave a review!</p>
                    )}
                  </div>
                )}
              </section>
            </div>

            {/* Sidebar — hidden on desktop (shown in hero), shown on mobile */}
            <div className="lg:hidden">
              <PurchaseCard
                course={course}
                discount={discount}
                alreadyEnrolled={!!alreadyEnrolled}
                purchasing={purchasing}
                paymentProvider={paymentProvider}
                setPaymentProvider={setPaymentProvider}
                bothAvailable={bothAvailable}
                onBuyNow={handleBuyNow}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky mobile CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200/80 px-4 py-3 z-30 shadow-dark">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-display font-extrabold text-xl text-navy-900">{formatCurrency(course.price)}</p>
            {course.originalPrice && (
              <p className="text-xs text-gray-400 line-through">{formatCurrency(course.originalPrice)}</p>
            )}
          </div>
          {alreadyEnrolled ? (
            <Button onClick={() => router.push('/dashboard/courses')} className="flex-1 bg-gradient-to-r from-accent-500 to-accent-600 shadow-glow">
              Go to Course
            </Button>
          ) : (
            <Button onClick={handleBuyNow} loading={purchasing} className="flex-1 bg-gradient-to-r from-accent-500 to-accent-600 shadow-glow">
              <ShoppingCart size={16} /> Buy Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function PurchaseCard({
  course,
  discount,
  alreadyEnrolled,
  purchasing,
  paymentProvider,
  setPaymentProvider,
  bothAvailable,
  onBuyNow,
}: {
  course: Course;
  discount: number | null;
  alreadyEnrolled: boolean;
  purchasing: boolean;
  paymentProvider: PaymentProvider;
  setPaymentProvider: (p: PaymentProvider) => void;
  bothAvailable: boolean;
  onBuyNow: () => void;
}) {
  const router = useRouter();
  return (
    <div className="bg-white rounded-3xl shadow-card-hover border border-gray-100 overflow-hidden sticky top-24">
      {/* Thumbnail */}
      <div className="h-48 bg-gradient-to-br from-navy-800 to-navy-950 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-700/80 to-navy-950" />
        <span className="relative z-10 text-7xl select-none drop-shadow-lg">
          {CATEGORY_ICONS[course.category] ?? '📚'}
        </span>
        {discount && (
          <span className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
            -{discount}% OFF
          </span>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="font-display font-extrabold text-3xl text-navy-900">{formatCurrency(course.price)}</span>
          {course.originalPrice && (
            <span className="text-gray-400 text-base line-through">{formatCurrency(course.originalPrice)}</span>
          )}
        </div>

        {/* Payment provider selector */}
        {!alreadyEnrolled && bothAvailable && (
          <div className="flex rounded-xl border border-gray-200 overflow-hidden mb-4 text-sm font-semibold">
            <button
              onClick={() => setPaymentProvider('flutterwave')}
              className={`flex-1 py-2.5 transition-colors ${
                paymentProvider === 'flutterwave'
                  ? 'bg-navy-900 text-white'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              Flutterwave
            </button>
            <button
              onClick={() => setPaymentProvider('paystack')}
              className={`flex-1 py-2.5 transition-colors ${
                paymentProvider === 'paystack'
                  ? 'bg-navy-900 text-white'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              Paystack
            </button>
          </div>
        )}

        {alreadyEnrolled ? (
          <Button
            fullWidth
            size="lg"
            onClick={() => router.push('/dashboard/courses')}
            className="bg-gradient-to-r from-accent-500 to-accent-600 shadow-glow btn-shine"
          >
            <PlayCircle size={18} /> Go to Course
          </Button>
        ) : (
          <Button
            fullWidth
            size="lg"
            loading={purchasing}
            onClick={onBuyNow}
            className="bg-gradient-to-r from-accent-500 to-accent-600 shadow-glow btn-shine"
          >
            <ShoppingCart size={18} /> Enroll Now
          </Button>
        )}

        <p className="text-center text-xs text-gray-400 mt-3">30-day money-back guarantee</p>

        <div className="mt-5 pt-5 border-t border-gray-50 space-y-3">
          {[
            { label: 'Duration',    val: course.duration },
            { label: 'Lessons',     val: `${course.lessons} lessons` },
            { label: 'Level',       val: course.level },
            { label: 'Students',    val: course.students.toLocaleString() },
            { label: 'Access',      val: 'Lifetime access' },
            { label: 'Certificate', val: 'On completion' },
          ].map(row => (
            <div key={row.label} className="flex justify-between text-sm">
              <span className="text-gray-400">{row.label}</span>
              <span className="font-semibold text-navy-900">{row.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
