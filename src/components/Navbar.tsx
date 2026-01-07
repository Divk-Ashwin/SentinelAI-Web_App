import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Shield, Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

const navLinks = [
  { label: "Home", href: "/#hero" },
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Statistics", href: "/#statistics" },
  { label: "About", href: "/about" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, setRedirectPath } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      
      // Track active section
      if (location.pathname === "/") {
        const sections = ["hero", "features", "how-it-works", "statistics", "languages"];
        for (const section of sections.reverse()) {
          const el = document.getElementById(section);
          if (el && el.getBoundingClientRect().top <= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("/#")) {
      const sectionId = href.replace("/#", "");
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(href);
    }
  };

  const handleAnalyzeClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      setRedirectPath("/dashboard");
      toast({
        title: "Please login first",
        description: "You need to be logged in to analyze messages",
        duration: 3000,
      });
      navigate("/auth");
    }
  };

  const isActive = (href: string) => {
    if (href.startsWith("/#")) {
      const sectionId = href.replace("/#", "");
      return location.pathname === "/" && activeSection === sectionId;
    }
    return location.pathname === href;
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-lg shadow-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">SentinelAI</span>
          </Link>

          {/* Desktop Navigation - hidden below lg (1024px) */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className={`px-4 py-2 text-sm font-medium transition-colors rounded-md ${
                  isActive(link.href)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA - hidden below lg */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <Link to="/auth">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Button 
              size="sm" 
              className="bg-gradient-primary hover:opacity-90 transition-opacity"
              onClick={handleAnalyzeClick}
            >
              Analyze Now
            </Button>
          </div>

          {/* Mobile/Tablet Menu - visible below lg */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-background">
                <div className="flex flex-col gap-6 mt-6">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-primary">
                      <Shield className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold">SentinelAI</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                      <button
                        key={link.label}
                        onClick={() => handleNavClick(link.href)}
                        className={`px-4 py-3 text-sm font-medium rounded-md text-left ${
                          isActive(link.href)
                            ? "text-primary bg-primary/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        }`}
                      >
                        {link.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3 pt-4 border-t border-border">
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Button 
                      className="w-full bg-gradient-primary"
                      onClick={() => {
                        setIsOpen(false);
                        handleAnalyzeClick();
                      }}
                    >
                      Analyze Now
                    </Button>
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
