import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Mail, MessageSquare, Copy, Lock, X } from "lucide-react";
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

  const getShareContent = () => {
    const riskEmoji = result.riskLevel === "high" ? "🚨" : result.riskLevel === "medium" ? "⚠️" : "✅";
    const shareId = generateShareId();
    
    if (shareFormat === "quick") {
      return {
        text: `${riskEmoji} SCAM ALERT from SentinelAI

Risk Level: ${result.riskLevel.toUpperCase()} (${result.riskScore}/100)
This SMS is likely a fraud attempt.

❌ Do NOT click links
❌ Do NOT share personal info

Analyze your own messages FREE: sentinelai.com`,
        link: `https://sentinelai.com/report/${shareId}`,
      };
    } else if (shareFormat === "full") {
      return {
        text: `${riskEmoji} DETAILED SCAM ANALYSIS from SentinelAI

Risk Level: ${result.riskLevel.toUpperCase()} (${result.riskScore}/100)
Confidence: ${result.confidence}%

Verdict: ${result.verdict}

Threats Found:
${result.threats.map(t => `• ${t.title}`).join('\n')}

Recommendation: ${result.action}

View full analysis: https://sentinelai.com/report/${shareId}

Protect yourself - analyze suspicious messages FREE at sentinelai.com`,
        link: `https://sentinelai.com/report/${shareId}`,
      };
    } else {
      return {
        text: `${riskEmoji} SCAM WARNING

A suspicious SMS was detected with ${result.riskLevel.toUpperCase()} risk level.

Stay safe - verify before clicking any links.

Check your messages at: sentinelai.com`,
        link: `https://sentinelai.com`,
      };
    }
  };

  const handleWhatsAppShare = () => {
    const { text } = getShareContent();
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, "_blank");
    toast({ title: "Opening WhatsApp...", duration: 3000 });
  };

  const handleEmailShare = () => {
    const { text } = getShareContent();
    const subject = encodeURIComponent("Scam Alert - Message Analysis from SentinelAI");
    const body = encodeURIComponent(text);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    toast({ title: "Opening email client...", duration: 3000 });
  };

  const handleSMSShare = () => {
    const { text } = getShareContent();
    const encodedText = encodeURIComponent(text);
    // SMS protocol
    window.location.href = `sms:?body=${encodedText}`;
    toast({ title: "Opening SMS...", duration: 3000 });
  };

  const handleCopyLink = () => {
    const { text, link } = getShareContent();
    navigator.clipboard.writeText(`${text}\n\n${link}`);
    toast({ title: "Link copied! ✓", description: "Valid for 7 days", duration: 3000 });
  };

  const { text } = getShareContent();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🔗 Share This Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Share Format */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Share Format</Label>
            <RadioGroup value={shareFormat} onValueChange={setShareFormat} className="space-y-2">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                <RadioGroupItem value="quick" id="quick" />
                <Label htmlFor="quick" className="cursor-pointer flex-1">
                  <span className="font-medium">Quick Warning</span>
                  <span className="text-sm text-muted-foreground block">Summary with key points</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                <RadioGroupItem value="full" id="full" />
                <Label htmlFor="full" className="cursor-pointer flex-1">
                  <span className="font-medium">Full Report</span>
                  <span className="text-sm text-muted-foreground block">Complete detailed analysis</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                <RadioGroupItem value="anonymous" id="anonymous" />
                <Label htmlFor="anonymous" className="cursor-pointer flex-1">
                  <span className="font-medium">Anonymous</span>
                  <span className="text-sm text-muted-foreground block">No personal info included</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Share Buttons */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Share Via</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 h-12"
                onClick={handleWhatsAppShare}
              >
                <MessageCircle className="h-5 w-5 text-green-500" />
                WhatsApp
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 h-12"
                onClick={handleEmailShare}
              >
                <Mail className="h-5 w-5 text-primary" />
                Email
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 h-12"
                onClick={handleSMSShare}
              >
                <MessageSquare className="h-5 w-5 text-blue-500" />
                SMS
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 h-12"
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
            <Card className="bg-secondary/30 border-border">
              <CardContent className="p-4">
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans">
                  {text}
                </pre>
              </CardContent>
            </Card>
          </div>

          {/* Privacy Notice */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            Your personal details will not be shared
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
