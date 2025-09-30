import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

export default function Transactions() {
  const transactions = [
    { id: 1, date: '2025-09-28', description: 'Amazon Purchase', amount: -45.99, category: 'Shopping' },
    { id: 2, date: '2025-09-27', description: 'Salary Deposit', amount: 3500, category: 'Income' },
    { id: 3, date: '2025-09-26', description: 'Starbucks', amount: -5.75, category: 'Food & Drink' },
    { id: 4, date: '2025-09-25', description: 'Electric Bill', amount: -120, category: 'Utilities' },
    { id: 5, date: '2025-09-24', description: 'Netflix', amount: -15.99, category: 'Entertainment' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Transactions</h1>
        <p className="text-lg text-muted-foreground mt-2">
          View and categorize all your transactions.
        </p>
      </div>

      <Card className="p-6 bg-gradient-card shadow-md">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="space-y-1">
                <p className="font-medium">{tx.description}</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    {new Date(tx.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric'
                    })}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {tx.category}
                  </Badge>
                </div>
              </div>
              <p className={`text-lg font-semibold ${
                tx.amount > 0 ? 'text-success' : 'text-foreground'
              }`}>
                {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
