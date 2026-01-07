import { Card, CardContent } from "@/components/ui/card";
import { Languages, Check } from "lucide-react";

const languages = [
  { name: "Hindi", native: "हिंदी", flag: "🇮🇳", status: "Full analysis and chat support" },
  { name: "English", native: "English", flag: "🇬🇧", status: "Comprehensive reports" },
  { name: "Telugu", native: "తెలుగు", flag: "🇮🇳", status: "Complete language support" },
];

const comingSoon = ["Tamil", "Kannada", "Marathi", "Bengali", "Gujarati"];

export function LanguageSupportSection() {
  return (
    <section id="languages" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Languages className="h-4 w-4" />
            Multilingual Support
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Analysis in Your Language 🗣️
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Understanding threats shouldn't require knowing English. SentinelAI provides 
            complete fraud analysis in your preferred language.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {languages.map((lang) => (
            <Card key={lang.name} className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">{lang.flag}</div>
                <h3 className="text-xl font-bold text-foreground mb-1">{lang.native}</h3>
                <p className="text-sm text-primary font-medium mb-2">{lang.name}</p>
                <div className="flex items-center justify-center gap-2 text-success text-sm">
                  <Check className="h-4 w-4" />
                  {lang.status}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4 flex items-center justify-center gap-2">
            📚 More regional languages coming soon:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {comingSoon.map((lang) => (
              <span 
                key={lang} 
                className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
