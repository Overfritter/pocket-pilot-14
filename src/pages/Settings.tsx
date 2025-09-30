import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Customize your FinTant experience.
        </p>
      </div>

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
            <Plus className="h-4 w-4" />
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

function Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
