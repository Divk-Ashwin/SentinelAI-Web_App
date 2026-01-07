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
  Copy
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { AnalysisResult } from "@/pages/Dashboard";

interface AnalysisReportProps {
  result: AnalysisResult;
  language: string;
}

export function AnalysisReport({ result, language }: AnalysisReportProps) {
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

  const handleShare = () => {
    toast({
      title: "Link Copied!",
      description: "Share link copied to clipboard. Valid for 7 days.",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Downloading Report",
      description: "Your PDF report is being generated.",
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
                  {result.riskLevel} RISK
                </span>
                <span className="text-sm text-muted-foreground">
                  • Confidence: {result.confidence}%
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

      {/* Quick Summary */}
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
                <span className="font-semibold">Verdict</span>
              </div>
              <p className="text-foreground">{result.verdict}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                <span className="font-semibold">Recommended Action</span>
              </div>
              <p className="text-foreground">{result.action}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Threat Indicators */}
      {result.threats.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Threat Indicators Found
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
          </CardContent>
        </Card>
      )}

      {/* Sender & Content Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Sender Analysis */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Sender Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-secondary/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Phone Number</p>
              <p className="font-medium">{result.senderAnalysis.phone || "Unknown"}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {result.senderAnalysis.inContacts ? (
                  <CheckCircle className="h-4 w-4 text-success" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-warning" />
                )}
                <span className="text-sm">
                  {result.senderAnalysis.inContacts ? "In your contacts" : "Not in your contacts"}
                </span>
              </div>
              {result.senderAnalysis.reportCount > 0 && (
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm">
                    Reported {result.senderAnalysis.reportCount} times as spam
                  </span>
                </div>
              )}
              {result.senderAnalysis.isNew && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-warning" />
                  <span className="text-sm">Recently activated number</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Content Analysis */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-primary" />
              Content Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {result.contentAnalysis.hasLinks && (
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm">
                    Suspicious link: {result.contentAnalysis.linkDomain}
                  </span>
                </div>
              )}
              {result.contentAnalysis.hasUrgency && (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="text-sm">High urgency language detected</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm">
                  Grammar score: {result.contentAnalysis.grammarScore}/10
                </span>
              </div>
            </div>
            {result.contentAnalysis.keywords.length > 0 && (
              <div className="pt-2 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">Suspicious keywords:</p>
                <div className="flex flex-wrap gap-2">
                  {result.contentAnalysis.keywords.map((keyword, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 text-xs bg-destructive/10 text-destructive rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="flex items-center gap-2 font-semibold text-success mb-4">
                <CheckCircle className="h-5 w-5" />
                What To Do
              </h4>
              <ul className="space-y-3">
                {result.recommendations.do.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-success mt-1">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="flex items-center gap-2 font-semibold text-destructive mb-4">
                <XCircle className="h-5 w-5" />
                What NOT To Do
              </h4>
              <ul className="space-y-3">
                {result.recommendations.dont.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-destructive mt-1">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share & Download */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold flex items-center gap-2">
                <Share2 className="h-5 w-5 text-primary" />
                Save This Analysis
              </h4>
              <p className="text-sm text-muted-foreground">
                Keep evidence for reporting or warning others
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Share Link
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
