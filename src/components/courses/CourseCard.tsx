import Link from 'next/link';
import { Users, Clock, BarChart2, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/ui/StarRating';
import { formatCurrency, calcDiscountPercent } from '@/lib/utils';
import { CATEGORY_ICONS, LEVEL_COLORS } from '@/constants';
import type { Course } from '@/types';

export function CourseCard({ course }: { course: Course }) {
  const discount = course.originalPrice ? calcDiscountPercent(course.originalPrice, course.price) : null;

  return (
    <Link href={`/courses/${course.slug || course.id}`} className="group block h-full">
      <div className="bg-white rounded-3xl border border-gray-100/80 shadow-card group-hover:shadow-card-hover group-hover:-translate-y-2 transition-all duration-400 ease-spring overflow-hidden flex flex-col h-full">

        {/* Thumbnail */}
        <div className="relative h-52 bg-gradient-to-br from-navy-800 to-navy-950 flex items-center justify-center overflow-hidden">
          {course.thumbnail?.startsWith('http') ? (
            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-navy-700/80 to-navy-950" />
              <span className="relative z-10 text-7xl select-none drop-shadow-lg">
                {CATEGORY_ICONS[course.category] ?? '📚'}
              </span>
            </>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Arrow hint on hover */}
          <div className="absolute bottom-4 right-4 w-9 h-9 rounded-xl bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-card">
            <ArrowRight size={16} className="text-navy-900" />
          </div>

          {/* Badges */}
          {discount && (
            <span className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
              -{discount}%
            </span>
          )}
          <span className="absolute top-3 left-3">
            <Badge className={LEVEL_COLORS[course.level]}>{course.level}</Badge>
          </span>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1 gap-3">
          {/* Category */}
          <p className="text-xs font-bold text-accent-500 uppercase tracking-wide">
            {course.category}
          </p>

          {/* Title */}
          <h3 className="font-display font-bold text-navy-900 text-base leading-snug group-hover:text-accent-600 transition-colors duration-200 line-clamp-2">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed flex-1">
            {course.description}
          </p>

          {/* Instructor */}
          <p className="text-xs text-gray-400">
            By <span className="font-semibold text-gray-600">{course.instructor}</span>
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Clock size={11} className="text-gray-400" />
              {course.duration}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-200" />
            <span className="flex items-center gap-1">
              <Users size={11} className="text-gray-400" />
              {course.students.toLocaleString()}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-200" />
            <span className="flex items-center gap-1">
              <BarChart2 size={11} className="text-gray-400" />
              {course.lessons} lessons
            </span>
          </div>

          {/* Rating + Price */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            <div className="flex items-center gap-1.5">
              <StarRating rating={course.rating} size={12} />
              <span className="text-xs font-bold text-gray-700">{course.rating.toFixed(1)}</span>
            </div>
            <div className="text-right">
              <span className="font-display font-extrabold text-navy-900 text-lg">
                {formatCurrency(course.price)}
              </span>
              {course.originalPrice && (
                <span className="text-xs text-gray-400 line-through ml-2">
                  {formatCurrency(course.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
