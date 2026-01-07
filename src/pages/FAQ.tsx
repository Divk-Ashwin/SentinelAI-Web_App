import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  { q: "What is smishing and how does it work?", a: "Smishing is SMS phishing - fraudulent text messages designed to steal personal information or money. Scammers impersonate banks, government agencies, or companies to trick you into clicking malicious links or sharing sensitive data." },
  { q: "How accurate is your detection system?", a: "Our AI achieves 98% accuracy by analyzing millions of scam patterns. We continuously train on new fraud techniques reported across India." },
  { q: "Is this service really free?", a: "Yes! SecureChat is completely free. Our mission is protecting rural India from SMS fraud, not profit." },
  { q: "What languages are supported?", a: "We support English, Hindi (हिंदी), and Telugu (తెలుగు). More regional languages coming soon!" },
  { q: "Is my data secure and private?", a: "Absolutely. Messages are encrypted, analyzed securely, and automatically deleted after 30 days. We never share your data." },
  { q: "What should I do if I already fell for a scam?", a: "Act immediately: 1) Call your bank to freeze accounts, 2) Report to Cyber Crime Helpline 1930, 3) Change all passwords, 4) File complaint at cybercrime.gov.in" },
];

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">Find answers to common questions about SecureChat</p>
        </div>
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="bg-card border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left font-medium">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
      <Footer />
    </div>
  );
}
