import { Zap, Languages, Globe, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Zap,
    title: "3-Second Analysis",
    description: "Paste message, get answer instantly. No waiting, no hassle.",
  },
  {
    icon: Languages,
    title: "Speaks Your Language",
    description: "Full analysis in Hindi, English, or Telugu. Simple words, clear explanations.",
  },
  {
    icon: Globe,
    title: "Built for Rural India",
    description: "Designed for everyone. No tech knowledge needed. Free forever.",
  },
  {
    icon: Lock,
    title: "Private & Secure",
    description: "Your messages stay private. We delete them after 30 days. No tracking, no ads.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why SentinelAI?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="group bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border"
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
