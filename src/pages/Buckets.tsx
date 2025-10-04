import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Bucket {
  id: string;
  name: string;
  current: number;
  target: number;
  icon: string;
  color: string;
}

export default function Buckets() {
  const buckets: Bucket[] = [
    { id: '1', name: 'Travel', current: 1250, target: 5000, icon: '✈️', color: 'hsl(var(--primary))' },
    { id: '2', name: 'Emergency Fund', current: 4500, target: 10000, icon: '🛡️', color: 'hsl(var(--success))' },
    { id: '3', name: 'New Laptop', current: 800, target: 2000, icon: '💻', color: 'hsl(var(--accent))' },
    { id: '4', name: 'Expenses', current: 3200, target: 3500, icon: '🏠', color: 'hsl(var(--secondary))' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Your Buckets</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Give your goals a home.
          </p>
        </div>
        <Button size="lg" className="gap-2">
          <Plus className="h-4 w-4" />
          Create Bucket
        </Button>
      </div>

      {/* Buckets Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {buckets.map((bucket) => {
          const progress = (bucket.current / bucket.target) * 100;
          const remaining = bucket.target - bucket.current;
          const isComplete = progress >= 100;
          
          return (
            <Card
              key={bucket.id}
              className="group relative overflow-hidden p-6 bg-gradient-card shadow-md hover:shadow-glow transition-all cursor-pointer"
            >
              {/* Progress Ring Background */}
              <div className="absolute -right-8 -top-8 h-32 w-32 opacity-10">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={bucket.color}
                    strokeWidth="8"
                    strokeDasharray={`${progress * 2.51} 251`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>

              <div className="relative space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-2xl">
                      {bucket.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{bucket.name}</h3>
                      {bucket.name === 'Expenses' && (
                        <Badge variant="secondary" className="mt-1">Default</Badge>
                      )}
                    </div>
                  </div>
                  {isComplete && (
                    <Target className="h-5 w-5 text-success" />
                  )}
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold">
                      ${bucket.current.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      of ${bucket.target.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={Math.min(progress, 100)} className="h-2" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium" style={{ color: bucket.color }}>
                      {progress.toFixed(0)}% funded
                    </span>
                    {!isComplete && (
                      <span className="text-muted-foreground">
                        ${remaining.toLocaleString()} to go
                      </span>
                    )}
                  </div>
                </div>

                {/* ETA */}
                {!isComplete && (
                  <div className="rounded-lg bg-muted/50 p-3 text-sm">
                    <p className="text-muted-foreground">
                      Estimated completion: <span className="font-medium text-foreground">3 months</span>
                    </p>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Empty State Hint */}
      <Card className="p-8 text-center bg-gradient-card shadow-md">
        <div className="mx-auto max-w-md space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Plus className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Create Your First Custom Bucket</h3>
            <p className="mt-2 text-muted-foreground">
              Set aside money for what matters most—vacations, gadgets, rainy days. 
              FinTant automatically funds them based on your rules.
            </p>
          </div>
          <Button size="lg" className="gap-2">
            <Plus className="h-4 w-4" />
            Get Started
          </Button>
        </div>
      </Card>
    </div>
  );
}
