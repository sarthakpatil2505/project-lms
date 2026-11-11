import { CourseStudio } from '@/components/instructor/CourseStudio';

export const metadata = {
  title: 'Course Studio | AetherLMS Instructor',
  description: 'Design courses, upload modules, and configure weekly assignments.',
};

export default function InstructorCoursesPage() {
  return <CourseStudio />;
}
