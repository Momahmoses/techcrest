'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { isFirebaseConfigured } from '@/lib/demo-data';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';

const schema = z.object({
  name:    z.string().min(2, 'Name must be at least 2 characters'),
  email:   z.string().email('Enter a valid email address'),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      if (isFirebaseConfigured() && db) {
        await addDoc(collection(db, 'contacts'), {
          ...data,
          read:      false,
          createdAt: serverTimestamp(),
        });
      }
      // In demo mode we still show a success toast
      toast.success("Message sent! We'll be in touch soon.");
      reset();
    } catch (err) {
      console.error(err);
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <Input
          label="Full Name"
          placeholder="Adaeze Okonkwo"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="hello@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>
      <Input
        label="Subject"
        placeholder="Question about Web Development course"
        error={errors.subject?.message}
        {...register('subject')}
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-navy-900">Message</label>
        <textarea
          rows={5}
          placeholder="Tell us how we can help you..."
          className={`w-full rounded-lg border px-3.5 py-2.5 text-sm font-body text-navy-900 placeholder:text-gray-400 outline-none transition-all resize-none ${
            errors.message
              ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
              : 'border-gray-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20'
          }`}
          {...register('message')}
        />
        {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
      </div>

      <Button type="submit" loading={isSubmitting} size="lg" fullWidth>
        <Send size={16} /> Send Message
      </Button>
    </form>
  );
}
