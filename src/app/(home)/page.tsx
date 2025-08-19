import HeroSection from "@/features/landing/components/HeroSection";
import { FeaturesSection } from "@/features/landing/components/FeaturesSection";
import { StatsSection } from "@/features/landing/components/StatsSection";
import { TestimonialsSection } from "@/features/landing/components/TestimonialsSection";
import { CTASection } from "@/features/landing/components/CTASection";
import { LeadFormSection } from "@/features/landing/components/LeadFormSection";
import { FooterSection } from "@/features/landing/components/FooterSection";

export default function HomePage() {
    return (
        <div className="min-h-screen">
            <HeroSection />
            <FeaturesSection />
            <StatsSection />
            <TestimonialsSection />
            <CTASection />
            <LeadFormSection />
            <FooterSection />
        </div>
    );
}
