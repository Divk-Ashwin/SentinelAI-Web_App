import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { History as HistoryIcon, Shield, AlertTriangle, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function History() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      toast({ title: "Please login first", variant: "destructive" });
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-8">Analysis History</h1>
            
            {/* Empty State */}
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
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
