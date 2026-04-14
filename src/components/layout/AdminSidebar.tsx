'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  CreditCard,
  LogOut,
  ShieldCheck,
  X,
  MessageSquare,
  Zap,
} from 'lucide-react';
import { signOut } from '@/lib/auth';
import { cn } from '@/lib/utils';

const links = [
  { href: '/admin',              label: 'Overview',     icon: LayoutDashboard },
  { href: '/admin/courses',      label: 'Courses',      icon: BookOpen },
  { href: '/admin/students',     label: 'Students',     icon: Users },
  { href: '/admin/transactions', label: 'Transactions', icon: CreditCard },
  { href: '/admin/contacts',     label: 'Messages',     icon: MessageSquare },
];

interface SidebarProps {
  onClose?: () => void;
  mobile?: boolean;
}

export function AdminSidebar({ onClose, mobile }: SidebarProps) {
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
        'bg-navy-950',
        mobile ? 'w-full' : 'w-64 shrink-0',
      )}
    >
      {/* Background texture */}
      <div className="absolute inset-0 bg-grid-lines opacity-20 pointer-events-none" />
      {/* Gradient orbs */}
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-accent-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-16 w-48 h-48 bg-navy-700/30 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center justify-between px-5 h-16 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-glow-gold group-hover:scale-105 transition-transform duration-200">
            <ShieldCheck size={15} className="text-navy-900" />
          </div>
          <div>
            <span className="font-display font-bold text-sm text-white block leading-none">
              Tech<span className="text-gold-400">Crest</span>
            </span>
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Admin</span>
          </div>
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
          Management
        </p>
        {links.map((l) => {
          const Icon = l.icon;
          const active = pathname === l.href || (l.href !== '/admin' && pathname.startsWith(l.href));
          return (
            <Link
              key={l.href}
              href={l.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-gradient-to-r from-accent-500/20 to-accent-600/10 text-accent-400 border border-accent-500/20'
                  : 'text-gray-500 hover:bg-white/5 hover:text-gray-300',
              )}
            >
              <div className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-200',
                active ? 'bg-accent-500/20' : 'bg-white/5',
              )}>
                <Icon size={15} className={active ? 'text-accent-400' : ''} />
              </div>
              {l.label}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="relative p-3 border-t border-white/10 space-y-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-white/5 hover:text-gray-300 transition-all duration-200"
        >
          <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
            <Zap size={15} />
          </div>
          Student Portal
        </Link>
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
