import { Lock, Globe, MapPin, Shield } from "lucide-react";

const badges = [
  { icon: Lock, title: "100% Free Forever", description: "No credit card needed. Ever." },
  { icon: Globe, title: "3 Languages", description: "Hindi, English, Telugu supported" },
  { icon: MapPin, title: "Made for India", description: "Built specifically for Indian scam patterns" },
  { icon: Shield, title: "Privacy First", description: "Your data is encrypted and auto-deleted" },
];

export function TrustSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Built on Trust, Not Hype
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {badges.map((badge) => (
            <div
              key={badge.title}
              className="flex flex-col items-center text-center p-6 bg-card rounded-xl border border-border hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <badge.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{badge.title}</h3>
              <p className="text-sm text-muted-foreground">{badge.description}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-muted-foreground max-w-xl mx-auto">
          We're just getting started. No fake numbers. No inflated claims. Just honest protection.
        </p>
      </div>
    </section>
  );
}
