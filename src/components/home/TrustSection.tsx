import { Lock, Globe, MapPin, Shield, Phone } from "lucide-react";

const badges = [
  { icon: Lock, title: "100% Free Forever", description: "No credit card needed. Ever." },
  { icon: Globe, title: "3 Languages", description: "Hindi, English, Telugu supported" },
  { icon: MapPin, title: "Made for India", description: "Built specifically for Indian scam patterns" },
  { icon: Shield, title: "Privacy First", description: "Your data is encrypted and auto-deleted" },
];

export function TrustSection() {
  return (
    <section className="py-16 bg-gradient-cta">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Built on Trust, Not Hype
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {badges.map((badge) => (
            <div
              key={badge.title}
              className="flex flex-col items-center text-center p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <badge.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-white mb-1">{badge.title}</h3>
              <p className="text-sm text-white/60">{badge.description}</p>
            </div>
          ))}
        </div>

        {/* India Cyber Crime Helpline badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-3 bg-accent/20 border border-accent/40 rounded-2xl px-6 py-3">
            <Phone className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm font-bold text-accent">India Cyber Crime Helpline</p>
              <p className="text-xl font-extrabold text-white tracking-wider">1930</p>
            </div>
          </div>
        </div>

        <p className="text-center text-white/50 max-w-xl mx-auto text-sm">
          We're just getting started. No fake numbers. No inflated claims. Just honest protection.
        </p>
      </div>
    </section>
  );
}
