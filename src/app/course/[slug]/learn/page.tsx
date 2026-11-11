import { VideoPlayerRoom } from '@/components/player/VideoPlayerRoom';

interface Props {
  params: {
    slug: string;
  };
}

export const metadata = {
  title: 'Learning Classroom | AetherLMS',
  description: 'Immersive video streaming, synchronized transcripts, and weekly academic modules.',
};

export default function LearnPage({ params }: Props) {
  return <VideoPlayerRoom slug={params.slug} />;
}
