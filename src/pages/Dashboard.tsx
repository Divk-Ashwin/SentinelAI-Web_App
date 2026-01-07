import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Search, History, Settings, LogOut, Upload, Calendar, Clock, Phone, MessageSquare, Languages, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "@/hooks/use-toast";
import { AnalysisReport } from "@/components/dashboard/AnalysisReport";
import { AnalysisHistory } from "@/components/dashboard/AnalysisHistory";
import { AIChatbot } from "@/components/dashboard/AIChatbot";

export interface AnalysisResult {
  riskScore: number;
  riskLevel: "low" | "medium" | "high";
  confidence: number;
  verdict: string;
  action: string;
  threats: {
    title: string;
    description: string;
    severity: "high" | "medium" | "low";
  }[];
  senderAnalysis: {
    phone: string;
    inContacts: boolean;
    reportCount: number;
    isNew: boolean;
  };
  contentAnalysis: {
    hasLinks: boolean;
    linkDomain?: string;
    hasUrgency: boolean;
    grammarScore: number;
    keywords: string[];
  };
  recommendations: {
    do: string[];
    dont: string[];
  };
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("analyze");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("");
  
  const [formData, setFormData] = useState({
    language: "english",
    phone: "",
    message: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
    category: "banking",
    inContacts: false,
  });

  const loadingMessages = [
    "Analyzing message content...",
    "Checking sender reputation...",
    "Scanning for malicious links...",
    "Detecting scam patterns...",
    "Generating risk report...",
  ];

