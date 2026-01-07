import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Shield, 
  Phone, 
  Link2, 
  Clock, 
  AlertCircle,
  Share2,
  Download,
  Trash2,
  Ban,
  Users,
  PhoneCall,
  ThumbsUp,
  ThumbsDown,
  Info
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ShareModal } from "./ShareModal";
import type { AnalysisResult } from "@/pages/Dashboard";
import { translations, type Language } from "@/lib/translations";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface AnalysisReportProps {
  result: AnalysisResult;
  language: string;
}

export function AnalysisReport({ result, language }: AnalysisReportProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null);
  
  const t = (key: keyof typeof translations.english): string => {
    const lang = language as Language;
    return translations[lang]?.[key] || translations.english[key] || key;
  };

  const getRiskColor = () => {
    switch (result.riskLevel) {
      case "high": return "text-destructive";
      case "medium": return "text-warning";
      case "low": return "text-success";
    }
  };

  const getRiskBgColor = () => {
    switch (result.riskLevel) {
      case "high": return "bg-destructive";
      case "medium": return "bg-warning";
      case "low": return "bg-success";
    }
  };

  const getRiskIcon = () => {
    switch (result.riskLevel) {
      case "high": return <XCircle className="h-6 w-6" />;
      case "medium": return <AlertTriangle className="h-6 w-6" />;
      case "low": return <CheckCircle className="h-6 w-6" />;
    }
  };

  const getRiskLevelText = () => {
    switch (result.riskLevel) {
      case "high": return t("high");
      case "medium": return t("medium");
      case "low": return t("low");
    }
  };

  const handleDownload = () => {
    toast({
      title: "Downloading Report",
      description: "Your PDF report is being generated.",
    });
  };

  const handleFeedback = (type: 'yes' | 'no') => {
    setFeedback(type);
    toast({
      title: type === 'yes' ? "Thank you! 👍" : "Thanks for feedback",
      description: type === 'yes' 
        ? "We're glad this helped!" 
        : "We'll work to improve our analysis.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Risk Score Card */}
      <Card className="bg-card border-border overflow-hidden">
        <div className={`h-2 ${getRiskBgColor()}`} />
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className={`flex items-center justify-center w-20 h-20 rounded-2xl ${getRiskBgColor()} ${getRiskBgColor() === "bg-warning" ? "text-warning-foreground" : "text-primary-foreground"}`}>
              {getRiskIcon()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-sm font-semibold uppercase ${getRiskColor()}`}>
                  {t("riskLevel")}: {getRiskLevelText()}
                </span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  • {t("confidence")}: {result.confidence}%
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs">
                        Confidence based on: Message pattern matching (35%), sender reputation (25%), 
                        link analysis (20%), content keywords (20%)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </span>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <span className={`text-4xl font-bold ${getRiskColor()}`}>
                  {result.riskScore}
                </span>
                <span className="text-2xl text-muted-foreground">/100</span>
              </div>
              <Progress 
                value={result.riskScore} 
                className="h-3"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Summary - Verdict */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {result.riskLevel === "low" ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
                <span className="font-semibold">{t("verdict")}</span>
              </div>
              <p className="text-foreground">
                {result.riskLevel === "high" ? t("verdictHigh") : 
                 result.riskLevel === "medium" ? t("verdictMedium") : t("verdictLow")}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                <span className="font-semibold">{t("recommendedAction")}</span>
              </div>
              <p className="text-foreground">
                {result.riskLevel === "high" ? t("actionHigh") : 
                 result.riskLevel === "medium" ? t("actionMedium") : t("actionLow")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simplified Recommendations - What Should You Do? */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {t("whatToDo")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Immediate Actions */}
          <div>
            <h4 className="flex items-center gap-2 font-semibold text-success mb-4">
              <CheckCircle className="h-5 w-5" />
              {t("immediateActions")}
            </h4>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
                <Trash2 className="h-5 w-5 text-success flex-shrink-0" />
                <span className="text-sm">{t("deleteMessage")}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
                <Ban className="h-5 w-5 text-success flex-shrink-0" />
                <span className="text-sm">{t("blockNumber")}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
                <Users className="h-5 w-5 text-success flex-shrink-0" />
                <span className="text-sm">{t("tellFriends")}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
                <PhoneCall className="h-5 w-5 text-success flex-shrink-0" />
                <span className="text-sm">{t("callBank")}</span>
              </div>
            </div>
          </div>

          {/* Do NOT */}
          <div>
            <h4 className="flex items-center gap-2 font-semibold text-destructive mb-4">
              <XCircle className="h-5 w-5" />
              {t("doNot")}
            </h4>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 bg-destructive/10 rounded-lg">
                <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                <span className="text-sm">{t("dontClickLinks")}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-destructive/10 rounded-lg">
                <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                <span className="text-sm">{t("dontShareOTP")}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-destructive/10 rounded-lg">
                <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                <span className="text-sm">{t("dontCallBack")}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-destructive/10 rounded-lg">
                <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                <span className="text-sm">{t("dontSendMoney")}</span>
              </div>
            </div>
          </div>

          {/* If Already Clicked */}
          {result.riskLevel !== "low" && (
            <div>
              <h4 className="flex items-center gap-2 font-semibold text-warning mb-4">
                <AlertTriangle className="h-5 w-5" />
                {t("ifAlreadyClicked")}
              </h4>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 bg-warning/10 rounded-lg">
                  <PhoneCall className="h-5 w-5 text-warning flex-shrink-0" />
                  <span className="text-sm">{t("callBankImmediately")}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-warning/10 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0" />
                  <span className="text-sm">{t("reportCyberCrime")}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-warning/10 rounded-lg">
                  <Ban className="h-5 w-5 text-warning flex-shrink-0" />
                  <span className="text-sm">{t("blockCard")}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-warning/10 rounded-lg">
                  <Shield className="h-5 w-5 text-warning flex-shrink-0" />
                  <span className="text-sm">{t("changePasswords")}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Why Is This Dangerous? */}
      {result.threats.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              {t("whyDangerous")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.threats.map((threat, index) => (
              <div 
                key={index} 
                className={`flex items-start gap-3 p-4 rounded-lg ${
                  threat.severity === "high" 
                    ? "bg-destructive/10 border border-destructive/20" 
                    : threat.severity === "medium"
                    ? "bg-warning/10 border border-warning/20"
                    : "bg-muted"
                }`}
              >
                <XCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                  threat.severity === "high" ? "text-destructive" : "text-warning"
                }`} />
                <div>
                  <p className="font-semibold text-foreground">{threat.title}</p>
                  <p className="text-sm text-muted-foreground">{threat.description}</p>
                </div>
              </div>
            ))}
            
            {/* Additional Analysis Details */}
            <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-border">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{t("senderAnalysis")}</p>
                <div className="space-y-1">
                  <p className="text-sm flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {result.senderAnalysis.phone}
                  </p>
                  {result.senderAnalysis.reportCount > 0 && (
                    <p className="text-sm text-destructive">
                      ⚠️ Reported {result.senderAnalysis.reportCount} times as spam
                    </p>
                  )}
                </div>
              </div>
              {result.contentAnalysis.hasLinks && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{t("contentAnalysis")}</p>
                  <div className="space-y-1">
                    <p className="text-sm text-destructive flex items-center gap-2">
                      <Link2 className="h-4 w-4" />
                      {t("suspiciousLink")}: {result.contentAnalysis.linkDomain}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save & Share */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold flex items-center gap-2">
                <Share2 className="h-5 w-5 text-primary" />
                {t("saveAnalysis")}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t("keepEvidence")}
              </p>
            </div>
            <div className="flex gap-3 flex-wrap justify-center">
              <Button variant="outline" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                {t("downloadPDF")}
              </Button>
              <Button 
                className="bg-gradient-primary"
                onClick={() => setShowShareModal(true)}
              >
                <Share2 className="h-4 w-4 mr-2" />
                {t("shareAnalysis")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Section */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">Was this analysis helpful?</p>
            <div className="flex gap-3">
              <Button
                variant={feedback === 'yes' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFeedback('yes')}
                disabled={feedback !== null}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Yes
              </Button>
              <Button
                variant={feedback === 'no' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFeedback('no')}
                disabled={feedback !== null}
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                No
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share Modal */}
      <ShareModal 
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        result={result}
      />
    </div>
  );
}
