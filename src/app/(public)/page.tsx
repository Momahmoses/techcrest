import type { Metadata } from 'next';
import { HeroSection }          from '@/components/home/HeroSection';
import { StatsBar }             from '@/components/home/StatsBar';
import { FeaturedCourses }      from '@/components/home/FeaturedCourses';
import { WhyTechCrest }         from '@/components/home/WhyTechCrest';
import { TestimonialsSection }  from '@/components/home/TestimonialsSection';
import { NewsletterSection }    from '@/components/home/NewsletterSection';

export const metadata: Metadata = {
  title: 'TechCrest — Master the Future. One Course at a Time.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <FeaturedCourses />
      <WhyTechCrest />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}
