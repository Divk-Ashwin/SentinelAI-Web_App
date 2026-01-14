import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Bot, User, Minus, X } from "lucide-react";
import type { AnalysisResult } from "@/pages/Dashboard";
import { translations, type Language } from "@/lib/translations";

interface Message {
  role: "user" | "bot";
  content: string;
}

interface AIChatbotProps {
  result: AnalysisResult;
  language: string;
}

export function AIChatbot({ result, language }: AIChatbotProps) {
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

  const generateResponse = (question: string): string => {
    const q = question.toLowerCase();

    if (q.includes("risky") || q.includes("why") || q.includes("जोखिम") || q.includes("ప్రమాద")) {
      const reasons = result.threats.map((t) => t.title).join(", ");
      
      if (language === "hindi") {
        return `यह संदेश ${result.threats.length} खतरे के संकेत दिखाता है: ${reasons || "संदिग्ध पैटर्न"}। ${
          result.riskScore > 60
            ? "बैंक और वैध कंपनियां कभी भी SMS के माध्यम से OTP या पासवर्ड नहीं मांगती हैं।"
            : "तुरंत खतरनाक न होते हुए भी, हमेशा आधिकारिक चैनलों से सत्यापित करें।"
        }`;
      } else if (language === "telugu") {
        return `ఈ సందేశం ${result.threats.length} ప్రమాద సంకేతాలను చూపిస్తుంది: ${reasons || "అనుమానాస్పద నమూనాలు"}। ${
          result.riskScore > 60
            ? "బ్యాంకులు మరియు చట్టబద్ధమైన కంపెనీలు ఎప్పుడూ SMS ద్వారా OTP లేదా పాస్‌వర్డ్‌లు అడగవు."
            : "వెంటనే ప్రమాదకరం కానప్పటికీ, ఎల్లప్పుడూ అధికారిక ఛానెల్స్ ద్వారా ధృవీకరించండి."
        }`;
      }
      
      return `This message shows ${result.threats.length} red flags: ${reasons || "suspicious patterns"}. ${
        result.riskScore > 60
          ? "Banks and legitimate companies never ask for OTPs or passwords via SMS."
          : "While not immediately dangerous, always verify through official channels."
      }`;
    }

    if (q.includes("clicked") || q.includes("link") || q.includes("क्लिक") || q.includes("క్లిక్")) {
      if (language === "hindi") {
        return `घबराएं नहीं! तुरंत ये करें:
1. इंटरनेट से डिस्कनेक्ट करें
2. खुली साइट पर कोई जानकारी न दें
3. ब्राउज़र कैश और हिस्ट्री साफ करें
4. तुरंत अपने बैंकिंग पासवर्ड बदलें
5. अपने बैंक की फ्रॉड हेल्पलाइन पर कॉल करें
6. 48 घंटे तक अपने खाते की निगरानी करें`;
      } else if (language === "telugu") {
        return `భయపడకండి! వెంటనే ఇవి చేయండి:
1. ఇంటర్నెట్ నుండి డిస్‌కనెక్ట్ చేయండి
2. తెరిచిన సైట్‌లో ఏ సమాచారం నమోదు చేయకండి
3. బ్రౌజర్ కాష్ మరియు హిస్టరీ క్లియర్ చేయండి
4. వెంటనే మీ బ్యాంకింగ్ పాస్‌వర్డ్‌లు మార్చండి
5. మీ బ్యాంక్ ఫ్రాడ్ హెల్ప్‌లైన్‌కు కాల్ చేయండి
6. 48 గంటలు మీ ఖాతాను పర్యవేక్షించండి`;
      }
      
      return `Don't panic! Here's what to do immediately:
1. Disconnect from the internet
2. Don't enter any information on the opened site
3. Clear your browser cache and history
4. Change your banking passwords immediately
5. Call your bank's fraud helpline
6. Monitor your account for 48 hours`;
    }

    if (q.includes("report") || q.includes("police") || q.includes("रिपोर्ट") || q.includes("నివేదించ")) {
      if (language === "hindi") {
        return `भारत में इस स्कैम की रिपोर्ट करने के लिए:
1. साइबर क्राइम हेल्पलाइन पर कॉल करें: 1930 (24/7)
2. ऑनलाइन रिपोर्ट करें: cybercrime.gov.in
3. अपने बैंक के फ्रॉड विभाग को रिपोर्ट करें
4. सेंडर नंबर को ब्लॉक और रिपोर्ट करें
5. सभी सबूत सहेजें`;
      } else if (language === "telugu") {
        return `భారతదేశంలో ఈ స్కామ్‌ను నివేదించడానికి:
1. సైబర్ క్రైమ్ హెల్ప్‌లైన్‌కు కాల్ చేయండి: 1930 (24/7)
2. ఆన్‌లైన్‌లో నివేదించండి: cybercrime.gov.in
3. మీ బ్యాంక్ ఫ్రాడ్ విభాగానికి నివేదించండి
4. పంపినవారి నంబర్‌ను బ్లాక్ చేసి నివేదించండి
5. అన్ని ఆధారాలు సేవ్ చేయండి`;
      }
      
      return `To report this scam in India:
1. Call Cyber Crime Helpline: 1930 (24/7)
2. File online at: cybercrime.gov.in
3. Report to your bank's fraud department
4. Block and report the sender number
5. Save all evidence`;
    }

    if (q.includes("otp") || q.includes("shared") || q.includes("साझा") || q.includes("షేర్")) {
      if (language === "hindi") {
        return `अगर आपने OTP साझा किया है, तुरंत कार्रवाई करें:
1. अभी अपने बैंक को कॉल करें और खाता ब्लॉक करें
2. सभी पासवर्ड बदलें (बैंक, ईमेल, UPI)
3. अनधिकृत लेनदेन की जांच करें
4. cybercrime.gov.in पर शिकायत दर्ज करें
5. अपने बैंक को सूचित करें

समय महत्वपूर्ण है!`;
      } else if (language === "telugu") {
        return `మీరు OTP షేర్ చేస్తే, వెంటనే చర్య తీసుకోండి:
1. ఇప్పుడే మీ బ్యాంక్‌కు కాల్ చేసి ఖాతా బ్లాక్ చేయండి
2. అన్ని పాస్‌వర్డ్‌లు మార్చండి (బ్యాంక్, ఈమెయిల్, UPI)
3. అనధికార లావాదేవీల కోసం తనిఖీ చేయండి
4. cybercrime.gov.in వద్ద ఫిర్యాదు చేయండి
5. మీ బ్యాంక్‌కు తెలియజేయండి

సమయం కీలకం!`;
      }
      
      return `If you shared your OTP, act immediately:
1. Call your bank NOW and block your account
2. Change all passwords (bank, email, UPI apps)
3. Check for unauthorized transactions
4. File a complaint at cybercrime.gov.in
5. Inform your bank about potential fraud

Time is critical!`;
    }

    if (q.includes("helpline") || q.includes("number") || q.includes("हेल्पलाइन") || q.includes("హెల్ప్‌లైన్")) {
      return `Important helpline numbers:
• Cyber Crime: 1930 (24/7)
• SBI Fraud: 1800-111-109
• HDFC Fraud: 1800-120-2767
• ICICI Fraud: 1800-1080
• RBI Helpline: 14440

Save these numbers!`;
    }

    // Default response
    if (language === "hindi") {
      return `जोखिम स्तर ${result.riskLevel === "high" ? "उच्च" : result.riskLevel === "medium" ? "मध्यम" : "कम"} (${result.riskScore}/100) है। ${
        result.riskLevel === "high"
          ? "इस संदेश के साथ इंटरैक्ट न करें और सेंडर को ब्लॉक करें।"
          : "सावधानी बरतें और आधिकारिक चैनलों से सत्यापित करें।"
      }`;
    } else if (language === "telugu") {
      return `ప్రమాద స్థాయి ${result.riskLevel === "high" ? "అధికం" : result.riskLevel === "medium" ? "మధ్యస్థం" : "తక్కువ"} (${result.riskScore}/100). ${
        result.riskLevel === "high"
          ? "ఈ సందేశంతో ఇంటరాక్ట్ చేయకండి మరియు పంపినవారిని బ్లాక్ చేయండి."
          : "జాగ్రత్త వహించండి మరియు అధికారిక ఛానెల్స్ ద్వారా ధృవీకరించండి."
      }`;
    }

    return `The risk level is ${result.riskLevel} (${result.riskScore}/100). ${
      result.riskLevel === "high"
        ? "I recommend not interacting with this message and blocking the sender."
        : "Exercise caution and verify through official channels."
    }`;
  };

  const handleSend = async (question?: string) => {
    const messageText = question || input;
    if (!messageText.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: messageText }]);
    setInput("");
    setIsTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    const response = generateResponse(messageText);
    setMessages((prev) => [...prev, { role: "bot", content: response }]);
    setIsTyping(false);
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