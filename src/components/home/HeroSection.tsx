import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowRight, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function HeroSection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const handleAnalyzeClick = () => {
    if (isAuthenticated) {
      navigate("/analyze");
    } else {
      navigate("/demo");
    }
  };

  return (
    <section id="hero" className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-hero">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 animate-fade-in-up">
            {/* Stat callout */}
            <div className="inline-flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <span className="text-5xl font-extrabold tabular-nums text-primary leading-none">₹1,200 Cr</span>
              <span className="text-sm text-white/60 max-w-[160px] leading-tight">lost to SMS scams last year in India</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white">
              Stop Scammers.{" "}
              <span className="text-gradient">Protect Your Money.</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/70 max-w-xl">
              Paste any suspicious message. Our AI checks it in 3 seconds. Get clear answers in Hindi, English, or Telugu. Completely free.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-primary hover:opacity-90 text-white text-base sm:text-lg px-8 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                onClick={handleAnalyzeClick}
              >
                <ShieldCheck className="mr-2 h-5 w-5" />
                Analyze a Message
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-base sm:text-lg px-8 rounded-full border-white/30 text-white hover:bg-white/10 transition-all duration-200 hover:scale-105 active:scale-95 group"
                onClick={() => navigate("/about")}
              >
                See How It Works
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Mock SMS Card */}
          <div className="relative flex justify-center items-center animate-float">
            <div className="relative">
              {/* Floating badges */}
              <div className="absolute -left-6 top-6 z-10 flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg animate-pulse-slow">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-xs font-medium text-white">✅ Safe Message</span>
              </div>
              <div className="absolute -right-6 top-1/3 z-10 flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg animate-pulse-slow" style={{ animationDelay: "1s" }}>
                <ShieldCheck className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium text-white">🛡️ AI Protected</span>
              </div>
              <div className="absolute -left-4 bottom-8 z-10 flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg animate-pulse-slow" style={{ animationDelay: "2s" }}>
                <Zap className="h-3 w-3 text-warning" />
                <span className="text-xs font-medium text-white">⚡ 3 Seconds</span>
              </div>

              {/* Phone card */}
              <div className="w-72 sm:w-80 bg-white/5 backdrop-blur-md border border-white/15 rounded-3xl p-5 shadow-2xl">
                {/* Phone header */}
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-lg">📱</span>
                  </div>
                  <div>
                    <p className="text-xs text-white/50">SMS from</p>
                    <p className="text-sm font-semibold text-white">+91-XXXXXXXXXX</p>
                  </div>
                  <div className="ml-auto text-xs text-white/40">2:34 PM</div>
                </div>

                {/* Message bubble */}
                <div className="bg-white/8 rounded-2xl rounded-tl-none p-4 mb-4">
                  <p className="text-sm text-white/80 leading-relaxed">
                    "Dear customer, your <span className="text-warning font-semibold">SBI account will be blocked</span> unless you verify your KYC immediately. Click here: bit.ly/sbi-kyc-upd"
                  </p>
                </div>

                {/* Scam detected badge */}
                <div className="bg-gradient-danger rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⚠️</span>
                    <div>
                      <p className="text-sm font-bold text-white">SCAM DETECTED</p>
                      <p className="text-xs text-white/70">Phishing attempt</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-extrabold text-white tabular-nums">92</p>
                    <p className="text-xs text-white/70">/100 risk</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
