import { Upload, Scan, ShieldCheck, ChevronDown } from "lucide-react";

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
    <section id="how-it-works" className="py-20 bg-gradient-cta">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Simple 3-Step Protection
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Protecting yourself from smishing has never been easier
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.number}>
              <div className="flex gap-6 items-start group">
                {/* Step number circle */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-extrabold text-lg">{index + 1}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-0.5 h-12 border-l-2 border-dashed border-primary/30 my-2" />
                  )}
                </div>

                {/* Step card */}
                <div className="flex-1 bg-card/10 backdrop-blur border border-white/10 rounded-2xl border-l-4 border-l-primary p-5 mb-2 hover:bg-card/20 transition-colors duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <step.icon className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed pl-11">
                    {step.description}
                  </p>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="flex justify-start pl-5 mb-2">
                  <ChevronDown className="h-5 w-5 text-primary/40" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
