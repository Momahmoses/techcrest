import { Shield, Zap, Users, Award, BookOpen, Headphones } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Industry-Verified Curriculum',
    description: 'Every course is designed with direct input from hiring companies. Learn exactly what employers want — no fluff, no filler.',
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50 group-hover:bg-blue-100',
    iconColor: 'text-blue-600',
    accentColor: 'border-blue-100 group-hover:border-blue-200',
  },
  {
    icon: Zap,
    title: 'Learn at Your Pace',
    description: 'Lifetime access to all purchased courses. Watch on any device, pause and resume anytime. Your schedule, your rules.',
    gradient: 'from-accent-400 to-accent-600',
    bg: 'bg-accent-50 group-hover:bg-accent-100',
    iconColor: 'text-accent-600',
    accentColor: 'border-accent-100 group-hover:border-accent-200',
  },
  {
    icon: Users,
    title: 'Expert Instructors',
    description: 'Learn from practitioners actively working in their fields — not career lecturers. Real experience, real insights.',
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50 group-hover:bg-emerald-100',
    iconColor: 'text-emerald-600',
    accentColor: 'border-emerald-100 group-hover:border-emerald-200',
  },
  {
    icon: Award,
    title: 'Recognized Certificates',
    description: 'Earn certificates upon completion that are recognized by leading tech companies across Nigeria and globally.',
    gradient: 'from-gold-400 to-gold-600',
    bg: 'bg-amber-50 group-hover:bg-amber-100',
    iconColor: 'text-amber-600',
    accentColor: 'border-amber-100 group-hover:border-amber-200',
  },
  {
    icon: BookOpen,
    title: 'Hands-On Projects',
    description: 'Build a real portfolio with projects in every course. Apply what you learn immediately and showcase your skills.',
    gradient: 'from-purple-500 to-violet-600',
    bg: 'bg-purple-50 group-hover:bg-purple-100',
    iconColor: 'text-purple-600',
    accentColor: 'border-purple-100 group-hover:border-purple-200',
  },
  {
    icon: Headphones,
    title: '24/7 Learner Support',
    description: 'Stuck on a concept? Our support team and community are always available to help you keep moving forward.',
    gradient: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50 group-hover:bg-rose-100',
    iconColor: 'text-rose-600',
    accentColor: 'border-rose-100 group-hover:border-rose-200',
  },
];

export function WhyTechCrest() {
  return (
    <section className="py-28 bg-white relative overflow-hidden">
      {/* Subtle background dot grid */}
      <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="section-label">
            <span className="w-5 h-px bg-accent-500" />
            Why TechCrest
            <span className="w-5 h-px bg-accent-500" />
          </span>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-navy-900 mb-5 leading-tight">
            Education Built for
            <br />
            <span className="text-gradient">the Real World</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            We bridge the gap between academic theory and industry demands — giving you the exact skills companies are hiring for right now.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className={`group relative p-7 rounded-3xl border bg-white ${f.accentColor} hover:shadow-card-hover transition-all duration-400 cursor-default`}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {/* Gradient top bar */}
                <div className={`absolute top-0 left-8 right-8 h-0.5 bg-gradient-to-r ${f.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className={`w-13 h-13 rounded-2xl ${f.bg} flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xs`}>
                  <Icon size={24} className={f.iconColor} />
                </div>
                <h3 className="font-display font-bold text-navy-900 text-lg mb-2.5 leading-snug">
                  {f.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
