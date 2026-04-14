'use client';

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, BookOpen, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CourseCard } from '@/components/courses/CourseCard';
import { COURSE_CATEGORIES, COURSE_LEVELS } from '@/constants';
import type { Course, CourseCategory, CourseLevel } from '@/types';

interface Props { initialCourses: Course[]; }

const SORT_OPTIONS = [
  { value: 'newest',   label: 'Newest' },
  { value: 'popular',  label: 'Most Popular' },
  { value: 'rating',   label: 'Highest Rated' },
  { value: 'price-lo', label: 'Price: Low → High' },
  { value: 'price-hi', label: 'Price: High → Low' },
];

export function CourseCatalogClient({ initialCourses }: Props) {
  const [search,      setSearch]      = useState('');
  const [category,    setCategory]    = useState<CourseCategory | ''>('');
  const [level,       setLevel]       = useState<CourseLevel | ''>('');
  const [maxPrice,    setMaxPrice]    = useState(500000);
  const [sort,        setSort]        = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = [...initialCourses];
    if (search)   list = list.filter(c =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase()),
    );
    if (category) list = list.filter(c => c.category === category);
    if (level)    list = list.filter(c => c.level === level);
    list = list.filter(c => c.price <= maxPrice);

    switch (sort) {
      case 'popular':  list.sort((a, b) => b.students - a.students); break;
      case 'rating':   list.sort((a, b) => b.rating   - a.rating);   break;
      case 'price-lo': list.sort((a, b) => a.price    - b.price);    break;
      case 'price-hi': list.sort((a, b) => b.price    - a.price);    break;
      default:         list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return list;
  }, [initialCourses, search, category, level, maxPrice, sort]);

  const clearFilters = () => {
    setSearch(''); setCategory(''); setLevel(''); setMaxPrice(500000); setSort('newest');
  };
  const hasFilters = search || category || level || maxPrice < 500000;

  return (
    <div className="pt-20 min-h-screen bg-gray-50/60">

      {/* Page header */}
      <div className="relative bg-navy-900 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-lines opacity-40 pointer-events-none" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 100% at 50% 100%, rgba(0,180,216,0.1), transparent)' }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-500/40 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 text-accent-400 font-semibold text-xs uppercase tracking-[0.15em] mb-4">
            <Sparkles size={12} />
            Course Catalog
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white mb-3 leading-tight">
            All Courses
          </h1>
          <p className="text-gray-400 text-lg">
            <span className="text-accent-400 font-bold">{initialCourses.length}</span> courses across 8 tech categories
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Search + Sort bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search courses, instructors..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              leftIcon={<Search size={16} />}
              className="h-11"
            />
          </div>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm font-medium text-navy-900 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none cursor-pointer hover:border-gray-300 transition-colors shadow-xs"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="shrink-0 h-11 rounded-xl"
          >
            <SlidersHorizontal size={16} />
            Filters
            {hasFilters && <span className="ml-1 w-2 h-2 rounded-full bg-accent-500 inline-block" />}
          </Button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

              {/* Category */}
              <div>
                <p className="text-sm font-bold text-navy-900 mb-3">Category</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setCategory('')}
                    className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-all duration-200 ${
                      !category
                        ? 'bg-accent-500 text-white border-accent-500 shadow-glow'
                        : 'border-gray-200 text-gray-600 hover:border-accent-300 hover:text-accent-600'
                    }`}
                  >All</button>
                  {COURSE_CATEGORIES.map(c => (
                    <button
                      key={c}
                      onClick={() => setCategory(c === category ? '' : c)}
                      className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-all duration-200 ${
                        category === c
                          ? 'bg-accent-500 text-white border-accent-500 shadow-glow'
                          : 'border-gray-200 text-gray-600 hover:border-accent-300 hover:text-accent-600'
                      }`}
                    >{c}</button>
                  ))}
                </div>
              </div>

              {/* Level */}
              <div>
                <p className="text-sm font-bold text-navy-900 mb-3">Level</p>
                <div className="flex flex-col gap-2.5">
                  {(['', ...COURSE_LEVELS] as (CourseLevel | ''[])[]).map(l => (
                    <label key={String(l)} className="flex items-center gap-2.5 cursor-pointer group">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                        level === l ? 'border-accent-500 bg-accent-500' : 'border-gray-300 group-hover:border-accent-400'
                      }`}>
                        {level === l && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <input
                        type="radio"
                        name="level"
                        checked={level === l}
                        onChange={() => setLevel(l as CourseLevel | '')}
                        className="sr-only"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-navy-900 transition-colors">{(l as string) || 'All Levels'}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <p className="text-sm font-bold text-navy-900 mb-3">
                  Max Price: <span className="text-accent-600 font-extrabold">₦{maxPrice.toLocaleString()}</span>
                </p>
                <input
                  type="range"
                  min={0}
                  max={500000}
                  step={5000}
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-accent-500 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                  <span>Free</span><span>₦500,000</span>
                </div>
              </div>
            </div>

            {hasFilters && (
              <div className="mt-5 pt-5 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  <span className="font-bold text-navy-900">{filtered.length}</span> courses found
                </p>
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-semibold transition-colors"
                >
                  <X size={14} /> Clear all filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Active filter pills */}
        {hasFilters && (
          <div className="flex flex-wrap gap-2 mb-5">
            {category && (
              <Badge variant="accent" className="cursor-pointer" onClick={() => setCategory('')}>
                {category} ×
              </Badge>
            )}
            {level && (
              <Badge variant="accent" className="cursor-pointer" onClick={() => setLevel('')}>
                {level} ×
              </Badge>
            )}
            {maxPrice < 500000 && (
              <Badge variant="accent" className="cursor-pointer" onClick={() => setMaxPrice(500000)}>
                Under ₦{maxPrice.toLocaleString()} ×
              </Badge>
            )}
          </div>
        )}

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-6">
          Showing <span className="font-bold text-navy-900">{filtered.length}</span> courses
        </p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {filtered.map((course, i) => (
              <div
                key={course.id}
                className="animate-in"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border-2 border-dashed border-gray-200 rounded-3xl bg-white">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen size={28} className="text-gray-300" />
            </div>
            <p className="font-display font-bold text-xl text-gray-600">No courses found</p>
            <p className="text-gray-400 mt-2 mb-5">Try adjusting your filters or search terms.</p>
            <Button variant="outline" onClick={clearFilters}>
              <X size={15} />
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
