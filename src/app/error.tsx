'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[app/error]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <h2 className="font-display font-bold text-2xl text-navy-900 mb-3">
          Something went wrong
        </h2>
        <p className="text-gray-500 mb-8">
          An unexpected error occurred. Our team has been notified. Try refreshing the page.
        </p>
        <Button onClick={reset} size="lg">Try Again</Button>
      </div>
    </div>
  );
}
