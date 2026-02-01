import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Upload, Calendar, Clock, Phone, MessageSquare, Languages, Loader2, X, Image, CheckCircle, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import { AnalysisReport } from "@/components/dashboard/AnalysisReport";
import { AIChatbot } from "@/components/dashboard/AIChatbot";
import { useAuth } from "@/contexts/AuthContext";
import { saveAnalysis } from "@/services/analysisService";
import { uploadScreenshot } from "@/services/storageService";
import { analyzeSMSMessage } from "@/services/aiService";
import type { AnalysisResult, AnalysisData, RiskLevel, Language } from "@/types";

export default function Analyze() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);
  
  // File upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Phone validation state
  const [phoneValid, setPhoneValid] = useState<boolean | null>(null);
  const [phoneError, setPhoneError] = useState("");
  
  const [formData, setFormData] = useState({
    language: (localStorage.getItem('analysisLanguage') || "english") as Language,
    phone: "",
    message: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
  });

  // Auth protection - redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Please login first",
        description: "You need to be logged in to analyze messages",
        variant: "destructive",
      });
      navigate("/auth");
    }
  }, [authLoading, user, navigate]);

  // Save language preference
  useEffect(() => {
    localStorage.setItem('analysisLanguage', formData.language);
  }, [formData.language]);

  const loadingMessages = [
    "Analyzing message content...",
    "Checking sender reputation...",
    "Scanning for malicious links...",
    "Generating risk report...",
  ];

  // Phone number validation - accepts any country code
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only digits and + symbol
    const cleaned = value.replace(/[^\d+]/g, '');
    
    // Ensure + is only at the start
    let formattedPhone = cleaned;
    if (cleaned.length > 0 && !cleaned.startsWith('+')) {
      formattedPhone = '+' + cleaned;
    }
    
    // Remove any + that's not at the start
    if (formattedPhone.length > 1) {
      formattedPhone = '+' + formattedPhone.slice(1).replace(/\+/g, '');
    }
    
    // Limit to reasonable phone length
    formattedPhone = formattedPhone.slice(0, 16);
    
    setFormData({ ...formData, phone: formattedPhone });
    
    // Validate: + followed by 10-15 digits
    if (formattedPhone.length === 0) {
      setPhoneValid(null);
      setPhoneError("");
    } else if (/^\+\d{10,15}$/.test(formattedPhone)) {
      setPhoneValid(true);
      setPhoneError("");
    } else {
      setPhoneValid(false);
    }
  };

  const handlePhoneKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/[\d+]/.test(e.key)) {
      e.preventDefault();
      setPhoneError("⚠️ Numbers and + only");
      setTimeout(() => {
        if (/^\+\d{10,15}$/.test(formData.phone)) {
          setPhoneError("");
        } else {
          setPhoneError("");
        }
      }, 2000);
    }
  };

  // File upload handlers
  const handleFileSelect = (file: File) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload PNG or JPG only",
        variant: "destructive",
      });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB",
        variant: "destructive",
      });
      return;
    }
    
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    toast({ title: "Screenshot uploaded", description: file.name });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const analyzeMessage = async () => {
    if (!formData.phone || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in the sender phone number and message content.",
        variant: "destructive",
      });
      return;
    }

    if (!phoneValid) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number with country code.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Upload screenshot if present
    let screenshotUrl: string | undefined;
    if (uploadedFile && user) {
      setIsUploading(true);
      const uploadResult = await uploadScreenshot(uploadedFile, user.id);
      setIsUploading(false);
      
      if (uploadResult.success && uploadResult.url) {
        screenshotUrl = uploadResult.url;
        console.log("Screenshot uploaded:", screenshotUrl);
      } else {
        console.error("Screenshot upload failed:", uploadResult.error);
        // Continue without screenshot
      }
    }

    // Show loading messages while analyzing
    const loadingInterval = setInterval(() => {
      const idx = Math.floor(Math.random() * loadingMessages.length);
      setLoadingMessage(loadingMessages[idx]);
    }, 1500);

    let result: AnalysisResult;
    
    try {
      // Call the real AI analysis
      result = await analyzeSMSMessage(
        formData.message,
        formData.phone,
        formData.language
      );
    } catch (error) {
      console.error("AI analysis failed:", error);
      clearInterval(loadingInterval);
      setIsAnalyzing(false);
      setLoadingMessage("");
      
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Unable to analyze message. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    clearInterval(loadingInterval);

    setAnalysisResult(result);
    setIsAnalyzing(false);
    setLoadingMessage("");

    // Save analysis to database if user is logged in
    if (user) {
      const analysisData: AnalysisData = {
        senderPhone: formData.phone,
        messageContent: formData.message,
        dateReceived: formData.date,
        timeReceived: formData.time,
        screenshotUrl,
        language: formData.language,
        riskScore: result.riskScore,
        riskLevel: result.riskLevel.toUpperCase() as RiskLevel,
        verdict: result.verdict,
        threats: result.threats,
        recommendations: result.recommendations,
        senderAnalysis: result.senderAnalysis,
        contentAnalysis: result.contentAnalysis,
      };

      const saveResult = await saveAnalysis(analysisData);
      
      if (saveResult.success) {
        console.log("Analysis saved to database:", saveResult.data?.id);
      } else {
        console.error("Failed to save analysis:", saveResult.error);
        // Don't show error to user - analysis still worked
      }
    }

    toast({
      title: "Analysis Complete",
      description: `Risk Level: ${result.riskLevel.toUpperCase()} (${result.riskScore}/100)`,
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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Analysis Form */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Analyze Message
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Language Selection */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Languages className="h-4 w-4" />
                    Select Language
                  </Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value) => setFormData({ ...formData, language: value as Language })}
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
                  <p className="text-xs text-muted-foreground">Analysis will be provided in this language</p>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Sender's Number *
                  </Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      placeholder="e.g., +91 9876543210"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      onKeyPress={handlePhoneKeyPress}
                      className={`pr-10 transition-colors ${
                        phoneValid === true 
                          ? "border-success focus-visible:ring-success" 
                          : phoneError
                          ? "border-destructive focus-visible:ring-destructive" 
                          : ""
                      }`}
                    />
                    {phoneValid === true && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-success" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter phone number with country code (e.g., +91 9876543210)
                  </p>
                  {phoneError && (
                    <p className="text-xs text-destructive animate-pulse">{phoneError}</p>
                  )}
                </div>

                {/* Message Content */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Message Text *
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Paste the suspicious message here..."
                    className="min-h-[160px]"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    maxLength={5000}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {formData.message.length} / 5000
                  </p>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
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
                      className="[&::-webkit-calendar-picker-indicator]:dark:invert [&::-webkit-calendar-picker-indicator]:opacity-70"
                    />
                  </div>
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
                      className="[&::-webkit-calendar-picker-indicator]:dark:invert [&::-webkit-calendar-picker-indicator]:opacity-70"
                    />
                  </div>
                </div>

                {/* Screenshot Upload */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Screenshot (Optional)
                  </Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleFileInputChange}
                    className="hidden"
                    id="screenshot-upload"
                  />
                  
                  {!uploadedFile ? (
                    <div 
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                        isDragging 
                          ? "border-primary bg-primary/10" 
                          : "border-border hover:border-primary/50"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Max 5MB • PNG, JPG
                      </p>
                    </div>
                  ) : (
                    <div className="border border-border rounded-lg p-4">
                      <div className="flex items-center gap-4">
                        {filePreview && (
                          <img 
                            src={filePreview} 
                            alt="Screenshot preview" 
                            className="h-16 w-16 object-cover rounded-lg border border-border"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Image className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium truncate">{uploadedFile.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {(uploadedFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={removeFile}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  size="lg"
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={analyzeMessage}
                  disabled={isAnalyzing || isUploading || !formData.phone || !formData.message}
                >
                  {isAnalyzing || isUploading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      {isUploading ? "Uploading screenshot..." : loadingMessage}
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5 mr-2" />
                      🔍 Analyze Message
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
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Re-export AnalysisResult type for other components
export type { AnalysisResult };