  const analyzeMessage = async () => {
    if (!formData.phone || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in the sender phone number and message content.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Simulate loading with messages
    for (let i = 0; i < loadingMessages.length; i++) {
      setLoadingMessage(loadingMessages[i]);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Mock analysis result
    const message = formData.message.toLowerCase();
    const hasUrl = message.includes("http") || message.includes("bit.ly") || message.includes("link");
    const hasUrgency = message.includes("urgent") || message.includes("immediate") || message.includes("expire") || message.includes("block");
    const hasOTP = message.includes("otp") || message.includes("pin") || message.includes("password");
    const hasMoney = message.includes("₹") || message.includes("lakhs") || message.includes("prize") || message.includes("won");
    
    let riskScore = 20;
    if (hasUrl) riskScore += 25;
    if (hasUrgency) riskScore += 20;
    if (hasOTP) riskScore += 25;
    if (hasMoney) riskScore += 15;
    if (!formData.inContacts) riskScore += 10;
    riskScore = Math.min(riskScore, 100);

    const riskLevel: "low" | "medium" | "high" = riskScore < 35 ? "low" : riskScore < 65 ? "medium" : "high";

    const result: AnalysisResult = {
      riskScore,
      riskLevel,
      confidence: 85 + Math.floor(Math.random() * 10),
      verdict: riskLevel === "high" 
        ? "This message is likely a smishing attempt" 
        : riskLevel === "medium"
        ? "This message shows some suspicious characteristics"
        : "This message appears to be legitimate",
      action: riskLevel === "high"
        ? "Do NOT click links or share personal information"
        : riskLevel === "medium"
        ? "Verify the sender through official channels before responding"
        : "Safe to proceed, but always stay vigilant",
      threats: [
        ...(hasUrl ? [{ title: "Suspicious Link Detected", description: "The message contains a shortened or suspicious URL", severity: "high" as const }] : []),
        ...(hasUrgency ? [{ title: "Urgency Tactics Detected", description: "The message creates artificial time pressure", severity: "high" as const }] : []),
        ...(hasOTP ? [{ title: "Information Request (Red Flag)", description: "Asks for sensitive information like OTP/PIN", severity: "high" as const }] : []),
        ...(!formData.inContacts ? [{ title: "Unknown Sender", description: "Number not in your contacts", severity: "medium" as const }] : []),
      ],
      senderAnalysis: {
        phone: formData.phone,
        inContacts: formData.inContacts,
        reportCount: riskScore > 50 ? Math.floor(Math.random() * 50) + 10 : 0,
        isNew: riskScore > 60,
      },
      contentAnalysis: {
        hasLinks: hasUrl,
        linkDomain: hasUrl ? "suspicious-domain.xyz" : undefined,
        hasUrgency,
        grammarScore: 6 + Math.floor(Math.random() * 4),
        keywords: [
          ...(hasUrl ? ["link", "click"] : []),
          ...(hasUrgency ? ["urgent", "immediate"] : []),
          ...(hasOTP ? ["OTP", "password"] : []),
          ...(hasMoney ? ["prize", "won"] : []),
        ],
      },
      recommendations: {
        do: [
          "Delete this message immediately",
          "Block the sender number on your phone",
          riskScore > 50 ? "Report to your bank (if impersonating)" : "Keep this for your records",
          "Inform 3 friends/family about this scam",
          "Check your bank account for unauthorized activity",
        ],
        dont: [
          "Don't click any links in the message",
          "Don't call the number back",
          "Don't share OTPs, passwords, or PINs",
          "Don't forward message without warning others",
          "Don't respond to the sender",
        ],
      },
    };

    setAnalysisResult(result);
    setIsAnalyzing(false);
    setLoadingMessage("");

    toast({
      title: "Analysis Complete",
      description: `Risk Level: ${riskLevel.toUpperCase()} (${riskScore}/100)`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-primary">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">SecureChat</span>
            </Link>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Exit
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="bg-card border-border sticky top-24">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab("analyze")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === "analyze"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary text-foreground"
                    }`}
                  >
                    <Search className="h-5 w-5" />
                    Analyze Message
                  </button>
                  <button
                    onClick={() => setActiveTab("history")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === "history"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary text-foreground"
                    }`}
                  >
                    <History className="h-5 w-5" />
                    Analysis History
                  </button>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === "settings"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary text-foreground"
                    }`}
                  >
                    <Settings className="h-5 w-5" />
                    Settings
                  </button>
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-8">
            {activeTab === "analyze" && (
              <>
                {/* Analysis Form */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      Analyze New Message
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Language Selection */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Languages className="h-4 w-4" />
                        Analysis Language
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

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Phone Number */}
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Sender Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          placeholder="+91 XXXXXXXXXX"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>

                      {/* Category */}
                      <div className="space-y-2">
                        <Label>Message Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="banking">Banking/Finance</SelectItem>
                            <SelectItem value="delivery">Delivery/Shipping</SelectItem>
                            <SelectItem value="government">Government/Tax</SelectItem>
                            <SelectItem value="lottery">Lottery/Prize</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className="space-y-2">
                      <Label htmlFor="message" className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Message Content *
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Paste the suspicious message here..."
                        className="min-h-[120px]"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                      <p className="text-sm text-muted-foreground text-right">
                        {formData.message.length}/1000
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Date */}
                      <div className="space-y-2">
                        <Label htmlFor="date" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Date Received
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                      </div>

                      {/* Time */}
                      <div className="space-y-2">
                        <Label htmlFor="time" className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Time Received
                        </Label>
                        <Input
                          id="time"
                          type="time"
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* In Contacts Toggle */}
                    <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                      <div>
                        <Label>Sender in Contacts</Label>
                        <p className="text-sm text-muted-foreground">Is this number saved in your phone?</p>
                      </div>
                      <Switch
                        checked={formData.inContacts}
                        onCheckedChange={(checked) => setFormData({ ...formData, inContacts: checked })}
                      />
                    </div>

                    {/* Screenshot Upload */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Upload Screenshot (Optional)
                      </Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Max file size: 5MB • PNG, JPG accepted
                        </p>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      size="lg"
                      className="w-full bg-gradient-primary"
                      onClick={analyzeMessage}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          {loadingMessage}
                        </>
                      ) : (
                        <>
                          <Search className="h-5 w-5 mr-2" />
                          Analyze Message
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Analysis Result */}
                {analysisResult && (
                  <>
                    <AnalysisReport result={analysisResult} language={formData.language} />
                    <AIChatbot result={analysisResult} language={formData.language} />
                  </>
                )}
              </>
            )}

            {activeTab === "history" && <AnalysisHistory />}

            {activeTab === "settings" && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                      <div>
                        <Label>Default Language</Label>
                        <p className="text-sm text-muted-foreground">Set your preferred analysis language</p>
                      </div>
                      <Select defaultValue="english">
                        <SelectTrigger className="w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="hindi">Hindi</SelectItem>
                          <SelectItem value="telugu">Telugu</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive alerts about new scam patterns</p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                      <div>
                        <Label>Auto-delete History</Label>
                        <p className="text-sm text-muted-foreground">Automatically delete analysis after 30 days</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
