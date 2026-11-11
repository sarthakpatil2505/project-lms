import { LandingNav } from '@/components/landing/LandingNav';
import { CertificateVerificationView } from '@/components/certificate/CertificateVerificationView';
import { LandingFooter } from '@/components/landing/LandingFooter';

interface Props {
  params: {
    certificateId: string;
  };
}

export const metadata = {
  title: 'Cryptographic Certificate Verification | AetherLMS',
  description: 'Public verification terminal for accredited academic certificates and transcripts.',
};

export default function VerificationPage({ params }: Props) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <LandingNav />
      <main className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        <CertificateVerificationView certificateId={params.certificateId} />
      </main>
      <LandingFooter />
    </div>
  );
}
