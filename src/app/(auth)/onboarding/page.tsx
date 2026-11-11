import { Metadata } from 'next';
import { OnboardingForm } from '@/components/auth/OnboardingForm';

export const metadata: Metadata = { title: 'Complete Your Profile' };

export default function OnboardingPage() {
  return <OnboardingForm />;
}
