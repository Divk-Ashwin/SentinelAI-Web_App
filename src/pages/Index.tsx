import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { LanguageSupportSection } from "@/components/home/LanguageSupportSection";
import { StatisticsSection } from "@/components/home/StatisticsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <main className="overflow-x-hidden">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <LanguageSupportSection />
        <StatisticsSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
