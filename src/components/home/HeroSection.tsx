import Link from 'next/link';
import { ArrowRight, Star, Users, BookOpen, Shield, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden bg-navy-950">
      {/* Background layers */}
      <div className="absolute inset-0 bg-hero-mesh" />
      <div className="absolute inset-0 bg-grid-lines" />

      {/* Gradient orbs */}
      <div className="absolute top-[-10%] right-[5%] w-[700px] h-[700px] bg-accent-500/10 rounded-full blur-5xl pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] bg-accent-600/8 rounded-full blur-5xl pointer-events-none" />
      <div className="absolute top-[40%] right-[30%] w-[300px] h-[300px] bg-navy-700/40 rounded-full blur-4xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-36">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left column ── */}
          <div>
            {/* Award badge */}
            <div className="inline-flex items-center gap-2.5 glass rounded-full px-5 py-2 mb-8 animate-fade-in">
              <div className="flex -space-x-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={11} className="fill-gold-400 text-gold-400" />
                ))}
              </div>
              <span className="text-white/85 text-sm font-medium">Rated #1 Tech Institute in Lagos</span>
            </div>

            <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-[4.25rem] text-white leading-[1.03] tracking-tight mb-7 animate-fade-up">
              Master the{' '}
              <span className="relative inline-block">
                <span className="text-gradient-hero">Future.</span>
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 6 Q100 0 200 6" stroke="url(#ul)" strokeWidth="2.5" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="ul" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#5ee5ff" stopOpacity="0.6"/>
                      <stop offset="1" stopColor="#00b4d8" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              <br />
              One Course<br />at a Time.
            </h1>

            <p className="text-gray-300/90 text-lg sm:text-xl leading-relaxed mb-10 max-w-[520px] animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Learn from Nigeria's leading industry experts with hands-on projects. Build real, in-demand skills in cybersecurity, web development, data science, and more.
            </p>

            <div className="flex flex-col sm:flex-row gap-3.5 mb-14 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <Link href="/courses">
                <Button size="xl" className="shadow-glow group w-full sm:w-auto">
                  Explore Courses
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  variant="outline"
                  size="xl"
                  className="border-white/20 text-white hover:bg-white hover:text-navy-900 hover:border-white w-full sm:w-auto"
                >
                  Start Free Today
                </Button>
              </Link>
            </div>

            {/* Social proof row */}
            <div className="flex items-center gap-6 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex -space-x-2.5">
                {[
                  { init: 'AK', bg: 'from-accent-500 to-accent-600' },
                  { init: 'EM', bg: 'from-navy-600 to-navy-700' },
                  { init: 'TO', bg: 'from-gold-500 to-gold-600' },
                  { init: 'BC', bg: 'from-emerald-500 to-teal-600' },
                  { init: '+', bg: 'from-gray-600 to-gray-700' },
                ].map(({ init, bg }, i) => (
                  <div
                    key={i}
                    className={`w-9 h-9 rounded-full bg-gradient-to-br ${bg} border-2 border-navy-950 flex items-center justify-center text-white text-[10px] font-bold`}
                  >
                    {init}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={13} className="fill-gold-400 text-gold-400" />
                  ))}
                  <span className="text-gold-400 text-xs font-bold ml-1">4.9</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Trusted by <span className="text-white font-bold">500+</span> students
                </p>
              </div>
            </div>
          </div>

          {/* ── Right column — visual ── */}
          <div className="hidden lg:block relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="relative w-full aspect-square max-w-[520px] ml-auto">

              {/* Main glass card */}
              <div className="absolute inset-0 rounded-4xl glass border border-white/10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-500/10 to-transparent" />
                <div className="relative z-10 h-full flex flex-col items-center justify-center p-10 text-center">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center mb-6 shadow-glow-lg animate-float">
                    <BookOpen size={42} className="text-white" />
                  </div>
                  <h3 className="font-display font-extrabold text-white text-2xl mb-1">30+ Courses</h3>
                  <p className="text-gray-400 text-sm mb-8">Across 8 tech disciplines</p>

                  <div className="grid grid-cols-2 gap-3 w-full">
                    {[
                      { icon: Shield,    label: 'Cybersecurity' },
                      { icon: Zap,       label: 'Web Dev' },
                      { icon: TrendingUp,label: 'Data Science' },
                      { icon: BookOpen,  label: 'Cloud & DevOps' },
                    ].map(({ icon: Icon, label }) => (
                      <div key={label} className="glass rounded-2xl px-3 py-3 flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-accent-500/20 flex items-center justify-center shrink-0">
                          <Icon size={14} className="text-accent-400" />
                        </div>
                        <span className="text-white text-xs font-semibold">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating card — top left */}
              <div className="absolute -top-6 -left-8 glass-light rounded-2xl shadow-card-hover px-4 py-3.5 flex items-center gap-3 animate-float" style={{ animationDelay: '1s' }}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0">
                  <Users size={17} className="text-white" />
                </div>
                <div>
                  <p className="font-display font-extrabold text-navy-900 text-sm leading-none">500+</p>
                  <p className="text-gray-500 text-xs mt-0.5">Active students</p>
                </div>
              </div>

              {/* Floating card — bottom right */}
              <div className="absolute -bottom-6 -right-6 glass-light rounded-2xl shadow-card-hover px-4 py-3.5 flex items-center gap-3 animate-float" style={{ animationDelay: '2s' }}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center shrink-0">
                  <Star size={17} className="text-white fill-white" />
                </div>
                <div>
                  <p className="font-display font-extrabold text-navy-900 text-sm leading-none">4.9 / 5.0</p>
                  <p className="text-gray-500 text-xs mt-0.5">Average rating</p>
                </div>
              </div>

              {/* Floating pill — middle right */}
              <div className="absolute top-1/2 -right-10 -translate-y-1/2 glass-light rounded-xl shadow-card px-3.5 py-2.5 flex items-center gap-2 animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-navy-900 text-xs font-bold">Live Classes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}
