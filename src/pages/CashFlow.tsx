import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, TrendingDown } from "lucide-react";

export default function CashFlow() {
  const events = [
    { date: '2025-10-02', type: 'income', amount: 3500, description: 'Salary Payment', confidence: 'high' },
    { date: '2025-10-05', type: 'expense', amount: 1200, description: 'Rent', confidence: 'high' },
    { date: '2025-10-10', type: 'expense', amount: 150, description: 'Utilities', confidence: 'medium' },
    { date: '2025-10-15', type: 'income', amount: 500, description: 'Freelance Project', confidence: 'medium' },
    { date: '2025-10-20', type: 'expense', amount: 200, description: 'Groceries (Est.)', confidence: 'low' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Cash Flow</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Track when money comes in and goes out.
        </p>
      </div>

      <Card className="p-6 bg-gradient-card shadow-md">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Next 30 Days</h2>
        </div>

        <div className="space-y-4">
          {events.map((event, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                event.type === 'income' ? 'bg-success/10' : 'bg-destructive/10'
              }`}>
                {event.type === 'income' ? (
                  <TrendingUp className="h-5 w-5 text-success" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-destructive" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{event.description}</p>
                  <Badge variant={
                    event.confidence === 'high' ? 'default' : 
                    event.confidence === 'medium' ? 'secondary' : 'outline'
                  } className="text-xs">
                    {event.confidence}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}</p>
              </div>
              
              <p className={`text-lg font-semibold ${
                event.type === 'income' ? 'text-success' : 'text-destructive'
              }`}>
                {event.type === 'income' ? '+' : '-'}${event.amount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-muted/50">
        <p className="text-sm text-muted-foreground">
          💡 <span className="font-medium text-foreground">Confidence bands</span> show how sure we are about each transaction. 
          High confidence means recurring or confirmed payments.
        </p>
      </Card>
    </div>
  );
}
