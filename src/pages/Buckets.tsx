import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { BucketDialog } from "@/components/BucketDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Bucket {
  id: string;
  name: string;
  current_amount: number;
  target_amount: number | null;
  category: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  "Travel": "✈️",
  "Emergency Fund": "🛡️",
  "Electronics": "💻",
  "Home & Living": "🏠",
  "Education": "📚",
  "Health & Fitness": "💪",
  "Entertainment": "🎮",
  "Savings": "💰",
  "Other": "📦",
};

const CATEGORY_COLORS: Record<string, string> = {
  "Travel": "hsl(var(--primary))",
  "Emergency Fund": "hsl(var(--success))",
  "Electronics": "hsl(var(--accent))",
  "Home & Living": "hsl(var(--secondary))",
  "Education": "hsl(var(--primary))",
  "Health & Fitness": "hsl(var(--success))",
  "Entertainment": "hsl(var(--accent))",
  "Savings": "hsl(var(--secondary))",
  "Other": "hsl(var(--muted-foreground))",
};

export default function Buckets() {
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBuckets = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("buckets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBuckets(data || []);
    } catch (error) {
      console.error("Error fetching buckets:", error);
      toast.error("Failed to load buckets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuckets();
  }, []);

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
        <BucketDialog onSuccess={fetchBuckets} />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading your buckets...</p>
        </div>
      ) : buckets.length === 0 ? (
        <Card className="p-8 text-center bg-gradient-card shadow-md">
          <div className="mx-auto max-w-md space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Create Your First Bucket</h3>
              <p className="mt-2 text-muted-foreground">
                Set aside money for what matters most—vacations, gadgets, rainy days. 
                FinTant automatically funds them based on your rules.
              </p>
            </div>
            <BucketDialog onSuccess={fetchBuckets} />
          </div>
        </Card>
      ) : null}

      {/* Buckets Grid */}
      {buckets.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {buckets.map((bucket) => {
            const target = bucket.target_amount || 0;
            const current = bucket.current_amount || 0;
            const progress = target > 0 ? (current / target) * 100 : 0;
            const remaining = target - current;
            const isComplete = progress >= 100;
            const icon = CATEGORY_ICONS[bucket.category] || "📦";
            const color = CATEGORY_COLORS[bucket.category] || "hsl(var(--muted-foreground))";
          
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
                    stroke={color}
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
                      {icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{bucket.name}</h3>
                      <Badge variant="secondary" className="mt-1">{bucket.category}</Badge>
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
                      ${current.toLocaleString()}
                    </span>
                    {target > 0 && (
                      <span className="text-sm text-muted-foreground">
                        of ${target.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {target > 0 && (
                    <>
                      <Progress value={Math.min(progress, 100)} className="h-2" />
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium" style={{ color }}>
                          {progress.toFixed(0)}% funded
                        </span>
                        {!isComplete && (
                          <span className="text-muted-foreground">
                            ${remaining.toLocaleString()} to go
                          </span>
                        )}
                      </div>
                    </>
                  )}
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
      )}
    </div>
  );
}
