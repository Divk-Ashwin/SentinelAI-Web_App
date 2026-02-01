import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Bot, User, Minus } from "lucide-react";
import type { AnalysisResult } from "@/types";
import { translations, type Language } from "@/lib/translations";
import { chatWithAssistant } from "@/services/aiService";
import { toast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "bot";
  content: string;
}

interface AIChatbotProps {
  result: AnalysisResult;
  language: string;
  messageContent?: string;
}

export function AIChatbot({ result, language, messageContent }: AIChatbotProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const t = (key: keyof typeof translations.english): string => {
    const lang = language as Language;
    return translations[lang]?.[key] || translations.english[key] || key;
  };

  const getQuickQuestions = () => [
    t("whyRisky"),
    t("whatIfClicked"),
    t("howToReport"),
    t("whatIfSharedOTP"),
  ];

  const getInitialMessage = (): string => {
    const riskText = result.riskLevel === "high" ? t("high") : result.riskLevel === "medium" ? t("medium") : t("low");
    
    if (language === "hindi") {
      return `मैंने संदेश का विश्लेषण किया है और पाया कि यह ${riskText} जोखिम वाला है। इस विश्लेषण या आपको क्या कदम उठाने चाहिए, इसके बारे में मुझसे कोई भी प्रश्न पूछें!`;
    } else if (language === "telugu") {
      return `నేను సందేశాన్ని విశ్లేషించాను మరియు ఇది ${riskText} ప్రమాదం అని కనుగొన్నాను. ఈ విశ్లేషణ గురించి లేదా మీరు ఏ చర్యలు తీసుకోవాలో నన్ను ఏదైనా అడగండి!`;
    }
    return `I've analyzed the message and found it to be ${result.riskLevel} risk. Feel free to ask me any questions about this analysis or what steps you should take!`;
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content: getInitialMessage(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isExpanded) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [messages, isTyping, isExpanded]);

  const handleSend = async (question?: string) => {
    const messageText = question || input;
    if (!messageText.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: messageText }]);
    setInput("");
    setIsTyping(true);

    try {
      // Build chat history for context (exclude the initial bot message and the just-added user message)
      const chatHistory = messages.slice(1).map(m => ({
        role: m.role === "user" ? "user" as const : "assistant" as const,
        content: m.content,
      }));

      // Call the real AI
      const response = await chatWithAssistant(
        messageText,
        {
          messageContent: messageContent,
          riskLevel: result.riskLevel,
          riskScore: result.riskScore,
          verdict: result.verdict,
          threats: result.threats.map(t => ({ title: t.title, description: t.description })),
        },
        language as Language,
        chatHistory
      );

      setMessages((prev) => [...prev, { role: "bot", content: response }]);
    } catch (error) {
      console.error("Chat error:", error);
      
      // Show error in chat
      const errorMessage = language === "hindi" 
        ? "क्षमा करें, कुछ गड़बड़ हुई। कृपया फिर से प्रयास करें।"
        : language === "telugu"
        ? "క్షమించండి, ఏదో తప్పు జరిగింది. దయచేసి మళ్ళీ ప్రయత్నించండి."
        : "Sorry, something went wrong. Please try again.";
      
      setMessages((prev) => [...prev, { role: "bot", content: errorMessage }]);
      
      toast({
        title: "Chat Error",
        description: error instanceof Error ? error.message : "Failed to get response",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Collapsed state - floating bubble
  if (!isExpanded) {
    return (
      <button 
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-full shadow-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105"
        onClick={() => setIsExpanded(true)}
        aria-label="Open AI Assistant"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="font-medium text-sm">{t("askAnything")}</span>
        {hasUnread && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
        )}
      </button>
    );
  }

  // Expanded state - full chat interface
  return (
    <div className="fixed bottom-6 right-6 z-50 w-[350px] max-w-[calc(100vw-48px)] h-[500px] max-h-[calc(100vh-100px)] bg-card border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <span className="font-semibold text-foreground">AI Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsExpanded(false)}
            aria-label="Minimize chat"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="flex gap-2 p-3 border-b border-border overflow-x-auto scrollbar-hide">
        {getQuickQuestions().map((question, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => handleSend(question)}
            disabled={isTyping}
            className="text-xs whitespace-nowrap flex-shrink-0 h-7"
          >
            {question}
          </Button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-2 ${message.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {message.role === "user" ? (
                <User className="h-3.5 w-3.5" />
              ) : (
                <Bot className="h-3.5 w-3.5" />
              )}
            </div>
            <div
              className={`max-w-[80%] p-3 rounded-lg text-sm ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 text-foreground"
              }`}
            >
              <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-secondary">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <div className="bg-secondary/50 p-3 rounded-lg">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border bg-background">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t("typeQuestion")}
            disabled={isTyping}
            className="flex-1 h-10 text-sm"
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            size="icon"
            className="h-10 w-10"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
