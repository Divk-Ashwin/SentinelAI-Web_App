import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16 pt-24 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: January 7, 2026</p>
        </div>

        <Card className="bg-card border-border">
          <CardContent className="p-8 prose prose-neutral dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Data Collection</h2>
              <p className="text-muted-foreground mb-4">
                SentinelAI collects minimal data necessary to provide our SMS fraud detection services:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>SMS message content you submit for analysis (temporarily stored)</li>
                <li>Sender phone numbers (anonymized after analysis)</li>
                <li>Account information (email, name) if you register</li>
                <li>Analysis history and preferences</li>
                <li>Device and browser information for service optimization</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">2. How We Use Your Data</h2>
              <p className="text-muted-foreground mb-4">
                Your data is used exclusively for:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Analyzing messages for fraud detection</li>
                <li>Improving our AI detection algorithms</li>
                <li>Providing personalized analysis history</li>
                <li>Sending important service updates (with consent)</li>
                <li>Generating anonymous statistics to fight fraud</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">3. Data Storage & Retention</h2>
              <p className="text-muted-foreground mb-4">
                We take data protection seriously:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Messages are encrypted during transmission and storage</li>
                <li>Analyzed messages are automatically deleted after 30 days</li>
                <li>Personal account data is retained until account deletion</li>
                <li>Anonymized data may be kept for research purposes</li>
                <li>Data is stored on secure servers in India</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Your Rights</h2>
              <p className="text-muted-foreground mb-4">
                You have the following rights regarding your data:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Access your personal data at any time</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Export your analysis history</li>
                <li>Opt out of non-essential communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Data Sharing</h2>
              <p className="text-muted-foreground mb-4">
                We do NOT share your personal data with third parties, except:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>When required by law or legal process</li>
                <li>To protect against fraud or security threats</li>
                <li>Anonymized, aggregated statistics (no personal identification)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Contact Us</h2>
              <p className="text-muted-foreground">
                For privacy-related inquiries, contact us at{" "}
                <a href="mailto:privacy@sentinelai.com" className="text-primary hover:underline">
                  privacy@sentinelai.com
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
