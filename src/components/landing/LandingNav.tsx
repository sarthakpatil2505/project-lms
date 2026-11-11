'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { BookOpen, GraduationCap, Compass, Award, Menu, X, ArrowRight } from 'lucide-react';

export function LandingNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white font-heading">
                Aether<span className="text-brand-400">LMS</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 -mt-1">
                Coursera &times; NPTEL Grade
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link
              href="/courses"
              className="hover:text-brand-400 transition-colors flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-brand-400" />
              Explore Catalog
            </Link>
            <a
              href="#features"
              className="hover:text-brand-400 transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-indigo-400" />
              Rigor & Assessment
            </a>
            <a
              href="#certifications"
              className="hover:text-brand-400 transition-colors flex items-center gap-1.5"
            >
              <Award className="w-4 h-4 text-amber-400" />
              Credentials & Verification
            </a>
          </div>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 px-5 py-2.5 rounded-xl shadow-lg shadow-brand-600/30 hover:shadow-brand-600/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900/95 border-b border-slate-800 backdrop-blur-xl px-4 pt-3 pb-6 space-y-4">
          <Link
            href="/courses"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-slate-200 font-medium py-2 hover:text-brand-400"
          >
            Explore Catalog
          </Link>
          <a
            href="#features"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-slate-200 font-medium py-2 hover:text-brand-400"
          >
            Rigor & Assessment
          </a>
          <a
            href="#certifications"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-slate-200 font-medium py-2 hover:text-brand-400"
          >
            Credentials & Verification
          </a>
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center py-2.5 text-sm font-semibold text-slate-300 border border-slate-700 rounded-xl hover:bg-slate-800"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center py-2.5 text-sm font-semibold text-white bg-brand-600 rounded-xl shadow-lg shadow-brand-600/30"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
