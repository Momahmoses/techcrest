'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, BookOpen, ChevronDown, LogOut, Settings, LayoutDashboard, ShieldCheck, Zap } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserProfile } from '@/lib/auth';
import { isFirebaseConfigured } from '@/lib/demo-data';
import { signOut } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { NAV_LINKS } from '@/constants';
import type { User } from '@/types';

export function Navbar() {
  const [open,      setOpen]      = useState(false);
  const [scrolled,  setScrolled]  = useState(false);
  const [user,      setUser]      = useState<User | null>(null);
  const [dropOpen,  setDropOpen]  = useState(false);
  const pathname = usePathname();
  const router   = useRouter();

  useEffect(() => {
    if (!isFirebaseConfigured() || !auth) return;
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const profile = await getUserProfile(fbUser.uid);
        setUser(profile);
      } else {
        setUser(null);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setOpen(false); setDropOpen(false); }, [pathname]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const isHome   = pathname === '/';
  const isLight  = scrolled || !isHome;

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-400',
        isLight
          ? 'glass-light shadow-xs border-b border-black/[0.04]'
          : 'bg-transparent',
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className={cn(
              'w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300',
              'bg-gradient-to-br from-accent-400 to-accent-600 shadow-glow group-hover:shadow-glow-lg group-hover:scale-105',
            )}>
              <Zap size={18} className="text-white fill-white" />
            </div>
            <span className={cn(
              'font-display font-extrabold text-[1.15rem] tracking-tight transition-colors duration-300',
              isLight ? 'text-navy-900' : 'text-white',
            )}>
              Tech<span className="text-accent-400">Crest</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => {
              const isActive = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    'relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200',
                    isActive
                      ? isLight
                        ? 'text-accent-600 bg-accent-50'
                        : 'text-white bg-white/10'
                      : isLight
                        ? 'text-gray-600 hover:text-navy-900 hover:bg-gray-100/70'
                        : 'text-white/75 hover:text-white hover:bg-white/8',
                  )}
                >
                  {l.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-accent-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* CTA / user menu */}
          <div className="hidden md:flex items-center gap-2.5">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200',
                    isLight
                      ? 'text-navy-900 hover:bg-gray-100'
                      : 'text-white hover:bg-white/10',
                  )}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {user.name?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <span className="hidden lg:block max-w-[120px] truncate">{user.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} className={cn('transition-transform duration-200', dropOpen && 'rotate-180')} />
                </button>

                {dropOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-gray-100 shadow-card-hover py-2 animate-fade-up">
                    <div className="px-4 py-3 border-b border-gray-50 mb-1">
                      <p className="text-sm font-bold text-navy-900">{user.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
                    </div>
                    {user.role === 'admin' && (
                      <Link href="/admin" onClick={() => setDropOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-purple-700 hover:bg-purple-50 transition-colors mx-1 rounded-xl font-medium">
                        <ShieldCheck size={15} /> Admin Panel
                      </Link>
                    )}
                    <Link href="/dashboard" onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors mx-1 rounded-xl font-medium">
                      <LayoutDashboard size={15} /> My Dashboard
                    </Link>
                    <Link href="/dashboard/settings" onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors mx-1 rounded-xl font-medium">
                      <Settings size={15} /> Settings
                    </Link>
                    <div className="border-t border-gray-50 mt-1 pt-1">
                      <button onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors mx-1 rounded-xl font-medium" style={{ width: 'calc(100% - 8px)' }}>
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      isLight
                        ? 'text-gray-700 hover:bg-gray-100'
                        : 'text-white/80 hover:text-white hover:bg-white/10',
                    )}
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="shadow-glow">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className={cn(
              'md:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-colors',
              isLight ? 'text-navy-900 hover:bg-gray-100' : 'text-white hover:bg-white/10',
            )}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass-light border-t border-black/[0.04] shadow-card animate-slide-up">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'block px-4 py-3 rounded-xl text-sm font-semibold transition-colors',
                  pathname === l.href
                    ? 'bg-accent-50 text-accent-600'
                    : 'text-gray-700 hover:bg-gray-50',
                )}
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100 space-y-2">
              {user ? (
                <>
                  <Link href="/dashboard" className="block px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                    My Dashboard
                  </Link>
                  <button onClick={handleSignOut} className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login"><Button variant="outline" fullWidth>Sign In</Button></Link>
                  <Link href="/auth/signup"><Button fullWidth>Get Started Free</Button></Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
