import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Home, BookOpen } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-24 h-24 rounded-3xl bg-white/10 flex items-center justify-center mx-auto mb-8">
          <BookOpen size={40} className="text-accent-400" />
        </div>
        <h1 className="font-display font-extrabold text-8xl text-white mb-4">404</h1>
        <h2 className="font-display font-bold text-2xl text-white mb-3">Page Not Found</h2>
        <p className="text-gray-400 mb-10 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button size="lg">
              <Home size={17} /> Go Home
            </Button>
          </Link>
          <Link href="/courses">
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white hover:text-navy-900">
              Browse Courses
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
