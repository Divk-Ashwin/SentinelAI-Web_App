import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function CTASection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleClick = () => {
    if (isAuthenticated) {
      navigate("/analyze");
    } else {
      navigate("/demo");
    }
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-cta p-8 md:p-16">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-primary-foreground blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-primary-foreground blur-3xl" />
          </div>

          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-foreground/20 mb-6">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Protect Yourself Today
            </h2>

            <p className="text-lg text-primary-foreground/90 mb-8">
              Don't wait until it's too late. Check your messages now.
            </p>

            <Button
              size="lg"
              onClick={handleClick}
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg px-10 py-6"
            >
              Analyze a Message Free
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
