import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Award, ExternalLink } from 'lucide-react';

export const metadata = { title: 'Certificates | SkillBank LMS' };

export default async function CertificatesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: certs } = await supabase
    .from('certificates')
    .select(`
      id, certificate_number, status, issued_at, final_score,
      courses!course_id(title, slug)
    `)
    .eq('user_id', user.id)
    .eq('status', 'issued')
    .order('issued_at', { ascending: false });

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-heading flex items-center gap-2">
          <Award className="w-6 h-6 text-brand-400" />
          Your Certificates
        </h1>
        <p className="text-surface-muted text-sm mt-1">
          Verifiable cryptographic certificates of completion
        </p>
      </div>

      {!certs || certs.length === 0 ? (
        <div className="p-12 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
          <Award className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">No certificates yet</h3>
          <p className="text-surface-muted text-sm">
            Complete a course with a passing score to earn a certificate.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {certs.map((cert: any) => (
            <div
              key={cert.id}
              className="p-5 rounded-xl bg-slate-900 border border-emerald-700/40 flex items-center justify-between gap-4"
            >
              <div>
                <div className="text-xs font-mono text-emerald-400 font-bold mb-1">
                  {cert.certificate_number}
                </div>
                <div className="font-semibold text-white">{cert.courses?.title}</div>
                <div className="text-xs text-surface-muted mt-0.5">
                  Issued: {new Date(cert.issued_at).toLocaleDateString('en-IN')} &bull; Score: {cert.final_score?.toFixed(1)}%
                </div>
              </div>
              <Link
                href={`/verify/${cert.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-900/60 hover:bg-emerald-800/60 text-emerald-300 text-xs font-semibold transition-colors shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Verify
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
