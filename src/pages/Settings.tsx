import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Home, PiggyBank, CreditCard } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type FinancialFocus = 'investing' | 'home_buyer' | 'saving_retirement' | 'debt_payoff' | null;


export default function Settings() {
  const [financialFocus, setFinancialFocus] = useState<FinancialFocus>(null);
  const { toast } = useToast();

  const handleSaveFinancialFocus = async () => {
    if (!financialFocus) {
      toast({
        title: "Error",
        description: "Please select a financial focus",
        variant: "destructive",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save settings",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ financial_focus: financialFocus })
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save your financial focus",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Your financial focus has been saved",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Customize your FinTant experience.
        </p>
      </div>

      {/* Financial Focus Section */}
      <Card className="p-6 bg-gradient-card shadow-md">
        <h2 className="text-xl font-semibold mb-4">Financial Focus</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Choose your primary financial goal to personalize your experience
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setFinancialFocus('investing')}
            className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
              financialFocus === 'investing' 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-start gap-3">
              <Target className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div className="text-left">
                <h3 className="font-semibold mb-1">Investing</h3>
                <p className="text-sm text-muted-foreground">
                  Focus on growing wealth through investments
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setFinancialFocus('home_buyer')}
            className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
              financialFocus === 'home_buyer' 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-start gap-3">
              <Home className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div className="text-left">
                <h3 className="font-semibold mb-1">Home Buyer</h3>
                <p className="text-sm text-muted-foreground">
                  Saving for a down payment on a home
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setFinancialFocus('saving_retirement')}
            className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
              financialFocus === 'saving_retirement' 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-start gap-3">
              <PiggyBank className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div className="text-left">
                <h3 className="font-semibold mb-1">Saving/Retirement</h3>
                <p className="text-sm text-muted-foreground">
                  Building long-term savings and retirement fund
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setFinancialFocus('debt_payoff')}
            className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
              financialFocus === 'debt_payoff' 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-start gap-3">
              <CreditCard className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div className="text-left">
                <h3 className="font-semibold mb-1">Debt Payoff</h3>
                <p className="text-sm text-muted-foreground">
                  Paying off debts as quickly as possible
                </p>
              </div>
            </div>
          </button>
        </div>
        <div className="mt-4">
          <Button onClick={handleSaveFinancialFocus} disabled={!financialFocus}>
            Save Financial Focus
          </Button>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 bg-gradient-card shadow-md">
          <h2 className="text-xl font-semibold mb-4">Preferences</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select defaultValue="usd">
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                  <SelectItem value="gbp">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expense-percent">Default Expenses Auto-funding (%)</Label>
              <Input id="expense-percent" type="number" defaultValue="60" min="0" max="100" />
              <p className="text-xs text-muted-foreground">
                Percentage of income automatically moved to Expenses bucket
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card shadow-md">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Low Balance Alerts</Label>
                <p className="text-xs text-muted-foreground">
                  Get notified when balance drops below threshold
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Bucket Goal Reminders</Label>
                <p className="text-xs text-muted-foreground">
                  Weekly updates on bucket progress
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Upcoming Expenses</Label>
                <p className="text-xs text-muted-foreground">
                  3-day advance notice for bills
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-gradient-card shadow-md">
        <h2 className="text-xl font-semibold mb-4">Connected Accounts</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Chase Checking ****1234</p>
              <p className="text-sm text-muted-foreground">Connected 3 months ago</p>
            </div>
            <Button variant="outline" size="sm">Manage</Button>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Wells Fargo Savings ****5678</p>
              <p className="text-sm text-muted-foreground">Connected 3 months ago</p>
            </div>
            <Button variant="outline" size="sm">Manage</Button>
          </div>
          <Button variant="outline" className="w-full gap-2">
            <Target className="h-4 w-4" />
            Connect New Account
          </Button>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button size="lg">Save Changes</Button>
      </div>
    </div>
  );
}
