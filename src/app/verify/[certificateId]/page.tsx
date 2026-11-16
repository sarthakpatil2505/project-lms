import { getCertificateById } from '@/lib/supabase/queries';
import { CertificateVerificationView } from '@/components/certificate/CertificateVerificationView';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { certificateId: string } }) {
  return { title: `Certificate Verification — ${params.certificateId}` };
}

export default async function VerifyPage({ params }: { params: { certificateId: string } }) {
  const cert = await getCertificateById(params.certificateId);
  if (!cert) notFound();
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <LandingNav />
      <main className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        <CertificateVerificationView certificate={cert as any} />
      </main>
      <LandingFooter />
    </div>
  );
}
