import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-illustration.png";
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
    <section id="hero" className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Stop Scammers.{" "}
              <span className="text-gradient">Protect Your Money.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl">
              Last year, rural Indians lost ₹1,200 Crores to fake SMS messages. We built SentinelAI to stop this.
            </p>

            <p className="text-base text-muted-foreground max-w-xl">
              Paste any suspicious message. Our AI checks it in 3 seconds. Get clear answers in Hindi, English, or Telugu. Completely free.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground text-base sm:text-lg px-8"
                onClick={handleAnalyzeClick}
              >
                Analyze a Message
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto text-base sm:text-lg px-8 group"
                onClick={() => navigate("/about")}
              >
                See How It Works
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative hidden lg:block animate-float">
            <div className="relative">
              <img
                src={heroImage}
                alt="SentinelAI SMS Protection"
                className="w-full max-w-lg mx-auto rounded-2xl shadow-2xl"
                loading="eager"
              />
              {/* Floating badges */}
              <div className="absolute -left-4 top-1/4 p-3 bg-card rounded-xl shadow-lg border border-border animate-pulse-slow">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="text-sm font-medium">Safe Message</span>
                </div>
              </div>
              <div className="absolute -right-4 bottom-1/4 p-3 bg-card rounded-xl shadow-lg border border-border animate-pulse-slow" style={{ animationDelay: "1.5s" }}>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">AI Protected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
