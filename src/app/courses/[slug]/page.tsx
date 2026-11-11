import { LandingNav } from '@/components/landing/LandingNav';
import { CourseDetailView } from '@/components/courses/CourseDetailView';
import { LandingFooter } from '@/components/landing/LandingFooter';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props) {
  return {
    title: `${params.slug.replace('-', ' ').toUpperCase()} | AetherLMS Curriculum`,
    description: 'Master deep tech with Coursera usability and NPTEL weekly academic rigor.',
  };
}

export default function CoursePage({ params }: Props) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <LandingNav />
      <main className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        <CourseDetailView slug={params.slug} />
      </main>
      <LandingFooter />
    </div>
  );
}
