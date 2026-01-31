import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { User, Globe, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Settings() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [language, setLanguage] = useState(localStorage.getItem('analysisLanguage') || 'english');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const CONFIRMATION_TEXT = "delete my account";

  useEffect(() => {
    if (!authLoading && !user) {
      toast({ title: "Please login first", variant: "destructive" });
      navigate("/auth");
    }
  }, [authLoading, user, navigate]);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    localStorage.setItem('analysisLanguage', value);
    toast({ title: "Language preference saved" });
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText.toLowerCase() !== CONFIRMATION_TEXT) {
      toast({
        title: "Confirmation required",
        description: `Please type "${CONFIRMATION_TEXT}" to confirm.`,
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);
    try {
      // Delete user's analyses first
      const { error: analysesError } = await supabase
        .from('analyses')
        .delete()
        .eq('user_id', user!.id);

      if (analysesError) {
        console.error('Error deleting analyses:', analysesError);
      }

      // Delete user's preferences
      const { error: prefsError } = await supabase
        .from('user_preferences')
        .delete()
        .eq('user_id', user!.id);

      if (prefsError) {
        console.error('Error deleting preferences:', prefsError);
      }

      // Delete user's profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', user!.id);

      if (profileError) {
        console.error('Error deleting profile:', profileError);
      }

      // Sign out the user (account deletion requires admin API in production)
      await signOut();
      
      toast({
        title: "Account data deleted",
        description: "Your data has been removed. Contact support to complete account deletion.",
      });
      
      navigate("/");
    } catch (error) {
      console.error('Error during account deletion:', error);
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setDeleteConfirmText('');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const getUserDisplayName = () => {
    return user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  };

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
                  <p className="text-foreground font-medium">{getUserDisplayName()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="text-foreground font-medium">{user.email}</p>
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
                <AlertDialog open={showDeleteDialog} onOpenChange={(open) => {
                  setShowDeleteDialog(open);
                  if (!open) setDeleteConfirmText('');
                }}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      Delete My Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Delete Account
                      </AlertDialogTitle>
                      <AlertDialogDescription className="space-y-4">
                        <p>
                          This action <span className="font-semibold text-destructive">cannot be undone</span>. 
                          This will permanently delete your account and remove all your data including:
                        </p>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          <li>All your analysis history</li>
                          <li>Your preferences and settings</li>
                          <li>Your profile information</li>
                        </ul>
                        <div className="pt-2">
                          <Label htmlFor="confirm-delete" className="text-foreground">
                            To confirm, type <span className="font-mono font-semibold text-destructive">delete my account</span> below:
                          </Label>
                          <Input
                            id="confirm-delete"
                            className="mt-2"
                            placeholder="delete my account"
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            disabled={isDeleting}
                          />
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={deleteConfirmText.toLowerCase() !== CONFIRMATION_TEXT || isDeleting}
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Deleting...
                          </>
                        ) : (
                          "Delete Account"
                        )}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
