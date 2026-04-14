import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  showValue?: boolean;
  className?: string;
}

export function StarRating({ rating, max = 5, size = 16, showValue = false, className }: StarRatingProps) {
  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half   = !filled && i < rating;
        return (
          <Star
            key={i}
            size={size}
            className={cn(
              filled ? 'fill-amber-400 text-amber-400' :
              half   ? 'fill-amber-200 text-amber-400' :
                       'fill-gray-200 text-gray-300',
            )}
          />
        );
      })}
      {showValue && (
        <span className="text-sm font-semibold text-gray-700 ml-1">{rating.toFixed(1)}</span>
      )}
    </span>
  );
}
