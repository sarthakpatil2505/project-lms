import { AssignmentSubmissionRoom } from '@/components/assignment/AssignmentSubmissionRoom';

interface Props {
  params: {
    slug: string;
    assignmentId: string;
  };
}

export const metadata = {
  title: 'Assignment Submission | AetherLMS',
  description: 'Rigid deadline assignment submissions with automated test suites and rubrics.',
};

export default function AssignmentPage({ params }: Props) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <AssignmentSubmissionRoom
        courseSlug={params.slug}
        assignmentId={params.assignmentId}
      />
    </div>
  );
}
