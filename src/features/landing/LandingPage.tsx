import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import HowItWorksSection from "./components/HowItWorksSection";
import PrizesSection from "./components/PrizesSection";
import FAQSection from "./components/FAQSection";
import Footer from "@/shared/components/Footer";
import LoginModal from "@/features/auth/LoginModal";
import { useAuth } from "@/features/auth/AuthContext";

export default function LandingPage() {
  const { isLoginOpen } = useAuth();

  return (
    <div style={{ background: "#080718", minHeight: "100vh" }}>
      <Navbar />
      {/* id="gira-y-gana" maps to HeroSection since that's the promo */}
      <div id="gira-y-gana">
        <HeroSection />
      </div>
      <HowItWorksSection />
      <PrizesSection />
      <FAQSection />
      <Footer />

      {isLoginOpen && <LoginModal />}
    </div>
  );
}
