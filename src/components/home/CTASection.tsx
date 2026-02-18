import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function CTASection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const handleClick = () => {
    if (isAuthenticated) {
      navigate("/analyze");
    } else {
      navigate("/demo");
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-8 md:p-16 shadow-2xl">
          {/* Animated radar pulse behind headline */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-20">
            <div className="w-64 h-64 rounded-full border-2 border-white animate-ping" style={{ animationDuration: "3s" }} />
            <div className="absolute w-48 h-48 rounded-full border-2 border-white animate-ping" style={{ animationDuration: "3s", animationDelay: "1s" }} />
            <div className="absolute w-32 h-32 rounded-full border-2 border-white animate-ping" style={{ animationDuration: "3s", animationDelay: "2s" }} />
          </div>

          {/* Background blobs */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-white blur-3xl" />
          </div>

          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 mb-6">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Protect Yourself Today
            </h2>

            <p className="text-lg text-white/90 mb-8">
              Don't wait until it's too late. Check your messages now.
            </p>

            <Button
              size="lg"
              onClick={handleClick}
              className="bg-white text-primary hover:bg-white/90 text-lg px-10 py-6 rounded-full font-bold transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl"
            >
              <ShieldCheck className="mr-2 h-5 w-5" />
              Analyze a Message Free
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
