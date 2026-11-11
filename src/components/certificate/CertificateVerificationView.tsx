'use client';

import { 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  Download, 
  Share2, 
  ExternalLink,
  GraduationCap
} from 'lucide-react';
import toast from 'react-hot-toast';

interface VerificationProps {
  certificateId: string;
}

export function CertificateVerificationView({ certificateId }: VerificationProps) {
  // Demo verified credential data
  const certData = {
    certificateNumber: certificateId,
    studentName: 'Alex Mercer',
    courseTitle: 'Advanced Distributed Systems & Consensus',
    institution: 'MIT CSAIL &times; Aether Academic Board',
    issueDate: 'November 2, 2026',
    overallScore: 91.4,
    bestOfNScore: 'Top 8 of 12 Assignments (Avg: 93.2%)',
    proctoredExamScore: '90.5%',
    passingThreshold: '75.0%',
    status: 'VALID & ISSUED',
    securityHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    instructor: 'Dr. Alistair Vance, Chair of Distributed Systems',
  };

  const handleDownloadPdf = () => {
    toast.success('Downloading official accredited cryptographic certificate (PDF)...');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Verification URL copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Verification Status Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-600/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-600 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
              Cryptographically Verified Credential
            </span>
            <h1 className="text-xl font-bold text-white">Official Certificate of Achievement</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified against Supabase immutable records &bull; Signature matches
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Share verification link"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-600/30 transition-all"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Diplomatic Certificate Document Container */}
      <div className="p-8 sm:p-14 rounded-3xl bg-slate-900 border-2 border-brand-500/30 shadow-2xl relative overflow-hidden text-center space-y-8">
        {/* Subtle Decorative Guilloche pattern overlay */}
        <div className="absolute inset-4 border border-brand-500/20 rounded-2xl pointer-events-none" />
        <div className="absolute top-8 left-8 text-slate-700 font-serif text-3xl opacity-40 select-none">
          &sect;
        </div>
        <div className="absolute top-8 right-8 text-slate-700 font-serif text-3xl opacity-40 select-none">
          &sect;
        </div>

        {/* Institution Brand */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white font-heading">
            Aether<span className="text-brand-400">LMS</span>
          </span>
        </div>

        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-brand-400 font-bold">
            ACADEMIC COUNCIL OF ADVANCED SYSTEMS
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading mt-2">
            Certificate of Completion &amp; Mastery
          </h2>
          <p className="text-xs text-slate-400 mt-2">This is formally conferred upon</p>
          <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 font-heading my-2">
            {certData.studentName}
          </div>
          <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
            for successfully passing the 12-week graduate program with honors:
          </p>
          <div className="text-lg sm:text-xl font-bold text-brand-300 mt-2">
            {certData.courseTitle}
          </div>
        </div>

        {/* Academic Marks & Best of N stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto pt-6 border-t border-slate-800 text-left">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Final Grade</span>
            <div className="text-lg font-mono font-bold text-emerald-400 mt-0.5">
              {certData.overallScore}%
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Best of 8 Labs</span>
            <div className="text-lg font-mono font-bold text-white mt-0.5">93.2%</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Proctored Exam</span>
            <div className="text-lg font-mono font-bold text-sky-400 mt-0.5">90.5%</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Pass Threshold</span>
            <div className="text-lg font-mono font-bold text-slate-300 mt-0.5">&gt;= 75%</div>
          </div>
        </div>

        {/* Footer Signatures and Verification Hash */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-6">
          <div className="text-left space-y-1">
            <p className="font-semibold text-white">{certData.instructor}</p>
            <p className="text-[11px] text-slate-500">Instructor &amp; Academic Lead</p>
          </div>

          <div className="text-center sm:text-right space-y-1 font-mono text-[11px]">
            <p className="text-slate-300">Certificate ID: {certData.certificateNumber}</p>
            <p className="text-slate-500 truncate max-w-xs">Hash: {certData.securityHash}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
