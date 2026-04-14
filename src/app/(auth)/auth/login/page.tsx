'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { signIn, signInWithGoogle, resetPassword } from '@/lib/auth';
import { isFirebaseConfigured } from '@/lib/demo-data';
import toast from 'react-hot-toast';

const schema = z.object({
  email:    z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPw,        setShowPw]        = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resetEmail,    setResetEmail]    = useState('');
  const [showReset,     setShowReset]     = useState(false);
  const [resetLoading,  setResetLoading]  = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    if (!isFirebaseConfigured()) {
      toast.error('Firebase is not configured. Add your Firebase keys to .env.local to enable sign-in.');
      return;
    }
    try {
      await signIn(data.email, data.password);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        toast.error('Invalid email or password.');
      } else {
        toast.error('Sign in failed. Please try again.');
      }
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch {
      toast.error('Google sign-in failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleReset = async () => {
    const email = resetEmail || getValues('email');
    if (!email) { toast.error('Enter your email address first.'); return; }
    setResetLoading(true);
    try {
      await resetPassword(email);
      toast.success('Password reset email sent! Check your inbox.');
      setShowReset(false);
    } catch {
      toast.error('Failed to send reset email. Check the address and try again.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="glass-light rounded-3xl border border-white/20 shadow-dark-lg p-8 backdrop-blur-xl">
      <div className="text-center mb-7">
        <h1 className="font-display font-bold text-2xl text-navy-900">Welcome back</h1>
        <p className="text-gray-500 mt-1.5 text-sm">Sign in to continue your learning journey</p>
      </div>

      {/* Google OAuth */}
      <Button
        type="button"
        variant="outline"
        fullWidth
        size="lg"
        loading={googleLoading}
        onClick={handleGoogle}
        className="mb-5 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl"
      >
        <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </Button>

      <div className="relative mb-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-white text-xs text-gray-400 font-medium">or sign in with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail size={15} />}
          error={errors.email?.message}
          {...register('email')}
        />
        <div>
          <Input
            label="Password"
            type={showPw ? 'text' : 'password'}
            placeholder="Your password"
            leftIcon={<Lock size={15} />}
            rightIcon={
              <button type="button" onClick={() => setShowPw(!showPw)} className="text-gray-400 hover:text-gray-600">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
            error={errors.password?.message}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowReset(true)}
            className="text-xs text-accent-600 hover:text-accent-500 hover:underline mt-1.5 block text-right w-full transition-colors"
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          loading={isSubmitting}
          size="lg"
          fullWidth
          className="mt-1 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-400 hover:to-accent-500 shadow-glow btn-shine"
        >
          Sign In
          <ArrowRight size={16} />
        </Button>
      </form>

      {/* Password reset mini-form */}
      {showReset && (
        <div className="mt-5 p-4 bg-blue-50 rounded-2xl border border-blue-100">
          <p className="text-sm font-semibold text-navy-900 mb-3">Reset Your Password</p>
          <Input
            type="email"
            placeholder="Your email address"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            leftIcon={<Mail size={15} />}
          />
          <div className="flex gap-2 mt-3">
            <Button onClick={handleReset} loading={resetLoading} size="sm" className="flex-1">
              Send Reset Link
            </Button>
            <Button onClick={() => setShowReset(false)} variant="ghost" size="sm">
              Cancel
            </Button>
          </div>
        </div>
      )}

      <p className="text-center text-sm text-gray-500 mt-6">
        Don't have an account?{' '}
        <Link href="/auth/signup" className="text-accent-600 font-semibold hover:text-accent-500 transition-colors">
          Sign up free
        </Link>
      </p>
    </div>
  );
}
