import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, AlertCircle, TrendingUp, TrendingDown, Receipt } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  // Mock data
  const totalBalance = 12450.75;
  const projectedIncome = 5000;
  const upcomingExpenses = 2845.50;
  const netCashFlow = projectedIncome - upcomingExpenses;

  const alerts = [
    { id: 1, type: "warning", message: "Travel bucket is 20% behind schedule" },
    { id: 2, type: "info", message: "Recurring payment due in 3 days: Netflix $15.99" },
  ];

  // Mock 30-day forecast data points
  const forecastDays = Array.from({ length: 30 }, (_, i) => {
    const variation = Math.sin(i / 5) * 1000;
    return {
      day: i + 1,
      balance: totalBalance + (netCashFlow / 30) * i + variation,
    };
  });

  const maxBalance = Math.max(...forecastDays.map(d => d.balance));
  const minBalance = Math.min(...forecastDays.map(d => d.balance));
  const range = maxBalance - minBalance;

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Your money, automatically organized.</h1>
        <p className="text-lg text-muted-foreground">
          Welcome back! Here's what's happening with your finances.
        </p>
      </div>

      {/* Balance Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6 bg-gradient-card shadow-md hover:shadow-lg transition-shadow">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
            <p className="text-3xl font-bold">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className="text-xs text-muted-foreground">Across all accounts</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card shadow-md hover:shadow-lg transition-shadow">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Projected Income</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-success">${projectedIncome.toLocaleString()}</p>
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card shadow-md hover:shadow-lg transition-shadow">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Upcoming Expenses</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-destructive">${upcomingExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <TrendingDown className="h-5 w-5 text-destructive" />
            </div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </div>
        </Card>
      </div>

      {/* 30-Day Forecast Chart */}
      <Card className="p-6 bg-gradient-card shadow-md">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">30-Day Cash Flow Forecast</h2>
              <p className="text-sm text-muted-foreground">
                Projected balance: ${forecastDays[29].balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <Badge variant={netCashFlow > 0 ? "default" : "destructive"} className="text-sm">
              {netCashFlow > 0 ? '+' : ''}{netCashFlow.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </Badge>
          </div>

          {/* Simple line chart */}
          <div className="relative h-64 w-full">
            <svg className="h-full w-full" viewBox="0 0 900 200" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="0" y1="50" x2="900" y2="50" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" />
              <line x1="0" y1="100" x2="900" y2="100" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" />
              <line x1="0" y1="150" x2="900" y2="150" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" />

              {/* Forecast line */}
              <polyline
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={forecastDays
                  .map((d, i) => {
                    const x = (i / (forecastDays.length - 1)) * 900;
                    const y = 180 - ((d.balance - minBalance) / range) * 160;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />

              {/* Area fill */}
              <polygon
                fill="hsl(var(--primary))"
                fillOpacity="0.1"
                points={
                  forecastDays
                    .map((d, i) => {
                      const x = (i / (forecastDays.length - 1)) * 900;
                      const y = 180 - ((d.balance - minBalance) / range) * 160;
                      return `${x},${y}`;
                    })
                    .join(' ') + ' 900,180 0,180'
                }
              />

              {/* Today marker */}
              <line x1="30" y1="0" x2="30" y2="200" stroke="hsl(var(--accent))" strokeWidth="2" strokeDasharray="4" />
              <text x="35" y="15" fill="hsl(var(--accent))" fontSize="12" fontWeight="600">Today</text>
            </svg>

            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 flex h-full flex-col justify-between text-xs text-muted-foreground">
              <span>${maxBalance.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
              <span>${((maxBalance + minBalance) / 2).toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
              <span>${minBalance.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Alerts & Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Alerts */}
        <Card className="p-6 bg-gradient-card shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Alerts</h2>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
              >
                <AlertCircle className={`h-5 w-5 flex-shrink-0 ${
                  alert.type === 'warning' ? 'text-warning' : 'text-primary'
                }`} />
                <p className="text-sm">{alert.message}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 bg-gradient-card shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/buckets">
              <Button variant="outline" className="w-full justify-start gap-2" size="lg">
                <Plus className="h-4 w-4" />
                Create New Bucket
              </Button>
            </Link>
            <Link to="/rules">
              <Button variant="outline" className="w-full justify-start gap-2" size="lg">
                <Plus className="h-4 w-4" />
                Add Funding Rule
              </Button>
            </Link>
            <Link to="/transactions">
              <Button variant="outline" className="w-full justify-start gap-2" size="lg">
                <Receipt className="h-4 w-4" />
                View All Transactions
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
