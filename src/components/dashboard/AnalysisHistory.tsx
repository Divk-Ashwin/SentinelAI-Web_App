import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  History, 
  Search, 
  Trash2, 
  Eye, 
  Share2,
  Shield,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  XCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ShareModal } from "./ShareModal";
import type { AnalysisResult } from "@/pages/Dashboard";

interface HistoryItem {
  id: string;
  date: string;
  time: string;
  riskLevel: "low" | "medium" | "high";
  riskScore: number;
  messagePreview: string;
  sender: string;
  fullResult?: AnalysisResult;
}

const mockHistory: HistoryItem[] = [
  {
    id: "1",
    date: "Jan 5, 2026",
    time: "2:30 PM",
    riskLevel: "high",
    riskScore: 85,
    messagePreview: "Your account will be suspended unless you verify immediately at bit.ly/xyz...",
    sender: "+91 98765 43210",
    fullResult: {
      riskScore: 85,
      riskLevel: "high",
      confidence: 92,
      verdict: "This message is likely a smishing attempt",
      action: "Do NOT click links or share personal information",
      threats: [
        { title: "Suspicious Link Detected", description: "The message contains a shortened URL", severity: "high" },
        { title: "Urgency Tactics Detected", description: "The message creates artificial time pressure", severity: "high" },
      ],
      senderAnalysis: { phone: "+91 98765 43210", inContacts: false, reportCount: 47, isNew: true },
      contentAnalysis: { hasLinks: true, linkDomain: "bit.ly/xyz", hasUrgency: true, grammarScore: 6, keywords: ["urgent", "verify", "suspended"] },
      recommendations: { do: ["Delete message", "Block sender"], dont: ["Don't click links", "Don't share info"] },
    },
  },
  {
    id: "2",
    date: "Jan 3, 2026",
    time: "5:15 PM",
    riskLevel: "medium",
    riskScore: 55,
    messagePreview: "Congratulations! You won ₹10 lakhs in our lucky draw. Click here to claim...",
    sender: "+91 87654 32109",
    fullResult: {
      riskScore: 55,
      riskLevel: "medium",
      confidence: 78,
      verdict: "This message shows some suspicious characteristics",
      action: "Verify the sender through official channels before responding",
      threats: [
        { title: "Prize Scam Pattern", description: "Matches known lottery scam patterns", severity: "medium" },
      ],
      senderAnalysis: { phone: "+91 87654 32109", inContacts: false, reportCount: 12, isNew: false },
      contentAnalysis: { hasLinks: true, linkDomain: "prize-claim.xyz", hasUrgency: false, grammarScore: 7, keywords: ["won", "lakhs", "claim"] },
      recommendations: { do: ["Verify with official sources", "Report if suspicious"], dont: ["Don't share bank details", "Don't pay any fees"] },
    },
  },
  {
    id: "3",
    date: "Jan 1, 2026",
    time: "10:45 AM",
    riskLevel: "low",
    riskScore: 15,
    messagePreview: "Your OTP is 123456. Valid for 10 minutes. Do not share with anyone.",
    sender: "HDFCBK",
    fullResult: {
      riskScore: 15,
      riskLevel: "low",
      confidence: 95,
      verdict: "This message appears to be legitimate",
      action: "Safe to proceed, but always stay vigilant",
      threats: [],
      senderAnalysis: { phone: "HDFCBK", inContacts: true, reportCount: 0, isNew: false },
      contentAnalysis: { hasLinks: false, hasUrgency: false, grammarScore: 9, keywords: ["OTP"] },
      recommendations: { do: ["Use OTP if you initiated transaction", "Never share OTP"], dont: ["Don't share with anyone calling"] },
    },
  },
  {
    id: "4",
    date: "Dec 28, 2025",
    time: "8:00 PM",
    riskLevel: "high",
    riskScore: 92,
    messagePreview: "URGENT: Your PAN Card is about to expire. Update now at pan-update.xyz...",
    sender: "+91 76543 21098",
  },
  {
    id: "5",
    date: "Dec 25, 2025",
    time: "3:45 PM",
    riskLevel: "low",
    riskScore: 12,
    messagePreview: "Your Amazon order #1234 has been shipped. Track at amazon.in/track...",
    sender: "AMAZON",
  },
];

const quickStats = {
  totalAnalyzed: 47,
  threatsDetected: 12,
  reportsShared: 5,
};

