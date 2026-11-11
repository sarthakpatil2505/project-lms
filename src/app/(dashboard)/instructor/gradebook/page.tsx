import { GradebookView } from '@/components/instructor/GradebookView';

export const metadata = {
  title: 'Submissions Gradebook | AetherLMS',
  description: 'Grading queue and rubric evaluation for weekly assignments.',
};

export default function GradebookPage() {
  return <GradebookView />;
}
