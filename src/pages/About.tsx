import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Shield, Target, Users, Lightbulb, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function About() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message Sent!", description: "We'll respond within 24 hours." });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        {/* Mission */}
        <section className="max-w-3xl mx-auto text-center mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-6">Our Mission</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Empowering every Indian to identify and prevent SMS fraud through accessible AI technology.
          </p>
        </section>

        {/* Story */}
        <section className="max-w-3xl mx-auto mb-20">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: Target, title: "The Problem", desc: "SMS fraud costs Indians ₹1,750+ crores annually, with rural communities most affected." },
              { icon: Lightbulb, title: "Our Solution", desc: "AI-powered detection that works in Hindi, English & Telugu - free and accessible to all." },
              { icon: Users, title: "Our Impact", desc: "10,000+ messages analyzed, protecting thousands from financial loss." },
            ].map((item) => (
              <Card key={item.title} className="bg-card border-border text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">Get in Touch</h2>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label>Name</Label><Input placeholder="Your name" required /></div>
                  <div><Label>Email</Label><Input type="email" placeholder="you@example.com" required /></div>
                </div>
                <div><Label>Message</Label><Textarea placeholder="How can we help?" required /></div>
                <Button type="submit" className="w-full bg-gradient-primary">
                  <Mail className="h-4 w-4 mr-2" /> Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
}
