import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

export default function Transactions() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const transactions = [
    { id: 1, date: '2025-09-28', description: 'Amazon Purchase', amount: -45.99, category: 'Shopping' },
    { id: 2, date: '2025-09-27', description: 'Salary Deposit', amount: 3500, category: 'Income' },
    { id: 3, date: '2025-09-26', description: 'Starbucks', amount: -5.75, category: 'Food & Drink' },
    { id: 4, date: '2025-09-25', description: 'Electric Bill', amount: -120, category: 'Utilities' },
    { id: 5, date: '2025-09-24', description: 'Netflix', amount: -15.99, category: 'Entertainment' },
    { id: 6, date: '2025-09-23', description: 'Whole Foods', amount: -87.50, category: 'Food & Drink' },
    { id: 7, date: '2025-09-22', description: 'Gas Station', amount: -45.00, category: 'Transportation' },
    { id: 8, date: '2025-09-21', description: 'Target', amount: -32.15, category: 'Shopping' },
  ];

  const categories = Array.from(new Set(transactions.map(t => t.category)));
  
  const categoryTotals = categories.map(cat => {
    const total = transactions
      .filter(t => t.category === cat && t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    return { category: cat, total };
  }).filter(c => c.total > 0);

  const filteredTransactions = selectedCategory
    ? transactions.filter(t => t.category === selectedCategory)
    : transactions;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Transactions</h1>
        <p className="text-lg text-muted-foreground mt-2">
          View and categorize all your transactions.
        </p>
      </div>

      <Card className="p-6 bg-gradient-card shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Spending by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categoryTotals.map((cat) => (
            <div key={cat.category} className="text-center">
              <p className="text-2xl font-bold text-primary">${cat.total.toFixed(0)}</p>
              <p className="text-sm text-muted-foreground">{cat.category}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-gradient-card shadow-md">
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Badge>
            {categories.map((cat) => (
              <Badge
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {filteredTransactions.map((tx) => (
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
