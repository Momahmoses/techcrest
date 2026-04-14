import { Users, BookOpen, Award, TrendingUp } from 'lucide-react';

const stats = [
  { icon: Users,      value: '500+',  label: 'Students Trained',   color: 'from-accent-500 to-accent-600',    glow: 'shadow-glow' },
  { icon: BookOpen,   value: '30+',   label: 'Expert Courses',     color: 'from-blue-500 to-indigo-600',      glow: '' },
  { icon: Award,      value: '15',    label: 'Expert Instructors', color: 'from-gold-400 to-gold-500',        glow: 'shadow-glow-gold' },
  { icon: TrendingUp, value: '95%',   label: 'Satisfaction Rate',  color: 'from-emerald-500 to-teal-500',     glow: '' },
];

export function StatsBar() {
  return (
    <section className="relative bg-white border-b border-gray-100 py-0 overflow-hidden">
      {/* Subtle top gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-4 py-8 px-6 sm:px-8 group"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} ${s.glow} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                  <Icon size={21} className="text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-display font-extrabold text-3xl text-navy-900 leading-none tracking-tight">
                    {s.value}
                  </p>
                  <p className="text-gray-500 text-sm mt-1 font-medium">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
