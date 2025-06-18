import AboutFunnel from "@/components/landing-page/AboutFunnel";
import CTAForm from "@/components/landing-page/CtaForm";
import Footer from "@/components/landing-page/Footer";
import FunnelModel from "@/components/landing-page/FunnelModel";
import HeroSection from "@/components/landing-page/HeroSection";
import RatePlan from "@/components/landing-page/RatePlan";
import ServiceExample from "@/components/landing-page/ServiceExample";
import Target from "@/components/landing-page/Target";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1c1f2b] text-white">
      <HeroSection />
      <AboutFunnel />
      <FunnelModel />
      <ServiceExample />
      <Target />
      <RatePlan />
      <CTAForm />
      <Footer />
    </div>
  );
}
