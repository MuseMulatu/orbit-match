import { HeroSection } from '@/components/hasab/HeroSection';
import { HowItWorks } from '@/components/hasab/HowItWorks';
import { TrustSection } from '@/components/hasab/TrustSection';
import { PricingSection } from '@/components/hasab/PricingSection';
import { FooterSection } from '@/components/hasab/FooterSection';
import { AuthModal } from '@/components/hasab/AuthModal';
import { useApp } from '@/context/AppContext';

export default function Landing() {
const { showAuthModal, setShowAuthModal } = useApp();
  return (
    <div className="min-h-screen bg-black">
      <HeroSection />
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      <HowItWorks />
      <TrustSection />
      <PricingSection />
      <FooterSection />
    </div>
  );
}
