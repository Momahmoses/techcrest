import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  showPercent?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'accent' | 'green' | 'amber';
  className?: string;
}

const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };
const colors = {
  accent: 'bg-accent-500',
  green:  'bg-green-500',
  amber:  'bg-amber-500',
};

export function ProgressBar({
  value,
  label,
  showPercent = false,
  size = 'md',
  color = 'accent',
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn('w-full', className)}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1">
          {label    && <span className="text-sm text-gray-600">{label}</span>}
          {showPercent && <span className="text-sm font-semibold text-gray-700">{clamped}%</span>}
        </div>
      )}
      <div className={cn('w-full bg-gray-100 rounded-full overflow-hidden', heights[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', colors[color])}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
