import type { Metadata } from 'next';
import { Target, Eye, Heart, Award, ArrowRight } from 'lucide-react';

export const metadata: Metadata = { title: 'About TechCrest' };

const team = [
  { name: 'Dr. Akin Adewale',    role: 'Founder & CEO',                  bio: 'Former Google engineer with 15 years in tech. Passionate about making world-class tech education accessible across Africa.',                      color: 'from-navy-700 to-navy-900',       initials: 'AA' },
  { name: 'Dr. Chukwuemeka Obi', role: 'Head of Cybersecurity',           bio: 'Certified Ethical Hacker (CEH) and CISSP with extensive experience securing critical financial infrastructure.',                                   color: 'from-accent-600 to-navy-800',     initials: 'CO' },
  { name: 'Ngozi Effiong',       role: 'Lead Web Development Instructor', bio: 'Full-stack engineer and open-source contributor. Built production systems serving millions of Nigerians daily.',                                   color: 'from-emerald-500 to-teal-700',    initials: 'NE' },
  { name: 'Tunde Babalola',      role: 'Data Science Lead',               bio: 'PhD in Machine Learning. Former research scientist at Microsoft Africa Research Institute. Makes AI approachable.',                                color: 'from-amber-500 to-orange-700',    initials: 'TB' },
  { name: 'Amaka Okonkwo',       role: 'Cloud & DevOps Instructor',       bio: 'AWS Solutions Architect and Kubernetes expert. Helped scale infrastructure at Flutterwave and Paystack.',                                          color: 'from-purple-600 to-navy-800',     initials: 'AO' },
  { name: 'Damilola Adekunle',   role: 'UI/UX Design Instructor',         bio: 'Senior product designer with a portfolio spanning fintech, healthtech, and e-commerce across 3 continents.',                                       color: 'from-rose-500 to-pink-700',       initials: 'DA' },
];

const partners = [
  'Google for Startups', 'Microsoft Azure', 'AWS', 'Flutterwave',
  'Paystack', 'Interswitch', 'CBN Digital Lab', 'NITDA',
];

const values = [
  { icon: Target, title: 'Mission-Driven', gradient: 'from-accent-400 to-accent-600',   bg: 'bg-accent-50',   text: 'text-accent-600',   text2: "Our mission is to close the tech skills gap in Africa by delivering training that is practical, affordable, and directly tied to employment outcomes." },
  { icon: Eye,    title: 'Our Vision',     gradient: 'from-purple-500 to-violet-600',   bg: 'bg-purple-50',   text: 'text-purple-600',   text2: "To become the leading tech education platform in Sub-Saharan Africa — producing 10,000 job-ready tech professionals by 2027." },
  { icon: Heart,  title: 'Our Values',     gradient: 'from-rose-500 to-pink-600',       bg: 'bg-rose-50',     text: 'text-rose-600',     text2: "Excellence, accessibility, community, and constant innovation. We believe great education transforms not just careers, but entire communities." },
  { icon: Award,  title: 'Our Commitment', gradient: 'from-gold-400 to-amber-600',      bg: 'bg-amber-50',    text: 'text-amber-600',    text2: "Every course we publish meets our rigorous quality standard. If you don't get value within 30 days, we'll refund you — no questions asked." },
];

const stats = [
  { value: '500+',  label: 'Graduates' },
  { value: '50+',   label: 'Courses' },
  { value: '4.8★',  label: 'Avg. Rating' },
  { value: '2020',  label: 'Founded' },
];

export default function AboutPage() {
  return (
    <div className="pt-16">

      {/* Hero */}
      <section className="relative bg-navy-950 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-lines opacity-40 pointer-events-none" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 80% at 50% 100%, rgba(0,180,216,0.12), transparent)' }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-500/40 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-500/5 rounded-full blur-5xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 text-accent-400 font-semibold text-xs uppercase tracking-[0.15em] mb-5">
            <span className="w-5 h-px bg-accent-400" />
            Our Story
            <span className="w-5 h-px bg-accent-400" />
          </span>
          <h1 className="font-display font-extrabold text-5xl sm:text-6xl text-white mb-6 leading-tight">
            We Build the Engineers
            <br />
            <span className="text-gradient-hero">Africa Needs</span>
          </h1>
          <p className="text-gray-400 text-xl leading-relaxed max-w-3xl mx-auto">
            TechCrest was founded in 2020 with a simple belief: every Nigerian deserves access to the same quality of tech education available in Silicon Valley. Today, we're delivering on that promise with 500+ graduates working at top companies across the continent.
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-6 mt-14 max-w-2xl mx-auto">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <p className="font-display font-extrabold text-3xl text-white mb-1">{s.value}</p>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="section-label">
              <span className="w-5 h-px bg-accent-500" />
              What Drives Us
              <span className="w-5 h-px bg-accent-500" />
            </span>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-navy-900 mb-4 leading-tight">
              Purpose-Built for
              <br />
              <span className="text-gradient">Real Impact</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="group relative p-8 bg-white rounded-3xl border border-gray-100 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-400"
                >
                  <div className={`absolute top-0 left-8 right-8 h-0.5 bg-gradient-to-r ${v.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <div className={`w-12 h-12 rounded-2xl ${v.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={22} className={v.text} />
                  </div>
                  <h3 className="font-display font-bold text-xl text-navy-900 mb-3">{v.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">{v.text2}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-gray-50/60 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="section-label">
              <span className="w-5 h-px bg-accent-500" />
              Our Team
              <span className="w-5 h-px bg-accent-500" />
            </span>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-navy-900 mb-4 leading-tight">
              Learn from the
              <br />
              <span className="text-gradient">Practitioners</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-base leading-relaxed">
              Our instructors are active professionals in their fields — not career academics. They bring real-world experience into every lesson.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {team.map((member) => (
              <div
                key={member.name}
                className="group bg-white rounded-3xl border border-gray-100 shadow-card overflow-hidden hover:shadow-card-hover hover:-translate-y-2 transition-all duration-400"
              >
                <div className={`h-36 bg-gradient-to-br ${member.color} relative flex items-center justify-center overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="relative w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/30 backdrop-blur-sm flex items-center justify-center text-white font-bold text-2xl font-display group-hover:scale-105 transition-transform duration-300">
                    {member.initials}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display font-bold text-navy-900 text-base mb-0.5">{member.name}</h3>
                  <p className="text-accent-600 font-semibold text-xs mb-3 uppercase tracking-wide">{member.role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-10">
            Trusted by professionals at leading organizations
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {partners.map((p) => (
              <div
                key={p}
                className="h-16 bg-gray-50 hover:bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-card flex items-center justify-center transition-all duration-300 group cursor-default"
              >
                <span className="text-sm font-bold text-gray-400 group-hover:text-gray-600 transition-colors">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 bg-navy-900 overflow-hidden">
        <div className="absolute inset-0 bg-grid-lines opacity-40 pointer-events-none" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(0,180,216,0.1), transparent)' }} />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white mb-5 leading-tight">
            Ready to Start Your
            <br />
            <span className="text-gradient-hero">Tech Journey?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            Join thousands of Africans already building their careers with TechCrest.
          </p>
          <a
            href="/courses"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-400 hover:to-accent-500 text-white font-bold px-8 py-4 rounded-2xl shadow-glow transition-all duration-300 hover:-translate-y-0.5 group"
          >
            Explore Courses
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
          </a>
        </div>
      </section>
    </div>
  );
}
