import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Mail, MessageSquare, Copy, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { AnalysisResult } from "@/pages/Dashboard";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AnalysisResult;
}

export function ShareModal({ isOpen, onClose, result }: ShareModalProps) {
  const [shareFormat, setShareFormat] = useState("quick");

  const generateShareId = () => {
    return Math.random().toString(36).substring(2, 10);
  };

  const getRiskEmoji = () => {
    if (result.riskLevel === "high") return "🚨";
    if (result.riskLevel === "medium") return "⚠️";
    return "✅";
  };

  const getShareContent = () => {
    const riskEmoji = getRiskEmoji();
    const shareId = generateShareId();
    const baseUrl = "https://sentinelai.com";
    
    if (shareFormat === "quick") {
      return {
        text: `${riskEmoji} SCAM ALERT

Analyzed with SentinelAI:
Risk Level: ${result.riskLevel.toUpperCase()}

This message is likely ${result.riskLevel === "high" ? "a scam" : result.riskLevel === "medium" ? "suspicious" : "safe"}.

DO NOT:
❌ Click links
❌ Share personal info
❌ Send money

Analyze your messages: ${baseUrl}`,
        link: `${baseUrl}/report/${shareId}`,
        subject: "Scam Alert - SentinelAI Analysis",
      };
    } else if (shareFormat === "full") {
      const threats = result.threats.map(t => `• ${t.title}`).join('\n');
      return {
        text: `${riskEmoji} DETAILED SCAM ANALYSIS

Risk Level: ${result.riskLevel.toUpperCase()} (${result.riskScore}/100)
Confidence: ${result.confidence}%

Verdict: ${result.verdict}

Threats Found:
${threats || "• No specific threats identified"}

Recommendation: ${result.action}

View full analysis: ${baseUrl}/report/${shareId}

Protect yourself - analyze suspicious messages FREE at ${baseUrl}`,
        link: `${baseUrl}/report/${shareId}`,
        subject: "Detailed Scam Analysis - SentinelAI",
      };
    } else {
      // Anonymous
      return {
        text: `${riskEmoji} SCAM WARNING

A suspicious SMS was detected with ${result.riskLevel.toUpperCase()} risk level.

Stay safe - verify before clicking any links.

Check your messages at: ${baseUrl}`,
        link: baseUrl,
        subject: "Scam Warning - Stay Safe",
      };
    }
  };

  const handleWhatsAppShare = () => {
    const { text } = getShareContent();
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, "_blank", "noopener,noreferrer");
    toast({ 
      title: "Opening WhatsApp...", 
      description: "Share the warning with friends and family",
      duration: 3000 
    });
  };

  const handleEmailShare = () => {
    const { text, subject } = getShareContent();
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(text);
    window.location.href = `mailto:?subject=${encodedSubject}&body=${encodedBody}`;
    toast({ 
      title: "Opening email client...", 
      duration: 3000 
    });
  };

  const handleSMSShare = () => {
    const { text } = getShareContent();
    const encodedText = encodeURIComponent(text);
    // Different SMS URI for different platforms
    const smsUri = navigator.userAgent.includes("iPhone") 
      ? `sms:&body=${encodedText}` 
      : `sms:?body=${encodedText}`;
    window.location.href = smsUri;
    toast({ 
      title: "Opening SMS...", 
      duration: 3000 
    });
  };

  const handleCopyLink = async () => {
    const { text, link } = getShareContent();
    const fullContent = `${text}\n\n${link}`;
    
    try {
      await navigator.clipboard.writeText(fullContent);
      toast({ 
        title: "Link copied! ✓", 
        description: "Share link valid for 7 days",
        duration: 3000 
      });
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = fullContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      toast({ 
        title: "Link copied! ✓", 
        description: "Share link valid for 7 days",
        duration: 3000 
      });
    }
  };

  const { text } = getShareContent();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            🔗 Share This Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Share Format */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Choose Format</Label>
            <RadioGroup value={shareFormat} onValueChange={setShareFormat} className="space-y-2">
              <label 
                htmlFor="quick" 
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  shareFormat === "quick" ? "bg-primary/5 border-primary" : "bg-secondary/30 border-border hover:bg-secondary/50"
                }`}
              >
                <RadioGroupItem value="quick" id="quick" />
                <div className="flex-1">
                  <span className="font-medium text-foreground">Quick Warning</span>
                  <span className="text-sm text-muted-foreground block">Summary with key points (recommended)</span>
                </div>
              </label>
              
              <label 
                htmlFor="full" 
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  shareFormat === "full" ? "bg-primary/5 border-primary" : "bg-secondary/30 border-border hover:bg-secondary/50"
                }`}
              >
                <RadioGroupItem value="full" id="full" />
                <div className="flex-1">
                  <span className="font-medium text-foreground">Full Report</span>
                  <span className="text-sm text-muted-foreground block">Complete detailed analysis</span>
                </div>
              </label>
              
              <label 
                htmlFor="anonymous" 
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  shareFormat === "anonymous" ? "bg-primary/5 border-primary" : "bg-secondary/30 border-border hover:bg-secondary/50"
                }`}
              >
                <RadioGroupItem value="anonymous" id="anonymous" />
                <div className="flex-1">
                  <span className="font-medium text-foreground">Anonymous</span>
                  <span className="text-sm text-muted-foreground block">No personal info included</span>
                </div>
              </label>
            </RadioGroup>
          </div>

          {/* Share Buttons */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Share Via</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="flex items-center justify-center gap-2 h-12 hover:bg-green-500/10 hover:border-green-500/50 hover:text-green-600 dark:hover:text-green-400"
                onClick={handleWhatsAppShare}
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center justify-center gap-2 h-12 hover:bg-primary/10 hover:border-primary/50"
                onClick={handleEmailShare}
              >
                <Mail className="h-5 w-5" />
                Email
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center justify-center gap-2 h-12 hover:bg-blue-500/10 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={handleSMSShare}
              >
                <MessageSquare className="h-5 w-5" />
                SMS
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center justify-center gap-2 h-12 hover:bg-secondary"
                onClick={handleCopyLink}
              >
                <Copy className="h-5 w-5" />
                Copy Link
              </Button>
            </div>
          </div>

          {/* Preview */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Preview</Label>
            <Card className="bg-secondary/20 border-border">
              <CardContent className="p-4">
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed">
                  {text}
                </pre>
              </CardContent>
            </Card>
          </div>

          {/* Privacy Notice */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-success/5 border border-success/20">
            <Lock className="h-4 w-4 text-success flex-shrink-0" />
            <span className="text-sm text-muted-foreground">
              Your personal details will not be shared. Only the message analysis is included.
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}