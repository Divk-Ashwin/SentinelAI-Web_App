import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Terms & Conditions</h1>
          <p className="text-muted-foreground">Last updated: January 7, 2026</p>
        </div>

        <Card className="bg-card border-border">
          <CardContent className="p-8 prose prose-neutral dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing or using SentinelAI, you agree to be bound by these Terms and Conditions.
                If you do not agree with any part of these terms, you may not use our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Service Description</h2>
              <p className="text-muted-foreground mb-4">
                SentinelAI provides AI-powered SMS fraud detection services. Our platform:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Analyzes suspicious SMS messages for potential fraud</li>
                <li>Provides risk assessments and recommendations</li>
                <li>Offers educational resources about SMS scams</li>
                <li>Supports multiple Indian languages (Hindi, English, Telugu)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">3. User Responsibilities</h2>
              <p className="text-muted-foreground mb-4">
                Users agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Provide accurate information when registering</li>
                <li>Not misuse the service for illegal activities</li>
                <li>Not submit content that violates others' rights</li>
                <li>Keep account credentials secure</li>
                <li>Report any security vulnerabilities responsibly</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Service Limitations</h2>
              <p className="text-muted-foreground mb-4">
                Please understand that:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Our AI detection is highly accurate but not infallible</li>
                <li>Analysis results are recommendations, not guarantees</li>
                <li>We cannot guarantee prevention of all fraud losses</li>
                <li>The service may be temporarily unavailable for maintenance</li>
                <li>Features may change without prior notice</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground">
                SentinelAI is provided "as is" without warranties of any kind. We do not guarantee
                that the service will be error-free, uninterrupted, or meet your specific requirements.
                Users rely on analysis results at their own discretion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                SentinelAI shall not be liable for any indirect, incidental, special, or consequential
                damages arising from use of the service. Our total liability is limited to the amount
                paid by you for the service (if any) in the preceding 12 months.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">7. Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms shall be governed by the laws of India. Any disputes shall be subject
                to the exclusive jurisdiction of courts in Hyderabad, Telangana.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">8. Contact</h2>
              <p className="text-muted-foreground">
                For questions about these Terms, contact us at{" "}
                <a href="mailto:legal@sentinelai.com" className="text-primary hover:underline">
                  legal@sentinelai.com
                </a>
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
