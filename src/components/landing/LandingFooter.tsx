import Link from 'next/link';
import { GraduationCap, Github, Twitter, Linkedin, Heart } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white font-heading tracking-tight">
                Aether<span className="text-brand-400">LMS</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              An enterprise-grade academic learning operating system unifying Coursera's frictionless modular video learning with NPTEL's rigorous weekly assignments, auto-grading, and accredited certification.
            </p>
            <div className="flex items-center gap-4 pt-2 text-slate-400">
              <a href="#" className="hover:text-brand-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-brand-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-brand-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 font-mono">
              Learning Tracks
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/courses?category=cs" className="hover:text-brand-400 transition-colors">
                  Distributed Systems
                </Link>
              </li>
              <li>
                <Link href="/courses?category=ai" className="hover:text-brand-400 transition-colors">
                  Artificial Intelligence &amp; LLMs
                </Link>
              </li>
              <li>
                <Link href="/courses?category=systems" className="hover:text-brand-400 transition-colors">
                  Kernel Architecture
                </Link>
              </li>
              <li>
                <Link href="/courses?category=security" className="hover:text-brand-400 transition-colors">
                  Applied Cryptography
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 font-mono">
              Academic Platform
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/courses" className="hover:text-brand-400 transition-colors">
                  Course Catalog
                </Link>
              </li>
              <li>
                <Link href="/verify/CERT-DEMO-001" className="hover:text-brand-400 transition-colors">
                  Verify Credentials
                </Link>
              </li>
              <li>
                <a href="#features" className="hover:text-brand-400 transition-colors">
                  Best-of-N Engine
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-brand-400 transition-colors">
                  Instructor Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Standards & Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 font-mono">
              Compliance
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <span className="text-slate-400">PostgreSQL RLS Protected</span>
              </li>
              <li>
                <span className="text-slate-400">ISO / IEC 27001 Grade</span>
              </li>
              <li>
                <span className="text-slate-400">NPTEL Equivalent Rigor</span>
              </li>
              <li>
                <span className="text-slate-400">Cryptographic QR Integrity</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} AetherLMS. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-3 sm:mt-0">
            Engineered for high-rigor engineering education
          </p>
        </div>
      </div>
    </footer>
  );
}
