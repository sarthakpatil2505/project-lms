import { LandingNav } from '@/components/landing/LandingNav';
import { CourseCatalog } from '@/components/courses/CourseCatalog';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { getPublishedCourses } from '@/lib/supabase/queries';

export const metadata = { title: 'Course Catalog | SkillBank LMS' };

export default async function CoursesPage() {
  const courses = await getPublishedCourses().catch(() => []);
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <LandingNav />
      <main className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        <CourseCatalog courses={courses as any} />
      </main>
      <LandingFooter />
    </div>
  );
}
