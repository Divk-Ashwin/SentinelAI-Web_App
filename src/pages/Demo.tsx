import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Search, Calendar, Clock, Phone, MessageSquare, Languages, Loader2, Info, CheckCircle, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import { AnalysisReport } from "@/components/dashboard/AnalysisReport";
import { AIChatbot } from "@/components/dashboard/AIChatbot";
import type { AnalysisResult } from "@/pages/Analyze";

// Sample scam message for demo
const SAMPLE_MESSAGE = {
  phone: "+91 8076543210",
  message: "URGENT: Your SBI account has been temporarily suspended due to KYC verification pending. Click here to verify immediately: bit.ly/sbi-kyc-2024 or your account will be closed within 24 hours. Customer care: 1800-XXXX",
};

export default function Demo() {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [demoCount, setDemoCount] = useState(() => {
    const count = localStorage.getItem('demoAnalysisCount');
    return count ? parseInt(count) : 0;
  });
  const resultRef = useRef<HTMLDivElement>(null);
  
  const [phoneValid, setPhoneValid] = useState<boolean | null>(true);
  const [phoneError, setPhoneError] = useState("");
  
  const [formData, setFormData] = useState({
    language: "english",
    phone: SAMPLE_MESSAGE.phone,
    message: SAMPLE_MESSAGE.message,
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
  });

  const loadingMessages = [
    "Analyzing message content...",
    "Checking sender reputation...",
    "Scanning for malicious links...",
    "Generating risk report...",
  ];

  // Phone number validation
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleaned = value.replace(/[^\d+]/g, '');
    let formattedPhone = cleaned;
    if (cleaned.length > 0 && !cleaned.startsWith('+')) {
      formattedPhone = '+' + cleaned;
    }
    if (formattedPhone.length > 1) {
      formattedPhone = '+' + formattedPhone.slice(1).replace(/\+/g, '');
    }
    formattedPhone = formattedPhone.slice(0, 16);
    
    setFormData({ ...formData, phone: formattedPhone });
    
    if (formattedPhone.length === 0) {
      setPhoneValid(null);
    } else if (/^\+\d{10,15}$/.test(formattedPhone)) {
      setPhoneValid(true);
    } else {
      setPhoneValid(false);
    }
  };

  const analyzeMessage = async () => {
    if (demoCount >= 3) {
      toast({
        title: "Demo limit reached",
        description: "Sign up to continue analyzing messages",
        variant: "destructive",
      });
      return;
    }

    if (!formData.phone || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in the required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    for (let i = 0; i < loadingMessages.length; i++) {
      setLoadingMessage(loadingMessages[i]);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    // Mock analysis - high risk for the sample
    const result: AnalysisResult = {
      riskScore: 92,
      riskLevel: "high",
      confidence: 94,
      verdict: "This message is likely a smishing attempt",
      action: "Do NOT click links or share personal information",
      threats: [
        { title: "Suspicious Link Detected", description: "Contains shortened URL (bit.ly)", severity: "high" },
        { title: "Urgency Tactics", description: "Creates artificial time pressure (24 hours)", severity: "high" },
        { title: "Bank Impersonation", description: "Pretends to be from SBI", severity: "high" },
        { title: "KYC Scam Pattern", description: "Matches known KYC fraud pattern", severity: "high" },
      ],
      senderAnalysis: {
        phone: formData.phone,
        inContacts: false,
        reportCount: 47,
        isNew: true,
      },
      contentAnalysis: {
        hasLinks: true,
        linkDomain: "bit.ly (suspicious)",
        hasUrgency: true,
        grammarScore: 5,
        keywords: ["urgent", "suspended", "verify", "KYC", "24 hours"],
      },
      recommendations: {
        do: [
          "Delete this message immediately",
          "Block the sender number",
          "Tell 3 friends about this scam",
          "If concerned about KYC, visit your bank branch directly",
        ],
        dont: [
          "Don't click the bit.ly link",
          "Don't call the provided number",
          "Don't share any personal information",
          "Don't enter banking credentials anywhere",
        ],
      },
    };

    setAnalysisResult(result);
    setIsAnalyzing(false);
    setLoadingMessage("");
    
    const newCount = demoCount + 1;
    setDemoCount(newCount);
    localStorage.setItem('demoAnalysisCount', newCount.toString());

    toast({
      title: "Analysis Complete",
      description: `Risk Level: HIGH (92/100)`,
    });

    setTimeout(() => {
      if (resultRef.current) {
        const navbarHeight = 80;
        const elementPosition = resultRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }, 200);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        {/* Demo Banner */}
        <div className="bg-primary/10 border-b border-primary/20">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                <p className="text-sm text-foreground">
                  This is a demo with a sample message. Sign up to analyze your own messages.
                </p>
              </div>
              <Button 
                size="sm" 
                onClick={() => navigate("/auth?tab=register")}
                className="bg-gradient-primary"
              >
                Sign Up Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Analysis Form */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Try Demo Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Demo remaining */}
                {demoCount < 3 && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      {3 - demoCount} demo {3 - demoCount === 1 ? 'analysis' : 'analyses'} remaining. Sign up for unlimited access.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Language Selection */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Languages className="h-4 w-4" />
                    Select Language
                  </Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value) => setFormData({ ...formData, language: value })}
                  >
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                      <SelectItem value="telugu">తెలుగు (Telugu)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Sender's Number
                  </Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className={phoneValid ? "border-success" : ""}
                    />
                    {phoneValid && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-success" />
                    )}
                  </div>
                </div>

                {/* Message Content */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Message Text
                  </Label>
                  <Textarea
                    id="message"
                    className="min-h-[120px]"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date
                    </Label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="[&::-webkit-calendar-picker-indicator]:dark:invert"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Time
                    </Label>
                    <Input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="[&::-webkit-calendar-picker-indicator]:dark:invert"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  size="lg"
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={analyzeMessage}
                  disabled={isAnalyzing || demoCount >= 3}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      {loadingMessage}
                    </>
                  ) : demoCount >= 3 ? (
                    "Sign up to continue"
                  ) : (
                    <>
                      <Search className="h-5 w-5 mr-2" />
                      Analyze This Sample
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Analysis Result */}
            {analysisResult && (
              <div ref={resultRef} className="mt-8 animate-fade-in-up">
                <AnalysisReport result={analysisResult} language={formData.language} />
                <div className="mt-8">
                  <AIChatbot result={analysisResult} language={formData.language} messageContent={formData.message} />
                </div>
                
                {/* CTA */}
                <Card className="mt-8 bg-primary/5 border-primary/20">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Want to analyze your own messages?
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Sign up for free to protect yourself from SMS scams.
                    </p>
                    <Button 
                      size="lg"
                      onClick={() => navigate("/auth?tab=register")}
                      className="bg-gradient-primary"
                    >
                      Sign Up Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