export function AnalysisHistory() {
  const [history, setHistory] = useState(mockHistory);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const [selectedReport, setSelectedReport] = useState<HistoryItem | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareResult, setShareResult] = useState<AnalysisResult | null>(null);

  const filteredHistory = history.filter((item) => {
    const matchesSearch = 
      item.messagePreview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sender.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || item.riskLevel === filter;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id: string) => {
    setHistory(history.filter((item) => item.id !== id));
    toast({
      title: "Analysis Deleted",
      description: "The analysis has been removed from your history.",
    });
  };

  const handleViewReport = (item: HistoryItem) => {
    setSelectedReport(item);
    setShowReportModal(true);
  };

  const handleShare = (item: HistoryItem) => {
    if (item.fullResult) {
      setShareResult(item.fullResult);
      setShowShareModal(true);
    } else {
      toast({
        title: "Share Report",
        description: "Opening share options...",
      });
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high": return "text-destructive";
      case "medium": return "text-warning";
      case "low": return "text-success";
    }
  };

  const getRiskBg = (level: string) => {
    switch (level) {
      case "high": return "bg-destructive";
      case "medium": return "bg-warning";
      case "low": return "bg-success";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "high": return <AlertTriangle className="h-5 w-5" />;
      case "medium": return <AlertTriangle className="h-5 w-5" />;
      case "low": return <CheckCircle className="h-5 w-5" />;
    }
  };

  const protectionRate = Math.round((quickStats.threatsDetected / quickStats.totalAnalyzed) * 100);

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <Card className="bg-gradient-primary">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-primary-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Your Protection Stats
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-foreground">{quickStats.totalAnalyzed}</p>
              <p className="text-sm text-primary-foreground/80">Total Analyzed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-foreground">{quickStats.threatsDetected}</p>
              <p className="text-sm text-primary-foreground/80">Threats Detected</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-foreground">{protectionRate}%</p>
              <p className="text-sm text-primary-foreground/80">Protection Rate</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-foreground">{quickStats.reportsShared}</p>
              <p className="text-sm text-primary-foreground/80">Reports Shared</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History List */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Analysis History
            </CardTitle>
            <div className="flex gap-2">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search history..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
                className="px-3 py-2 bg-secondary border border-border rounded-md text-sm"
              >
                <option value="all">All</option>
                <option value="high">High Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="low">Low Risk</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No analysis history found</p>
              <p className="text-sm text-muted-foreground">Your analyzed messages will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                >
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${getRiskBg(item.riskLevel)} ${item.riskLevel === "high" || item.riskLevel === "low" ? "text-primary-foreground" : "text-warning-foreground"}`}>
                    {getRiskIcon(item.riskLevel)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm font-semibold uppercase ${getRiskColor(item.riskLevel)}`}>
                        {item.riskLevel} RISK ({item.riskScore}/100)
                      </span>
                      <span className="text-sm text-muted-foreground">
                        • {item.date}, {item.time}
                      </span>
                    </div>
                    <p className="text-foreground truncate mb-1">
                      {item.messagePreview}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Sender: {item.sender}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleViewReport(item)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleShare(item)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Report Modal */}
      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Analysis Report
            </DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              {/* Risk Score */}
              <div className={`p-4 rounded-lg ${
                selectedReport.riskLevel === "high" ? "bg-destructive/10" :
                selectedReport.riskLevel === "medium" ? "bg-warning/10" : "bg-success/10"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRiskBg(selectedReport.riskLevel)} text-primary-foreground`}>
                    {getRiskIcon(selectedReport.riskLevel)}
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${getRiskColor(selectedReport.riskLevel)}`}>
                      {selectedReport.riskScore}/100
                    </p>
                    <p className="text-sm text-muted-foreground uppercase">
                      {selectedReport.riskLevel} Risk
                    </p>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Message</p>
                <p className="text-foreground">{selectedReport.messagePreview}</p>
              </div>

              {/* Sender */}
              <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Sender</p>
                <p className="text-foreground">{selectedReport.sender}</p>
              </div>

              {/* Threats if available */}
              {selectedReport.fullResult?.threats && selectedReport.fullResult.threats.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Threats Found:</p>
                  {selectedReport.fullResult.threats.map((threat, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg">
                      <XCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">{threat.title}</p>
                        <p className="text-xs text-muted-foreground">{threat.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Date */}
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Analyzed on: {selectedReport.date} at {selectedReport.time}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setShowReportModal(false);
                    if (selectedReport.fullResult) {
                      setShareResult(selectedReport.fullResult);
                      setShowShareModal(true);
                    }
                  }}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 text-destructive"
                  onClick={() => {
                    handleDelete(selectedReport.id);
                    setShowReportModal(false);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Share Modal */}
      {shareResult && (
        <ShareModal 
          isOpen={showShareModal}
          onClose={() => {
            setShowShareModal(false);
            setShareResult(null);
          }}
          result={shareResult}
        />
      )}
    </div>
  );
}
