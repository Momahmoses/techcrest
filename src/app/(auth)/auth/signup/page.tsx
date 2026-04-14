'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { signUp, signInWithGoogle } from '@/lib/auth';
import { isFirebaseConfigured } from '@/lib/demo-data';
import toast from 'react-hot-toast';

const schema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters'),
  email:    z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm:  z.string(),
}).refine(d => d.password === d.confirm, {
  message: 'Passwords do not match',
  path:    ['confirm'],
});

type FormData = z.infer<typeof schema>;

export default function SignUpPage() {
  const [showPw,        setShowPw]        = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    if (!isFirebaseConfigured()) {
      toast.error('Firebase is not configured. Add your Firebase keys to .env.local to enable sign-up.');
      return;
    }
    try {
      await signUp(data.name, data.email, data.password);
      toast.success('Account created! Welcome to TechCrest 🎉');
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign up failed';
      if (msg.includes('email-already-in-use')) {
        toast.error('This email is already registered. Try signing in instead.');
      } else {
        toast.error(msg);
      }
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Welcome to TechCrest!');
      router.push('/dashboard');
    } catch {
      toast.error('Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="glass-light rounded-3xl border border-white/20 shadow-dark-lg p-8 backdrop-blur-xl">
      <div className="text-center mb-7">
        <h1 className="font-display font-bold text-2xl text-navy-900">Create your account</h1>
        <p className="text-gray-500 mt-1.5 text-sm">
          Join{' '}
          <span className="font-semibold text-accent-600">2,000+</span>{' '}
          students learning at TechCrest
        </p>
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
          <span className="px-3 bg-white text-xs text-gray-400 font-medium">or sign up with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="Adaeze Okonkwo"
          leftIcon={<User size={15} />}
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail size={15} />}
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type={showPw ? 'text' : 'password'}
          placeholder="Min. 8 characters"
          leftIcon={<Lock size={15} />}
          rightIcon={
            <button type="button" onClick={() => setShowPw(!showPw)} className="text-gray-400 hover:text-gray-600">
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Repeat your password"
          leftIcon={<Lock size={15} />}
          error={errors.confirm?.message}
          {...register('confirm')}
        />

        <Button
          type="submit"
          loading={isSubmitting}
          size="lg"
          fullWidth
          className="mt-1 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-400 hover:to-accent-500 shadow-glow btn-shine"
        >
          Create Account
          <ArrowRight size={16} />
        </Button>
      </form>

      <p className="text-center text-xs text-gray-400 mt-4">
        By signing up, you agree to our{' '}
        <span className="text-accent-600 cursor-pointer hover:underline">Terms of Service</span>{' '}
        and{' '}
        <span className="text-accent-600 cursor-pointer hover:underline">Privacy Policy</span>.
      </p>

      <p className="text-center text-sm text-gray-500 mt-4">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-accent-600 font-semibold hover:text-accent-500 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
