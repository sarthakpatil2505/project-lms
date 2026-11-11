import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'LearnHub — Enterprise Learning Platform',
    template: '%s | LearnHub',
  },
  description:
    'LearnHub is a next-generation enterprise LMS combining the best of Coursera and NPTEL — video courses, weekly assignments, auto-graded quizzes, certificates, and real-time discussions.',
  keywords: ['LMS', 'e-learning', 'online courses', 'certifications', 'NPTEL', 'Coursera alternative'],
  authors: [{ name: 'LearnHub' }],
  openGraph: {
    type: 'website',
    title: 'LearnHub — Enterprise Learning Platform',
    description: 'Next-generation LMS for institutions and learners.',
    siteName: 'LearnHub',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen bg-surface antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
