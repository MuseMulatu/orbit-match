import { HeroSection } from '@/components/hasab/HeroSection';
import { HowItWorks } from '@/components/hasab/HowItWorks';
import { TrustSection } from '@/components/hasab/TrustSection';
import { PricingSection } from '@/components/hasab/PricingSection';
import { FooterSection } from '@/components/hasab/FooterSection';

export default function Landing() {
  return (
    <div className="min-h-screen bg-black">
      <HeroSection />
      <HowItWorks />
      <TrustSection />
      <PricingSection />
      <FooterSection />
    </div>
  );
}
