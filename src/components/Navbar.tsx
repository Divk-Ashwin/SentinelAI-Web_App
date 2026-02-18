import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShieldCheck, Menu, Settings, HelpCircle, LogOut } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  // Logged out navigation
  const loggedOutLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Help", href: "/help" },
    { label: "Try Demo", href: "/demo" },
  ];

  // Logged in navigation
  const loggedInLinks = [
    { label: "Home", href: "/" },
    { label: "Analyze", href: "/analyze" },
    { label: "History", href: "/history" },
    { label: "About", href: "/about" },
    { label: "Help", href: "/help" },
  ];

  const navLinks = user ? loggedInLinks : loggedOutLinks;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    navigate(href);
  };

  const handleLogout = async () => {
    const { error } = await signOut();

    if (error) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Logged out successfully",
      duration: 3000,
    });
    navigate("/");
  };

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      const parts = name.split(" ");
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return name.slice(0, 2).toUpperCase();
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const getUserDisplayName = () => {
    return user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[1000] w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-lg shadow-primary/10"
          : "bg-background/80 backdrop-blur-md border-b border-border"
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-primary shadow-md">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">SentinelAI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-150 relative ${
                  isActive(link.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-primary text-white font-semibold text-sm hover:scale-105 hover:shadow-lg transition-all duration-200">
                    {getInitials(user.user_metadata?.full_name, user.email)}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 mt-2">
                  <div className="px-2 py-1.5 text-sm">
                    <p className="font-medium">{getUserDisplayName()}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/help")}>
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Help Center
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                    Login
                  </Button>
                </Link>
                <Link to="/auth?tab=register">
                  <Button size="sm" className="bg-gradient-primary hover:opacity-90 transition-opacity text-white rounded-full px-5">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-gradient-hero border-l border-white/10">
                <div className="flex flex-col gap-6 mt-6">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-primary">
                      <ShieldCheck className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">SentinelAI</span>
                  </div>

                  {user && (
                    <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl border border-white/10">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-primary text-white font-semibold text-sm">
                        {getInitials(user.user_metadata?.full_name, user.email)}
                      </div>
                      <div>
                        <p className="font-medium text-white">{getUserDisplayName()}</p>
                        <p className="text-xs text-white/50 truncate max-w-[180px]">{user.email}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    {navLinks.map((link) => (
                      <button
                        key={link.label}
                        onClick={() => handleNavClick(link.href)}
                        className={`px-4 py-3 text-sm font-medium rounded-xl text-left transition-colors ${
                          isActive(link.href)
                            ? "text-primary bg-primary/10"
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {link.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                    {user ? (
                      <>
                        <Button
                          variant="outline"
                          className="w-full justify-start border-white/20 text-white hover:bg-white/10"
                          onClick={() => { setIsOpen(false); navigate("/settings"); }}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => { setIsOpen(false); handleLogout(); }}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link to="/auth" onClick={() => setIsOpen(false)}>
                          <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                            Login
                          </Button>
                        </Link>
                        <Link to="/auth?tab=register" onClick={() => setIsOpen(false)}>
                          <Button className="w-full bg-gradient-primary text-white rounded-full">
                            Sign Up
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}
