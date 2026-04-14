'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, Building2 } from 'lucide-react';
import { StarRating } from '@/components/ui/StarRating';

const testimonials = [
  {
    name:    'Adaeze Okonkwo',
    role:    'Cybersecurity Analyst',
    company: 'Interswitch',
    rating:  5,
    comment: "TechCrest's Ethical Hacking course completely changed my career trajectory. Within 3 months of completing it, I landed a role at Interswitch. The hands-on labs made all the difference — it wasn't just theory, it was real work.",
    avatar:  'AO',
    gradient: 'from-accent-500 to-accent-700',
    result:  '+₦800k salary',
  },
  {
    name:    'Emeka Nwosu',
    role:    'Full-Stack Developer',
    company: 'Flutterwave',
    rating:  5,
    comment: "I tried several platforms before finding TechCrest. The difference is the quality of instruction — these instructors actually work in the industry. I went from zero to full-stack in 6 months and now build payment systems daily.",
    avatar:  'EN',
    gradient: 'from-navy-600 to-navy-800',
    result:  'Hired in 6 months',
  },
  {
    name:    'Tola Adeyemi',
    role:    'Data Scientist',
    company: 'Paystack',
    rating:  5,
    comment: "The Data Science bootcamp curriculum is incredibly practical. I'm now using Python, SQL, and ML tools daily at Paystack. This was the best career investment I've ever made — the ROI has been extraordinary.",
    avatar:  'TA',
    gradient: 'from-emerald-500 to-teal-700',
    result:  'Promoted twice',
  },
  {
    name:    'Bola Cassidy',
    role:    'Cloud Engineer',
    company: 'Microsoft Nigeria',
    rating:  5,
    comment: "The Cloud Computing course prepared me for my AWS and Azure certifications. The structured approach and detailed labs made complex concepts click. If you're serious about DevOps, TechCrest is where you need to be.",
    avatar:  'BC',
    gradient: 'from-gold-500 to-amber-700',
    result:  'AWS Certified',
  },
];

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  const t = testimonials[current];

  return (
    <section className="py-28 bg-navy-950 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-lines opacity-60 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-500/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-500/5 rounded-full blur-5xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-accent-400 font-semibold text-xs uppercase tracking-[0.15em] mb-3">
            <span className="w-5 h-px bg-accent-400" />
            Student Success Stories
            <span className="w-5 h-px bg-accent-400" />
          </span>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white mb-4 leading-tight">
            Real Results,{' '}
            <span className="text-gradient-hero">Real Careers</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Our graduates are transforming Africa's tech industry, one skill at a time.
          </p>
        </div>

        {/* Main testimonial card */}
        <div className="max-w-4xl mx-auto">
          <div className="relative glass rounded-4xl border border-white/10 p-8 sm:p-12 mb-8 overflow-hidden">
            {/* Decorative quote icon */}
            <div className="absolute top-8 right-8 opacity-10">
              <Quote size={80} className="text-accent-400" />
            </div>

            {/* Result badge */}
            <div className="absolute top-6 left-6 bg-gradient-to-r from-gold-400 to-gold-500 text-navy-900 text-xs font-extrabold px-3 py-1.5 rounded-full shadow-glow-gold">
              {t.result}
            </div>

            <div className="relative z-10 pt-8">
              <StarRating rating={t.rating} size={18} className="mb-6" />

              <blockquote className="text-white/90 text-lg sm:text-xl leading-relaxed mb-10 font-medium">
                "{t.comment}"
              </blockquote>

              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-base shrink-0 shadow-dark`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-display font-bold text-white text-base">{t.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-gray-400 text-sm">{t.role}</span>
                    <span className="text-gray-600 text-sm">·</span>
                    <span className="flex items-center gap-1 text-accent-400 text-sm font-medium">
                      <Building2 size={12} />
                      {t.company}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            {/* Dot indicators */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? 'bg-accent-500 w-8 h-2.5'
                      : 'bg-white/20 hover:bg-white/40 w-2.5 h-2.5'
                  }`}
                />
              ))}
            </div>

            {/* Nav buttons */}
            <div className="flex gap-2.5">
              <button
                onClick={prev}
                className="w-11 h-11 rounded-2xl glass border border-white/15 flex items-center justify-center text-white hover:bg-accent-500 hover:border-accent-500 hover:shadow-glow transition-all duration-300"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="w-11 h-11 rounded-2xl glass border border-white/15 flex items-center justify-center text-white hover:bg-accent-500 hover:border-accent-500 hover:shadow-glow transition-all duration-300"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
