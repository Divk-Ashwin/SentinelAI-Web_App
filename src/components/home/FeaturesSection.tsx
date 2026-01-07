import { Zap, Brain, Lock, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Zap,
    title: "Instant Analysis",
    description: "Get fraud detection results in seconds with our advanced AI. No waiting, no delays.",
  },
  {
    icon: Brain,
    title: "AI-Powered Detection",
    description: "Machine learning algorithms trained on millions of scam patterns from across India.",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "Your messages are analyzed securely and automatically deleted after 30 days.",
  },
  {
    icon: FileText,
    title: "Detailed Reports",
    description: "Understand threats with comprehensive analysis and actionable recommendations.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built specifically for protecting rural Indian communities from SMS fraud
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="group bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
