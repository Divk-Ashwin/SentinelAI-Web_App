import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { getUserAnalyses, deleteAnalysis, getAnalysisStats } from "@/services/analysisService";
import type { AnalysisRow } from "@/types";
import { 
  History as HistoryIcon, 
  Shield, 
  AlertTriangle, 
  Search, 
  Trash2, 
  Loader2,
  Phone,
  Calendar,
  Clock,
  ShieldCheck,
  ShieldAlert,
  ShieldX
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function History() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [analyses, setAnalyses] = useState<AnalysisRow[]>([]);
  const [stats, setStats] = useState({ total: 0, highRisk: 0, mediumRisk: 0, lowRisk: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Auth protection
  useEffect(() => {
    if (!authLoading && !user) {
      toast({ title: "Please login first", variant: "destructive" });
      navigate("/auth");
    }
  }, [authLoading, user, navigate]);

  // Fetch analyses and stats
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setIsLoading(true);
    
    const [analysesResult, statsResult] = await Promise.all([
      getUserAnalyses(),
      getAnalysisStats(),
    ]);

    if (analysesResult.success && analysesResult.data) {
      setAnalyses(analysesResult.data);
    }

    if (statsResult.success && statsResult.data) {
      setStats(statsResult.data);
    }

    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    setIsDeleting(true);
    const result = await deleteAnalysis(deleteId);
    setIsDeleting(false);
    setDeleteId(null);

    if (result.success) {
      setAnalyses(analyses.filter(a => a.id !== deleteId));
      setStats(prev => {
        const deleted = analyses.find(a => a.id === deleteId);
        return {
          total: prev.total - 1,
          highRisk: prev.highRisk - (deleted?.risk_level === 'HIGH' ? 1 : 0),
          mediumRisk: prev.mediumRisk - (deleted?.risk_level === 'MEDIUM' ? 1 : 0),
          lowRisk: prev.lowRisk - (deleted?.risk_level === 'LOW' ? 1 : 0),
        };
      });
      toast({ title: "Analysis deleted" });
    } else {
      toast({ title: "Failed to delete", description: result.error, variant: "destructive" });
    }
  };

  const getRiskBadge = (level: string | null) => {
    switch (level) {
      case 'HIGH':
        return <Badge variant="destructive" className="gap-1"><ShieldX className="h-3 w-3" /> High Risk</Badge>;
      case 'MEDIUM':
        return <Badge variant="secondary" className="gap-1 bg-warning/20 text-warning border-warning/30"><ShieldAlert className="h-3 w-3" /> Medium</Badge>;
      case 'LOW':
        return <Badge variant="secondary" className="gap-1 bg-success/20 text-success border-success/30"><ShieldCheck className="h-3 w-3" /> Low Risk</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-8">Analysis History</h1>
            
            {/* Quick Stats */}
            {stats.total > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card className="bg-card border-border">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                    <p className="text-sm text-muted-foreground">Total Analyzed</p>
                  </CardContent>
                </Card>
                <Card className="bg-destructive/10 border-destructive/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-destructive">{stats.highRisk}</p>
                    <p className="text-sm text-muted-foreground">High Risk</p>
                  </CardContent>
                </Card>
                <Card className="bg-warning/10 border-warning/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-warning">{stats.mediumRisk}</p>
                    <p className="text-sm text-muted-foreground">Medium Risk</p>
                  </CardContent>
                </Card>
                <Card className="bg-success/10 border-success/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-success">{stats.lowRisk}</p>
                    <p className="text-sm text-muted-foreground">Low Risk</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : analyses.length === 0 ? (
              /* Empty State */
              <Card className="bg-card border-border">
                <CardContent className="py-16 text-center">
                  <HistoryIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-foreground mb-2">No Analysis History Yet</h2>
                  <p className="text-muted-foreground mb-6">Messages you analyze will appear here</p>
                  <Button onClick={() => navigate("/analyze")} className="bg-gradient-primary">
                    <Search className="h-4 w-4 mr-2" />
                    Analyze Your First Message
                  </Button>
                </CardContent>
              </Card>
            ) : (
              /* History List */
              <div className="space-y-4">
                {analyses.map((analysis) => (
                  <Card key={analysis.id} className="bg-card border-border hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            {getRiskBadge(analysis.risk_level)}
                            <span className="text-sm text-muted-foreground">
                              Score: {analysis.risk_score}/100
                            </span>
                          </div>
                          
                          <p className="text-foreground line-clamp-2 mb-3">
                            {analysis.message_content}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Phone className="h-3.5 w-3.5" />
                              {analysis.sender_phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {formatDate(analysis.date_received)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {analysis.time_received}
                            </span>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive shrink-0"
                          onClick={() => setDeleteId(analysis.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Analysis?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this analysis from your history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
