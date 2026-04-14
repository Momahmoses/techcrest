'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Settings,
  LogOut,
  X,
  BookMarked,
  Zap,
} from 'lucide-react';
import { signOut } from '@/lib/auth';
import { cn } from '@/lib/utils';

const links = [
  { href: '/dashboard',          label: 'Overview',    icon: LayoutDashboard },
  { href: '/dashboard/courses',  label: 'My Courses',  icon: BookMarked },
  { href: '/dashboard/settings', label: 'Settings',    icon: Settings },
];

interface SidebarProps {
  onClose?: () => void;
  mobile?: boolean;
}

export function DashboardSidebar({ onClose, mobile }: SidebarProps) {
  const pathname = usePathname();
  const router   = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <aside
      className={cn(
        'flex flex-col h-full relative overflow-hidden',
        'bg-navy-900',
        mobile ? 'w-full' : 'w-64 shrink-0',
      )}
    >
      {/* Background texture */}
      <div className="absolute inset-0 bg-grid-lines opacity-30 pointer-events-none" />
      {/* Gradient orb */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center justify-between px-5 h-16 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-200">
            <Zap size={15} className="text-white" />
          </div>
          <span className="font-display font-bold text-base text-white">
            Tech<span className="text-accent-400">Crest</span>
          </span>
        </Link>
        {mobile && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="relative flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.15em] px-3 mb-4">
          Student Portal
        </p>
        {links.map((l) => {
          const Icon = l.icon;
          const active = pathname === l.href || pathname.startsWith(l.href + '/');
          return (
            <Link
              key={l.href}
              href={l.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-glow'
                  : 'text-gray-400 hover:bg-white/8 hover:text-white',
              )}
            >
              <div className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-200',
                active ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10',
              )}>
                <Icon size={15} />
              </div>
              {l.label}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="relative p-3 border-t border-white/10">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
            <LogOut size={15} />
          </div>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
