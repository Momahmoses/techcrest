import Link from 'next/link';
import { Zap, Twitter, Linkedin, Youtube, Instagram, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { SITE_CONFIG, SOCIAL_LINKS, COURSE_CATEGORIES } from '@/constants';

export function Footer() {
  return (
    <footer className="relative bg-navy-950 text-white overflow-hidden">
      {/* Top gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent-500/60 to-transparent" />

      {/* Background texture */}
      <div className="absolute inset-0 bg-grid-lines opacity-50 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-500/5 rounded-full blur-5xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">

          {/* Brand — 4 cols */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
                <Zap size={18} className="text-white fill-white" />
              </div>
              <span className="font-display font-extrabold text-xl tracking-tight">
                Tech<span className="text-accent-400">Crest</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              Empowering Africa's next generation of tech professionals through world-class training, hands-on projects, and industry-recognized certificates.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2.5">
              {[
                { href: SOCIAL_LINKS.twitter,   Icon: Twitter,   label: 'Twitter' },
                { href: SOCIAL_LINKS.linkedin,  Icon: Linkedin,  label: 'LinkedIn' },
                { href: SOCIAL_LINKS.youtube,   Icon: Youtube,   label: 'YouTube' },
                { href: SOCIAL_LINKS.instagram, Icon: Instagram, label: 'Instagram' },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-gray-400 hover:bg-accent-500 hover:text-white hover:border-accent-500 hover:shadow-glow transition-all duration-300"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Courses — 2 cols */}
          <div className="lg:col-span-2">
            <h3 className="font-display font-bold text-xs uppercase tracking-[0.15em] text-gray-500 mb-5">
              Courses
            </h3>
            <ul className="space-y-2.5">
              {COURSE_CATEGORIES.slice(0, 5).map((c) => (
                <li key={c}>
                  <Link
                    href={`/courses?category=${encodeURIComponent(c)}`}
                    className="text-sm text-gray-400 hover:text-accent-300 transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight size={11} className="opacity-0 group-hover:opacity-100 -ml-2 group-hover:ml-0 transition-all duration-200" />
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company — 2 cols */}
          <div className="lg:col-span-2">
            <h3 className="font-display font-bold text-xs uppercase tracking-[0.15em] text-gray-500 mb-5">
              Company
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: 'About Us',        href: '/about' },
                { label: 'Our Courses',     href: '/courses' },
                { label: 'Contact Us',      href: '/contact' },
                { label: 'Privacy Policy',  href: '#' },
                { label: 'Terms of Use',    href: '#' },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-accent-300 transition-colors flex items-center gap-1.5 group">
                    <ArrowRight size={11} className="opacity-0 group-hover:opacity-100 -ml-2 group-hover:ml-0 transition-all duration-200" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — 4 cols */}
          <div className="lg:col-span-4">
            <h3 className="font-display font-bold text-xs uppercase tracking-[0.15em] text-gray-500 mb-5">
              Get in Touch
            </h3>
            <ul className="space-y-4">
              <li>
                <a href={`mailto:${SITE_CONFIG.email}`} className="flex items-start gap-3 text-sm text-gray-400 hover:text-accent-300 transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-accent-500/20 transition-colors">
                    <Mail size={14} className="text-accent-400" />
                  </div>
                  <span className="mt-1">{SITE_CONFIG.email}</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-gray-400">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <Phone size={14} className="text-accent-400" />
                  </div>
                  <span className="mt-1">{SITE_CONFIG.phone}</span>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-gray-400">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={14} className="text-accent-400" />
                  </div>
                  <span className="leading-relaxed">{SITE_CONFIG.address}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} TechCrest Institute. All rights reserved.
          </p>
          <p className="text-xs text-gray-600 flex items-center gap-1.5">
            Built with excellence in Lagos, Nigeria
            <span className="text-base">🇳🇬</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
