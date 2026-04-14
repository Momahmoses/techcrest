import type { CourseCategory, CourseLevel } from '@/types';

export const COURSE_CATEGORIES: CourseCategory[] = [
  'Cybersecurity',
  'Web Development',
  'Data Science',
  'Cloud Computing',
  'Mobile Development',
  'DevOps',
  'UI/UX Design',
  'Networking',
];

export const COURSE_LEVELS: CourseLevel[] = ['Beginner', 'Intermediate', 'Advanced'];

export const CATEGORY_ICONS: Record<CourseCategory, string> = {
  'Cybersecurity':       '🔐',
  'Web Development':     '🌐',
  'Data Science':        '📊',
  'Cloud Computing':     '☁️',
  'Mobile Development':  '📱',
  'DevOps':              '⚙️',
  'UI/UX Design':        '🎨',
  'Networking':          '🔌',
};

export const LEVEL_COLORS: Record<CourseLevel, string> = {
  Beginner:     'bg-green-100 text-green-700',
  Intermediate: 'bg-yellow-100 text-yellow-700',
  Advanced:     'bg-red-100 text-red-700',
};

export const NAV_LINKS = [
  { label: 'Courses', href: '/courses' },
  { label: 'About',   href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const SOCIAL_LINKS = {
  twitter:   'https://twitter.com/techcrest',
  linkedin:  'https://linkedin.com/company/techcrest',
  youtube:   'https://youtube.com/@techcrest',
  instagram: 'https://instagram.com/techcrest',
};

export const SITE_CONFIG = {
  name:        'TechCrest',
  tagline:     'Master the Future. One Course at a Time.',
  description: 'TechCrest is a premium tech institute offering in-person training and online courses in cybersecurity, web development, data science, and more.',
  email:       'hello@techcrest.ng',
  phone:       '+234 800 TECHCREST',
  address:     '14 Innovation Drive, Victoria Island, Lagos, Nigeria',
};
