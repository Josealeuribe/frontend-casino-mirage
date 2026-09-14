import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import HowItWorksSection from "./components/HowItWorksSection";
import PrizesSection from "./components/PrizesSection";
import FAQSection from "./components/FAQSection";
import LoginModal from "@/features/auth/LoginModal";
import { useAuth } from "@/features/auth/AuthContext";
import logoMirage from "@/imports/logo-mirage.png";

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

      <footer
        className="py-10 px-6 text-center"
        style={{ borderTop: "1px solid rgba(107,50,214,0.12)" }}
      >
        <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
          <img src={logoMirage} alt="Mirage Casino" className="h-12 w-auto object-contain opacity-70" />
          <p className="text-xs" style={{ color: "rgba(237,232,252,0.25)" }}>
            © 2026 Mirage Casino · Todos los derechos reservados
          </p>
          <p className="text-xs" style={{ color: "rgba(237,232,252,0.18)" }}>
            Juega con responsabilidad · Mayor de 18 años
          </p>
        </div>
      </footer>

      {isLoginOpen && <LoginModal />}
    </div>
  );
}
