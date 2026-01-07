import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle } from "lucide-react";

const benefits = [
  "Free forever",
  "No credit card required",
  "Analyze unlimited messages",
  "Multi-language support",
];

export function CTASection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-cta p-8 md:p-16">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-primary-foreground blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-primary-foreground blur-3xl" />
          </div>

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-foreground/20 mb-6">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Protect Yourself Today
            </h2>

            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8">
              Join thousands of users who are staying safe from SMS scams
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-2 text-primary-foreground/90"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>

            <Link to="/dashboard">
              <Button
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg px-10 py-6"
              >
                Get Started Free
              </Button>
            </Link>

            <p className="text-sm text-primary-foreground/70 mt-4">
              Join 10,000+ users protecting themselves from scams
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
