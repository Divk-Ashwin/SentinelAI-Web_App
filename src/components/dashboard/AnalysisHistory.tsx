import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  History, 
  Search, 
  Trash2, 
  Eye, 
  Share2,
  Shield,
  AlertTriangle,
  CheckCircle,
  TrendingUp
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface HistoryItem {
  id: string;
  date: string;
  time: string;
  riskLevel: "low" | "medium" | "high";
  riskScore: number;
  messagePreview: string;
  sender: string;
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
  },
  {
    id: "2",
    date: "Jan 3, 2026",
    time: "5:15 PM",
    riskLevel: "medium",
    riskScore: 55,
    messagePreview: "Congratulations! You won ₹10 lakhs in our lucky draw. Click here to claim...",
    sender: "+91 87654 32109",
  },
  {
    id: "3",
    date: "Jan 1, 2026",
    time: "10:45 AM",
    riskLevel: "low",
    riskScore: 15,
    messagePreview: "Your OTP is 123456. Valid for 10 minutes. Do not share with anyone.",
    sender: "HDFCBK",
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
  moneySaved: "₹85,000",
  reportsShared: 5,
};

export function AnalysisHistory() {
  const [history, setHistory] = useState(mockHistory);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">("all");

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
              <p className="text-3xl font-bold text-primary-foreground">{quickStats.moneySaved}</p>
              <p className="text-sm text-primary-foreground/80">Potentially Saved</p>
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
                        {item.riskLevel} RISK
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
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
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
    </div>
  );
}
