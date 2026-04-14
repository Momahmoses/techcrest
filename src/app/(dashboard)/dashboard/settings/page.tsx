'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { changePassword } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Save, Lock, User, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio:  z.string().max(200, 'Bio must be under 200 characters').optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword:     z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path:    ['confirmPassword'],
});

type ProfileData  = z.infer<typeof profileSchema>;
type PasswordData = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const { user, firebaseUser } = useAuth();

  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '', bio: user?.bio ?? '' },
  });

  const passwordForm = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileData) => {
    if (!user || !db) return;
    try {
      await updateDoc(doc(db, 'users', user.id), { name: data.name, bio: data.bio ?? '' });
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile.');
    }
  };

  const onPasswordSubmit = async (data: PasswordData) => {
    if (!firebaseUser) return;
    try {
      await changePassword(firebaseUser, data.currentPassword, data.newPassword);
      toast.success('Password changed successfully!');
      passwordForm.reset();
    } catch {
      toast.error('Current password is incorrect.');
    }
  };

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="mb-2">
        <h1 className="font-display font-extrabold text-3xl text-navy-900">Settings</h1>
        <p className="text-gray-500 mt-1 text-sm">Manage your account and preferences</p>
      </div>

      {/* Account card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl bg-accent-50 flex items-center justify-center">
            <User size={16} className="text-accent-600" />
          </div>
          <h2 className="font-display font-bold text-lg text-navy-900">Your Account</h2>
        </div>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white font-bold text-2xl font-display shadow-glow">
            {initials}
          </div>
          <div>
            <p className="font-bold text-navy-900 text-base">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            {user?.role === 'admin' && (
              <span className="inline-flex items-center gap-1 mt-1 bg-gold-50 border border-gold-200 text-gold-700 text-xs font-bold px-2 py-0.5 rounded-full">
                <Shield size={10} /> Administrator
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Profile info */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
            <Save size={15} className="text-blue-600" />
          </div>
          <h2 className="font-display font-bold text-lg text-navy-900">Profile Information</h2>
        </div>
        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            error={profileForm.formState.errors.name?.message}
            {...profileForm.register('name')}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-navy-900">Bio</label>
            <textarea
              rows={3}
              placeholder="Tell us a bit about yourself…"
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-body text-navy-900 placeholder:text-gray-400 outline-none focus:border-accent-500 focus:ring-3 focus:ring-accent-500/15 resize-none hover:border-gray-300 transition-colors"
              {...profileForm.register('bio')}
            />
            {profileForm.formState.errors.bio && (
              <p className="text-xs text-red-500">{profileForm.formState.errors.bio.message}</p>
            )}
          </div>
          <Button
            type="submit"
            loading={profileForm.formState.isSubmitting}
            className="bg-gradient-to-r from-accent-500 to-accent-600 shadow-glow"
          >
            <Save size={15} /> Save Changes
          </Button>
        </form>
      </div>

      {/* Password */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
            <Lock size={15} className="text-purple-600" />
          </div>
          <h2 className="font-display font-bold text-lg text-navy-900">Change Password</h2>
        </div>
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            placeholder="Your current password"
            error={passwordForm.formState.errors.currentPassword?.message}
            {...passwordForm.register('currentPassword')}
          />
          <Input
            label="New Password"
            type="password"
            placeholder="Min. 8 characters"
            error={passwordForm.formState.errors.newPassword?.message}
            {...passwordForm.register('newPassword')}
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Repeat new password"
            error={passwordForm.formState.errors.confirmPassword?.message}
            {...passwordForm.register('confirmPassword')}
          />
          <Button
            type="submit"
            loading={passwordForm.formState.isSubmitting}
            variant="secondary"
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            <Lock size={15} /> Update Password
          </Button>
        </form>
      </div>
    </div>
  );
}
