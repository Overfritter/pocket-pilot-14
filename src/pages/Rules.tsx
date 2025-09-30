import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Zap } from "lucide-react";

export default function Rules() {
  const rules = [
    { 
      id: 1, 
      name: 'Auto-fund Expenses', 
      trigger: 'Income received', 
      action: 'Move 60% to Expenses bucket',
      enabled: true 
    },
    { 
      id: 2, 
      name: 'Save for Travel', 
      trigger: 'Monthly on 1st', 
      action: 'Transfer $200 to Travel bucket',
      enabled: true 
    },
    { 
      id: 3, 
      name: 'Emergency Fund Boost', 
      trigger: 'Balance > $5000', 
      action: 'Move excess to Emergency Fund',
      enabled: false 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Funding Rules</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Automate how money flows between your buckets.
          </p>
        </div>
        <Button size="lg" className="gap-2">
          <Plus className="h-4 w-4" />
          Create Rule
        </Button>
      </div>

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
          <Button size="lg" variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Create Your First Rule
          </Button>
        </div>
      </Card>
    </div>
  );
}
