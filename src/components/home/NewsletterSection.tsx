'use client';

import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { isFirebaseConfigured } from '@/lib/demo-data';
import toast from 'react-hot-toast';

export function NewsletterSection() {
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      if (isFirebaseConfigured() && db) {
        await addDoc(collection(db, 'newsletter'), {
          email,
          createdAt: serverTimestamp(),
        });
      }
      toast.success("You're on the list! Watch your inbox for updates.");
      setEmail('');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-28 overflow-hidden bg-navy-900">
      {/* Background layers */}
      <div className="absolute inset-0 bg-grid-lines opacity-50 pointer-events-none" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(0,180,216,0.12), transparent)' }} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-500/40 to-transparent" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-6">
          <Sparkles size={14} className="text-gold-400" />
          <span className="text-white/80 text-sm font-medium">New courses every month</span>
        </div>

        <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white mb-5 leading-tight">
          New Courses.{' '}
          <span className="text-gradient-hero">Exclusive Deals.</span>
          <br />
          Industry Insights.
        </h2>

        <p className="text-gray-400 mb-10 text-lg leading-relaxed">
          Join 2,000+ tech professionals getting our weekly newsletter.
          <br className="hidden sm:block" />
          No spam — unsubscribe anytime.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <div className="flex-1">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 bg-white/8 border-white/15 text-white placeholder:text-white/40 focus:border-accent-400 focus:ring-accent-400/20 rounded-xl"
            />
          </div>
          <Button
            type="submit"
            loading={loading}
            size="lg"
            className="bg-gradient-to-r from-accent-400 to-accent-500 hover:from-accent-300 hover:to-accent-400 text-white shadow-glow shrink-0"
          >
            <Send size={16} />
            Subscribe
          </Button>
        </form>

        <p className="text-gray-600 text-xs mt-5">
          By subscribing, you agree to our Privacy Policy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
