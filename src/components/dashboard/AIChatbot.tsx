import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Bot, User } from "lucide-react";
import type { AnalysisResult } from "@/pages/Dashboard";

interface Message {
  role: "user" | "bot";
  content: string;
}

interface AIChatbotProps {
  result: AnalysisResult;
  language: string;
}

const quickQuestions = [
  "Why is this considered risky?",
  "What if I already clicked the link?",
  "How do I report this to police?",
  "What if I shared my OTP?",
];

export function AIChatbot({ result, language }: AIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content: `I've analyzed the message and found it to be ${result.riskLevel} risk. Feel free to ask me any questions about this analysis or what steps you should take!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const generateResponse = (question: string): string => {
    const q = question.toLowerCase();

    if (q.includes("risky") || q.includes("why")) {
      const reasons = result.threats.map((t) => t.title).join(", ");
      return `This message shows ${result.threats.length} red flags: ${reasons || "suspicious patterns"}. ${
        result.riskScore > 60
          ? "Banks and legitimate companies never ask for OTPs or passwords via SMS."
          : "While not immediately dangerous, always verify through official channels."
      }`;
    }

    if (q.includes("clicked") || q.includes("link")) {
      return `Don't panic! Here's what to do immediately:
1. Disconnect from the internet
2. Don't enter any information on the opened site
3. Clear your browser cache and history
4. Change your banking passwords immediately
5. Call your bank's fraud helpline
6. Monitor your account for 48 hours

Would you like the fraud helpline numbers for major banks?`;
    }

    if (q.includes("report") || q.includes("police")) {
      return `To report this scam in India:
1. Call Cyber Crime Helpline: 1930 (24/7)
2. File online at: cybercrime.gov.in
3. Report to your bank's fraud department
4. Block and report the sender number
5. Save all evidence (this analysis report)

The National Cyber Crime Portal accepts complaints in multiple languages.`;
    }

    if (q.includes("otp") || q.includes("shared")) {
      return `If you shared your OTP, act immediately:
1. Call your bank NOW and block your account temporarily
2. Change all passwords (bank, email, UPI apps)
3. Check for unauthorized transactions
4. File a complaint at cybercrime.gov.in
5. Inform your bank about potential fraud

Time is critical - the faster you act, the better chance of recovery!`;
    }

    if (q.includes("helpline") || q.includes("number")) {
      return `Important helpline numbers:
• Cyber Crime: 1930 (24/7)
• SBI Fraud: 1800-111-109
• HDFC Fraud: 1800-120-2767
• ICICI Fraud: 1800-1080
• RBI Helpline: 14440

Save these numbers for emergencies!`;
    }

    return `I understand you're concerned about this message. Based on my analysis, the risk level is ${result.riskLevel} (${result.riskScore}/100). ${
      result.riskLevel === "high"
        ? "I strongly recommend not interacting with this message and blocking the sender."
        : "While caution is advised, verify through official channels before taking any action."
    } Is there anything specific you'd like to know?`;
  };

  const handleSend = async (question?: string) => {
    const messageText = question || input;
    if (!messageText.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: messageText }]);
    setInput("");
    setIsTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = generateResponse(messageText);
    setMessages((prev) => [...prev, { role: "bot", content: response }]);
    setIsTyping(false);
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          Ask Me Anything
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Quick Questions */}
        <div className="flex flex-wrap gap-2 mb-4">
          {quickQuestions.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleSend(question)}
              className="text-xs"
            >
              {question}
            </Button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="h-64 overflow-y-auto mb-4 space-y-4 p-4 bg-secondary/30 rounded-lg">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {message.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border"
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-card border border-border p-3 rounded-lg">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={() => handleSend()} className="bg-gradient-primary">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
