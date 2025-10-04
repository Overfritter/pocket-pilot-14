import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Bucket {
  id: string;
  name: string;
  category: string;
  target_amount: number | null;
  time_limit: string | null;
  current_amount: number;
}

interface BucketListProps {
  refresh: number;
}

export default function BucketList({ refresh }: BucketListProps) {
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBuckets();
  }, [refresh]);

  const fetchBuckets = async () => {
    try {
      const { data, error } = await supabase
        .from("buckets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBuckets(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteBucket = async (id: string) => {
    try {
      const { error } = await supabase.from("buckets").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Bucket deleted successfully" });
      fetchBuckets();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading buckets...</div>;
  }

  if (buckets.length === 0) {
    return (
      <Card className="p-8 bg-gradient-card shadow-md text-center">
        <p className="text-muted-foreground">
          No buckets yet. Create your first bucket above!
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {buckets.map((bucket) => {
        const progress = bucket.target_amount
          ? (bucket.current_amount / bucket.target_amount) * 100
          : 0;

        return (
          <Card key={bucket.id} className="p-6 bg-gradient-card shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{bucket.name}</h3>
                <Badge variant="outline" className="mt-1">
                  {bucket.category}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteBucket(bucket.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Current Amount</p>
                <p className="text-2xl font-bold">
                  ${bucket.current_amount.toFixed(2)}
                </p>
              </div>

              {bucket.target_amount && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Target: ${bucket.target_amount.toFixed(2)}
                    </p>
                    <div className="w-full bg-muted rounded-full h-2 mt-1">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {progress.toFixed(0)}% complete
                    </p>
                  </div>
                </>
              )}

              {bucket.time_limit && (
                <p className="text-sm text-muted-foreground">
                  Due: {format(new Date(bucket.time_limit), "PPP")}
                </p>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
