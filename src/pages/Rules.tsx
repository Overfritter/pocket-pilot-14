import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Zap, Sparkles, TrendingUp, PiggyBank, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import RuleDialog from "@/components/RuleDialog";

interface Rule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
}

interface SuggestedRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  icon: React.ReactNode;
  reason: string;
  recommended?: boolean;
}

interface Profile {
  risk_tolerance: string | null;
  financial_goal: string | null;
  top_priority: string | null;
  finance_personality: string | null;
}

interface Goal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
}

export default function Rules() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [suggestedRules, setSuggestedRules] = useState<SuggestedRule[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);

  const generateSuggestedRules = (profile: Profile | null, goals: Goal[]) => {
    const suggestions: SuggestedRule[] = [];

    // Base suggestions based on profile
    if (profile?.risk_tolerance === "conservative" || profile?.risk_tolerance === "low") {
      suggestions.push({
        id: "suggested-emergency",
        name: "Emergency Fund Builder",
        trigger: "When income is received",
        action: "Transfer 20% to Emergency Fund bucket",
        icon: <Shield className="h-5 w-5 text-emerald-500" />,
        reason: "Based on your conservative approach",
      });
    }

    if (profile?.financial_goal?.toLowerCase().includes("save") || profile?.top_priority?.toLowerCase().includes("save")) {
      suggestions.push({
        id: "suggested-savings",
        name: "Auto-Save on Payday",
        trigger: "Every payday",
        action: "Transfer 15% of income to Savings bucket",
        icon: <PiggyBank className="h-5 w-5 text-primary" />,
        reason: "Aligned with your savings goal",
      });
    }

    if (profile?.risk_tolerance === "aggressive" || profile?.risk_tolerance === "high") {
      suggestions.push({
        id: "suggested-invest",
        name: "Investment Auto-Allocate",
        trigger: "When Savings bucket exceeds $1,000",
        action: "Transfer excess to Investment account",
        icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
        reason: "Matches your growth-focused strategy",
      });
    }

    // Goal-based suggestions
    goals.forEach((goal, index) => {
      const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
      if (progress < 50 && index < 2) {
        suggestions.push({
          id: `suggested-goal-${goal.id}`,
          name: `Boost "${goal.name}" Progress`,
          trigger: "On every transaction under $10 savings",
          action: `Round up and transfer to ${goal.name}`,
          icon: <Sparkles className="h-5 w-5 text-amber-500" />,
          reason: `Goal is ${Math.round(progress)}% complete`,
        });
      }
    });

    // Default suggestion if no profile-based ones
    if (suggestions.length === 0) {
      suggestions.push({
        id: "suggested-default",
        name: "Smart Round-Up Savings",
        trigger: "On every purchase",
        action: "Round up to nearest dollar and save the difference",
        icon: <Sparkles className="h-5 w-5 text-amber-500" />,
        reason: "Popular rule for easy savings",
        recommended: false,
      });
    }

    // Always add the recommended allocation rule at the beginning
    suggestions.unshift({
      id: "suggested-smart-allocation",
      name: "Smart Money Allocation",
      trigger: "When income is received",
      action: "Automatically allocate funds across buckets based on your goals and financial situation",
      icon: <TrendingUp className="h-5 w-5 text-emerald-500" />,
      reason: "Personalized allocation strategy",
      recommended: true,
    });

    return suggestions.slice(0, 4); // Max 4 suggestions
  };

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setRules([]);
        setLoading(false);
        return;
      }

      // Fetch rules, profile, and goals in parallel
      const [rulesResult, profileResult, goalsResult] = await Promise.all([
        supabase
          .from("rules")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("profiles")
          .select("risk_tolerance, financial_goal, top_priority, finance_personality")
          .eq("user_id", user.id)
          .single(),
        supabase
          .from("goals")
          .select("id, name, target_amount, current_amount")
          .eq("user_id", user.id)
          .eq("status", "active")
          .limit(5),
      ]);

      if (rulesResult.error) throw rulesResult.error;
      
      setRules(rulesResult.data || []);
      setProfile(profileResult.data);
      setGoals(goalsResult.data || []);
      
      // Generate suggested rules based on profile and goals
      const suggested = generateSuggestedRules(profileResult.data, goalsResult.data || []);
      setSuggestedRules(suggested);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error fetching data:", error);
      }
      toast({
        title: "Error",
        description: "Unable to load rules. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuggestedRule = async (suggested: SuggestedRule) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Please sign in to add rules.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("rules").insert({
        user_id: user.id,
        name: suggested.name,
        trigger: suggested.trigger,
        action: suggested.action,
        enabled: true,
      });

      if (error) throw error;

      toast({
        title: "Rule Added",
        description: `"${suggested.name}" has been added to your rules.`,
      });

      // Remove from suggestions and refresh rules
      setSuggestedRules((prev) => prev.filter((r) => r.id !== suggested.id));
      fetchData();
    } catch (error) {
      console.error("Error adding rule:", error);
      toast({
        title: "Error",
        description: "Failed to add rule. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Funding Rules</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Automate how money flows between your buckets.
          </p>
        </div>
        <Button size="lg" className="gap-2" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Create Rule
        </Button>
      </div>

      {/* Suggested/Automated Rules Section */}
      {!loading && suggestedRules.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-semibold">Suggested for You</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {suggestedRules.map((suggested) => (
              <Card
                key={suggested.id}
                className={`p-4 border-dashed hover:shadow-md transition-all cursor-pointer group ${
                  suggested.recommended 
                    ? "bg-gradient-to-br from-emerald-500/10 via-background to-primary/5 border-emerald-500/50 hover:border-emerald-500/70 ring-1 ring-emerald-500/20" 
                    : "bg-gradient-to-br from-primary/5 via-background to-amber-500/5 border-primary/30 hover:border-primary/50"
                }`}
                onClick={() => handleAddSuggestedRule(suggested)}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      suggested.recommended ? "bg-emerald-500/20" : "bg-primary/10"
                    }`}>
                      {suggested.icon}
                    </div>
                    <div className="flex gap-1.5">
                      {suggested.recommended && (
                        <Badge className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white">
                          Recommended
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 border-amber-500/30">
                        Click to Add
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {suggested.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">{suggested.reason}</p>
                  </div>
                  <div className="text-xs space-y-1 text-muted-foreground">
                    <p><span className="font-medium text-foreground">When:</span> {suggested.trigger}</p>
                    <p><span className="font-medium text-foreground">Then:</span> {suggested.action}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading rules...
        </div>
      ) : rules.length === 0 ? (
        <Card className="p-8 text-center bg-muted/50">
          <div className="mx-auto max-w-md space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Smart, Explainable Automation</h3>
              <p className="mt-2 text-muted-foreground">
                Rules help FinTant automatically move money where it needs to go. 
                Set triggers, define formulas, and we'll handle the rest.
              </p>
            </div>
            <Button size="lg" variant="outline" className="gap-2" onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Create Your First Rule
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your Rules</h2>
          {rules.map((rule) => (
            <Card
              key={rule.id}
              className="p-6 bg-gradient-card shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{rule.name}</h3>
                      <Badge variant={rule.enabled ? 'default' : 'secondary'}>
                        {rule.enabled ? 'Active' : 'Disabled'}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">When:</span> {rule.trigger}
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">Then:</span> {rule.action}
                      </p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <RuleDialog open={dialogOpen} setOpen={setDialogOpen} onSuccess={fetchData} />
    </div>
  );
}
