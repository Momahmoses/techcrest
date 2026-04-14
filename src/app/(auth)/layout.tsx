import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-navy-950">
      {/* Background layers */}
      <div className="absolute inset-0 bg-hero-mesh" />
      <div className="absolute inset-0 bg-grid-lines opacity-40 pointer-events-none" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent-500/15 rounded-full blur-5xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-navy-700/40 rounded-full blur-5xl pointer-events-none" />

      {/* Top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-500/50 to-transparent" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-200">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-white">
              Tech<span className="text-accent-400">Crest</span>
            </span>
          </Link>
          <p className="text-gray-500 text-xs mt-2 font-medium uppercase tracking-widest">
            Africa's Premier Tech Platform
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
