import type { Metadata } from 'next';
import { ContactForm } from './ContactForm';
import { Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';
import { SITE_CONFIG } from '@/constants';

export const metadata: Metadata = { title: 'Contact Us' };

const contactInfo = [
  {
    icon:     Mail,
    label:    'Email Us',
    value:    SITE_CONFIG.email,
    sub:      'We reply within 24 hours',
    href:     `mailto:${SITE_CONFIG.email}`,
    gradient: 'from-accent-400 to-accent-600',
    bg:       'bg-accent-50',
    text:     'text-accent-600',
  },
  {
    icon:     Phone,
    label:    'Call Us',
    value:    SITE_CONFIG.phone,
    sub:      'Mon–Fri, 8am–6pm WAT',
    href:     `tel:+2348001111111`,
    gradient: 'from-emerald-400 to-teal-600',
    bg:       'bg-emerald-50',
    text:     'text-emerald-600',
  },
  {
    icon:     MapPin,
    label:    'Visit Us',
    value:    'Victoria Island, Lagos',
    sub:      SITE_CONFIG.address,
    href:     '#map',
    gradient: 'from-purple-500 to-violet-600',
    bg:       'bg-purple-50',
    text:     'text-purple-600',
  },
  {
    icon:     Clock,
    label:    'Office Hours',
    value:    'Mon–Fri: 8am – 6pm',
    sub:      'Sat: 10am – 2pm',
    href:     null,
    gradient: 'from-gold-400 to-amber-600',
    bg:       'bg-amber-50',
    text:     'text-amber-600',
  },
];

export default function ContactPage() {
  return (
    <div className="pt-16 min-h-screen">

      {/* Header */}
      <div className="relative bg-navy-950 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-lines opacity-40 pointer-events-none" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 80% at 50% 100%, rgba(0,180,216,0.1), transparent)' }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-500/40 to-transparent" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 text-accent-400 font-semibold text-xs uppercase tracking-[0.15em] mb-5">
            <MessageSquare size={12} />
            Get in Touch
          </span>
          <h1 className="font-display font-extrabold text-5xl sm:text-6xl text-white mb-5 leading-tight">
            We'd Love to
            <br />
            <span className="text-gradient-hero">Hear From You</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
            Have a question about a course, enrollment, or anything else? Our team is ready to help.
          </p>
        </div>
      </div>

      <div className="bg-gray-50/60 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-5 gap-10">

            {/* Info */}
            <div className="lg:col-span-2 space-y-4">
              {contactInfo.map((c) => {
                const Icon = c.icon;
                const content = (
                  <div className="group flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">{c.label}</p>
                      <p className="font-bold text-navy-900 text-sm">{c.value}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{c.sub}</p>
                    </div>
                  </div>
                );
                return c.href ? (
                  <a key={c.label} href={c.href} className="block">
                    {content}
                  </a>
                ) : (
                  <div key={c.label}>{content}</div>
                );
              })}

              {/* Map placeholder */}
              <div
                id="map"
                className="h-52 bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden flex items-center justify-center"
              >
                <div className="text-center text-gray-400">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mx-auto mb-3">
                    <MapPin size={22} className="text-purple-600" />
                  </div>
                  <p className="text-sm font-bold text-navy-900">14 Innovation Drive</p>
                  <p className="text-xs text-gray-500 mt-1">Victoria Island, Lagos</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-8 lg:p-10">
                <div className="mb-7">
                  <h2 className="font-display font-bold text-2xl text-navy-900 mb-1.5">Send a Message</h2>
                  <p className="text-gray-500 text-sm">Fill out the form below and we'll get back to you shortly.</p>
                </div>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
