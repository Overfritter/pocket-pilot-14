import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Zap } from "lucide-react";
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

export default function Rules() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchRules = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setRules([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("rules")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRules(data || []);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error fetching rules:", error);
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

  useEffect(() => {
    fetchRules();
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

      <RuleDialog open={dialogOpen} setOpen={setDialogOpen} onSuccess={fetchRules} />
    </div>
  );
}
