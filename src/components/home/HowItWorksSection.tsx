import { Upload, Scan, ShieldCheck, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Submit Your Message",
    description: "Paste the message text or upload a screenshot of the suspicious SMS you received.",
  },
  {
    number: "02",
    icon: Scan,
    title: "AI Analyzes Instantly",
    description: "Our AI scans for fraud patterns, malicious links, and known scam techniques in seconds.",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Get Risk Assessment",
    description: "Receive a detailed report with risk score and actionable recommendations to stay safe.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Simple 3-Step Protection
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Protecting yourself from smishing has never been easier
          </p>
        </div>

        <div className="relative">
          {/* Connection line - desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 transform -translate-y-1/2" />

          <div className="grid md:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Step number badge */}
                <div className="relative z-10 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <step.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-card border-2 border-primary flex items-center justify-center text-sm font-bold text-primary">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground max-w-xs">
                  {step.description}
                </p>

                {/* Arrow - desktop only */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute right-0 top-10 transform translate-x-1/2">
                    <ArrowRight className="h-6 w-6 text-primary/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
