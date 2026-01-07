import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, Users, Target, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-illustration.png";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

const trustIndicators = [
  { icon: Users, label: "10,000+", sublabel: "Messages Analyzed" },
  { icon: Target, label: "98%", sublabel: "Accuracy" },
  { icon: Shield, label: "Free", sublabel: "Forever" },
];

export function HeroSection() {
  const navigate = useNavigate();
  const { isAuthenticated, setRedirectPath } = useAuth();

  const handleDownload = () => {
    toast({
      title: "Coming Soon! 📱",
      description: "Our mobile app is under development. Stay tuned!",
      duration: 3000,
    });
  };

  const handleAnalyzeClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      setRedirectPath("/dashboard");
      toast({
        title: "Please login first",
        description: "You need to be logged in to analyze messages",
        duration: 3000,
      });
      navigate("/auth");
    }
  };

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <MapPin className="h-4 w-4" />
              Protecting the Unprotected
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Rural India Deserves{" "}
              <span className="text-gradient">Protection from SMS Fraud</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl">
              Every day, thousands of rural Indians lose their hard-earned money to fake SMS messages. 
              SentinelAI uses AI to detect scams instantly—in your language, for free, forever.
            </p>

            {/* Stats callout */}
            <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <span className="text-destructive text-2xl font-bold">₹1,200 Cr</span>
              <span className="text-sm text-muted-foreground">lost by rural Indians to SMS scams annually</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-primary hover:opacity-90 transition-opacity text-base sm:text-lg px-8"
                onClick={handleAnalyzeClick}
              >
                Analyze a Message Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto text-base sm:text-lg px-8"
                onClick={handleDownload}
              >
                Download Mobile App
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 sm:gap-8 pt-8 border-t border-border/50">
              {trustIndicators.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.sublabel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative hidden lg:block animate-float">
            <div className="relative">
              <img
                src={heroImage}
                alt="SentinelAI SMS Protection"
                className="w-full max-w-lg mx-auto rounded-2xl shadow-2xl"
              />
              {/* Floating badges */}
              <div className="absolute -left-4 top-1/4 p-3 bg-card rounded-xl shadow-lg border border-border animate-pulse-slow">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
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
