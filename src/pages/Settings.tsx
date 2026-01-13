import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { Settings as SettingsIcon, User, Globe, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Settings() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [language, setLanguage] = useState(localStorage.getItem('analysisLanguage') || 'english');

  useEffect(() => {
    if (!isAuthenticated) {
      toast({ title: "Please login first", variant: "destructive" });
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    localStorage.setItem('analysisLanguage', value);
    toast({ title: "Language preference saved" });
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-8">Account Settings</h1>
            
            {/* Profile */}
            <Card className="bg-card border-border mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Name</Label>
                  <p className="text-foreground font-medium">{user?.name || 'User'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="text-foreground font-medium">{user?.email || 'user@example.com'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="bg-card border-border mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Default Analysis Language</Label>
                    <p className="text-sm text-muted-foreground">Reports will be in this language</p>
                  </div>
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">Hindi</SelectItem>
                      <SelectItem value="telugu">Telugu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-delete History</Label>
                    <p className="text-sm text-muted-foreground">Delete analyses after 30 days</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="bg-destructive/5 border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Trash2 className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" size="sm">Delete My Account</Button>
                <p className="text-xs text-muted-foreground mt-2">This action cannot be undone.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
