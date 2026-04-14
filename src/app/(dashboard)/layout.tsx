'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Bell, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { isFirebaseConfigured } from '@/lib/demo-data';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router            = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-950">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center shadow-glow animate-pulse">
              <Zap size={24} className="text-white" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-accent-500/30 animate-ping" />
          </div>
          <p className="text-gray-400 text-sm font-medium">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (!isFirebaseConfigured()) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-navy-950 p-4">
          <div className="max-w-sm text-center glass rounded-3xl p-8 border border-white/10">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-5">
              <span className="text-2xl">🔧</span>
            </div>
            <h2 className="font-display font-bold text-xl text-white mb-2">Firebase Required</h2>
            <p className="text-gray-400 text-sm mb-5 leading-relaxed">
              The dashboard requires Firebase authentication. Add your Firebase credentials to{' '}
              <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs font-mono text-accent-400">.env.local</code>{' '}
              to enable login, enrollment, and progress tracking.
            </p>
            <a href="/" className="text-accent-400 text-sm font-semibold hover:text-accent-300 transition-colors">
              ← Back to homepage
            </a>
          </div>
        </div>
      );
    }
    return null;
  }

  const initials = user.name
    ? user.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <DashboardSidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy-950/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-72 shadow-dark-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <DashboardSidebar mobile onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-gray-100/80 flex items-center px-4 sm:px-6 gap-4 shrink-0 shadow-xs">
          <button
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="flex-1">
            <p className="text-sm font-semibold text-navy-900">
              Hello, <span className="text-accent-600">{user.name?.split(' ')[0]}</span> 👋
            </p>
          </div>

          <button className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent-500" />
          </button>

          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white text-xs font-bold shadow-glow cursor-pointer hover:scale-105 transition-transform duration-200">
            {initials}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
