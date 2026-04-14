'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { isFirebaseConfigured } from '@/lib/demo-data';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router            = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push('/auth/login'); return; }
    if (user.role !== 'admin') { router.push('/dashboard'); }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    if (!loading && !isFirebaseConfigured()) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-navy-950 p-4">
          <div className="max-w-sm text-center glass rounded-3xl p-8 border border-white/10">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-5">
              <span className="text-2xl">🔧</span>
            </div>
            <h2 className="font-display font-bold text-xl text-white mb-2">Firebase Required</h2>
            <p className="text-gray-400 text-sm mb-5 leading-relaxed">
              The admin panel requires Firebase. Configure{' '}
              <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs font-mono text-accent-400">.env.local</code>{' '}
              with your Firebase keys to access the admin panel.
            </p>
            <a href="/" className="text-accent-400 text-sm font-semibold hover:text-accent-300 transition-colors">
              ← Back to homepage
            </a>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-950">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-glow-gold animate-pulse">
              <ShieldCheck size={24} className="text-navy-900" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gold-400/20 animate-ping" />
          </div>
          <p className="text-gray-400 text-sm font-medium">Verifying access…</p>
        </div>
      </div>
    );
  }

  const initials = user.name
    ? user.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'A';

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <AdminSidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy-950/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-72 shadow-dark-lg"
            onClick={e => e.stopPropagation()}
          >
            <AdminSidebar mobile onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-gray-100/80 flex items-center px-4 sm:px-6 gap-4 shrink-0 shadow-xs">
          <button
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="flex-1 flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 bg-gold-50 border border-gold-200 rounded-lg px-2.5 py-1">
              <ShieldCheck size={12} className="text-gold-600" />
              <span className="text-xs font-bold text-gold-700 uppercase tracking-wide">Admin</span>
            </div>
            <p className="text-sm font-semibold text-navy-900">Control Panel</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-navy-900 leading-none">{user.name}</p>
              <p className="text-[10px] text-gold-600 font-semibold mt-0.5 uppercase tracking-wide">Administrator</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-navy-900 text-xs font-bold shadow-glow-gold cursor-pointer hover:scale-105 transition-transform duration-200">
              {initials}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
