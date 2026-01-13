import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, Shield, Lock, Zap } from "lucide-react";

const faqSections = [
  {
    title: "General",
    icon: HelpCircle,
    questions: [
      {
        q: "How does SentinelAI work?",
        a: "Paste your message, our AI analyzes it in 3 seconds, you get a clear answer in your language.",
      },
      {
        q: "Is it really free?",
        a: "Yes. Completely free. No credit card, no hidden fees, forever. Funded by grants and donations.",
      },
      {
        q: "Which languages are supported?",
        a: "Hindi, English, and Telugu. More Indian languages coming soon.",
      },
      {
        q: "Do I need to create an account?",
        a: "No for trying the demo. Yes for saving your analysis history and accessing full features.",
      },
    ],
  },
  {
    title: "Privacy & Security",
    icon: Lock,
    questions: [
      {
        q: "Is my data safe?",
        a: "Yes. We encrypt all messages, automatically delete after 30 days, and never share with anyone.",
      },
      {
        q: "Can you read my messages?",
        a: "Our AI analyzes them automatically, but no human ever sees your messages.",
      },
      {
        q: "What do you do with uploaded screenshots?",
        a: "Same as text - analyze, encrypt, and auto-delete after 30 days. No human access.",
      },
    ],
  },
  {
    title: "Using SentinelAI",
    icon: Zap,
    questions: [
      {
        q: "How accurate is the detection?",
        a: "We're continuously improving. Our AI is trained on thousands of known scam patterns specific to India.",
      },
      {
        q: "What if it says my message is safe but I'm still unsure?",
        a: "Always trust your instinct. If something feels wrong, don't click links or share any personal information.",
      },
      {
        q: "Can I report incorrect results?",
        a: "Yes, please do. Use the feedback button in the analysis report to help us improve.",
      },
      {
        q: "What should I do if I already clicked a scam link?",
        a: "Act immediately: (1) Disconnect from internet, (2) Don't enter any information on the opened site, (3) Call your bank's fraud helpline, (4) Change all passwords, (5) Monitor your accounts for 48 hours, (6) Report to Cyber Crime: 1930",
      },
      {
        q: "Can I use this for WhatsApp or other app messages?",
        a: "Yes, paste any text message from any platform - SMS, WhatsApp, Telegram, Facebook, email.",
      },
    ],
  },
];

export default function Help() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">Help Center</h1>
              <p className="text-muted-foreground">
                Find answers to common questions about SentinelAI
              </p>
            </div>

            {/* FAQ Sections */}
            <div className="space-y-8">
              {faqSections.map((section) => (
                <Card key={section.title} className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <section.icon className="h-5 w-5 text-primary" />
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {section.questions.map((item, index) => (
                        <AccordionItem key={index} value={`${section.title}-${index}`}>
                          <AccordionTrigger className="text-left text-foreground">
                            {item.q}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            {item.a}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact */}
            <Card className="bg-primary/5 border-primary/20 mt-12">
              <CardContent className="p-6 text-center">
                <p className="text-foreground mb-2">Still have questions?</p>
                <a 
                  href="mailto:support@sentinelai.com" 
                  className="text-primary hover:underline font-medium"
                >
                  Email us: support@sentinelai.com
                </a>
                <p className="text-sm text-muted-foreground mt-2">
                  Response time: Usually within 24 hours
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
