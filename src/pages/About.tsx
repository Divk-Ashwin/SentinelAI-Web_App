import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, 
  Target, 
  Users, 
  Zap,
  Globe,
  Lock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Phone,
  Mail
} from "lucide-react";

export default function About() {
  const stats = [
    { value: "₹1,247 Cr", label: "Lost to SMS fraud in India (2023)", source: "Cyber Crime Reports" },
    { value: "67%", label: "Of victims live in rural areas" },
    { value: "89%", label: "Year-over-year increase in smishing" },
    { value: "₹47,000", label: "Average victim loss (often life savings)" },
  ];

  const additionalStats = [
    "Only 23% of scams are reported to authorities",
    "78% of rural Indians cannot identify common scam patterns",
    "43% of victims don't seek help due to shame",
    "Banking scams account for 43% of all SMS fraud",
  ];

  const whyRuralTargeted = [
    "Limited digital literacy and scam awareness",
    "Language barriers (scam warnings only in English)",
    "Trust in official-looking messages",
    "Less access to fraud education resources",
    "Delayed reporting allows scammers to operate longer",
  ];

  const howItWorks = [
    { step: "1", title: "Paste Message", desc: "Copy the suspicious message text" },
    { step: "2", title: "AI Analysis", desc: "We check 47 known fraud patterns" },
    { step: "3", title: "Get Verdict", desc: "Clear answer: Safe, Suspicious, or Scam" },
    { step: "4", title: "Take Action", desc: "Simple steps in your language" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Why We Built This
            </h1>
          </div>
        </section>

        {/* The Story */}
        <section className="container mx-auto px-4 pb-16">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Every week, thousands of rural Indians receive SMS messages that look real but aren't.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                A message claiming their Aadhaar is expiring. A fake bank alert saying their account will be closed. 
                A lottery they never entered. A government scheme that doesn't exist.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                These messages are designed to create panic. They use official-sounding language. 
                They threaten consequences. They demand immediate action.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                <strong className="text-foreground">And they work.</strong>
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                In 2023 alone, Indians lost over ₹1,200 Crores to SMS fraud. Most victims are from rural areas. 
                Many lose their entire life savings. The average loss is ₹47,000—money that can't be recovered.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Scammers know that rural communities have limited access to fraud education. Many people don't speak English, 
                where most scam warnings are published. The digital divide makes them vulnerable.
              </p>
              <p className="text-lg text-foreground font-medium">
                We built SentinelAI because everyone deserves protection, regardless of where they live or what language they speak.
              </p>
            </div>
          </div>
        </section>

        {/* The Problem - Stats */}
        <section className="bg-secondary/30 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-destructive/10 mb-4">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">The Problem Is Real</h2>
              <p className="text-muted-foreground">The reality of SMS fraud in India</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-card border-border text-center">
                  <CardContent className="p-6">
                    <p className="text-3xl font-bold text-primary mb-2">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    {stat.source && (
                      <p className="text-xs text-muted-foreground/60 mt-2">Source: {stat.source}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-destructive" />
                    More Alarming Facts
                  </h3>
                  <ul className="space-y-3">
                    {additionalStats.map((stat, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-destructive mt-1">•</span>
                        {stat}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-accent" />
                    Why Rural Areas Are Targeted
                  </h3>
                  <ul className="space-y-3">
                    {whyRuralTargeted.map((reason, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-accent mt-1">•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Solution */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-success/10 mb-4">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Solution</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple, free, and accessible protection for everyone
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Zap, title: "3-Second Analysis", desc: "Free AI that analyzes messages instantly" },
              { icon: Globe, title: "Hindi, English, Telugu", desc: "Works in your language (more coming)" },
              { icon: Users, title: "Built for Everyone", desc: "No tech knowledge needed" },
              { icon: Lock, title: "Privacy First", desc: "Messages encrypted and deleted after 30 days" },
              { icon: Target, title: "India-Specific", desc: "Trained on Indian scam patterns" },
              { icon: Shield, title: "Free Forever", desc: "No ads, no tracking, no hidden costs" },
            ].map((feature, index) => (
              <Card key={index} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-secondary/30 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
              <p className="text-muted-foreground">Four simple steps to protect yourself</p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {howItWorks.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="max-w-3xl mx-auto mt-12 text-center">
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4">
                    Our AI scans phone numbers, links, sender details, and message content. 
                    It compares against a database of reported scams, analyzes urgency language, threats, 
                    and information requests. Then gives you a clear verdict with explanation.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">47 fraud patterns</strong> specific to India are checked in every analysis.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Make SMS fraud detection accessible to every Indian, regardless of language, location, 
              or technical knowledge. Protect the most vulnerable communities from losing money they can't afford to lose. 
              Build awareness through education, not fear.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-secondary/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-foreground mb-6">Get in Touch</h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <a 
                  href="mailto:contact@sentinelai.com" 
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  contact@sentinelai.com
                </a>
                <a 
                  href="/contact" 
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  Contact Form
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}