import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Wallet, TrendingUp, Receipt, Settings, Wrench, LogOut, TrendingUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Buckets", href: "/buckets", icon: Wallet },
  { name: "Cash Flow", href: "/cash-flow", icon: TrendingUp },
  { name: "Transactions", href: "/transactions", icon: Receipt },
  { name: "Rules", href: "/rules", icon: Wrench },
  { name: "Investments", href: "/investments", icon: TrendingUpIcon },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (!loading && user) {
      // Check if onboarding is completed
      const checkOnboarding = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('user_id', user.id)
          .single();
        
        if (data && !data.onboarding_completed && window.location.pathname !== '/onboarding') {
          navigate('/onboarding');
        } else if (data && data.onboarding_completed && window.location.pathname === '/') {
          // If user is logged in and on landing page, redirect to dashboard
          navigate('/dashboard');
        }
      };
      checkOnboarding();
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
              <Wallet className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              FinTant
            </span>
          </div>
          <nav className="ml-auto flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-muted",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden md:inline">{item.name}</span>
                </Link>
              );
            })}
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="ml-2 gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">{children}</main>
    </div>
  );
}
