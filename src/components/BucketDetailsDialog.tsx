import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Target, TrendingUp, ArrowRightLeft } from "lucide-react";

interface Bucket {
  id: string;
  name: string;
  current_amount: number;
  target_amount: number | null;
  category: string;
}

interface BucketDetailsDialogProps {
  bucket: Bucket | null;
  allBuckets: Bucket[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
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

export function BucketDetailsDialog({ bucket, allBuckets, open, onOpenChange, onSuccess }: BucketDetailsDialogProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferDestination, setTransferDestination] = useState<string>("");

  if (!bucket) return null;

  const target = bucket.target_amount || 0;
  const current = bucket.current_amount || 0;
  const progress = target > 0 ? (current / target) * 100 : 0;
  const icon = CATEGORY_ICONS[bucket.category] || "📦";

  const handleAddMoney = async () => {
    const amount = parseFloat(addAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      const { error } = await supabase
        .from("buckets")
        .update({ current_amount: current + amount })
        .eq("id", bucket.id);

      if (error) throw error;

      toast.success(`Added $${amount.toFixed(2)} to ${bucket.name}`);
      setAddAmount("");
      setIsAdding(false);
      onSuccess();
    } catch (error) {
      console.error("Error adding money:", error);
      toast.error("Failed to add money. Please try again.");
    }
  };

  const handleTransferMoney = async () => {
    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (amount > current) {
      toast.error("Insufficient funds in this bucket");
      return;
    }

    if (!transferDestination) {
      toast.error("Please select a destination");
      return;
    }

    try {
      // Decrease from current bucket
      const { error: sourceError } = await supabase
        .from("buckets")
        .update({ current_amount: current - amount })
        .eq("id", bucket.id);

      if (sourceError) throw sourceError;

      // If transferring to another bucket, increase that bucket's amount
      if (transferDestination !== "main") {
        const destinationBucket = allBuckets.find(b => b.id === transferDestination);
        if (destinationBucket) {
          const { error: destError } = await supabase
            .from("buckets")
            .update({ current_amount: destinationBucket.current_amount + amount })
            .eq("id", transferDestination);

          if (destError) throw destError;
        }
      }

      const destination = transferDestination === "main" 
        ? "main account" 
        : allBuckets.find(b => b.id === transferDestination)?.name;

      toast.success(`Transferred $${amount.toFixed(2)} to ${destination}`);
      setTransferAmount("");
      setTransferDestination("");
      setIsTransferring(false);
      onSuccess();
    } catch (error) {
      console.error("Error transferring money:", error);
      toast.error("Failed to transfer money. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-2xl">
              {icon}
            </div>
            <div>
              <div className="text-xl font-semibold">{bucket.name}</div>
              <Badge variant="secondary" className="mt-1">{bucket.category}</Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Balance */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold">
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
                  <span className="font-medium text-primary">
                    {progress.toFixed(0)}% funded
                  </span>
                  {progress < 100 && (
                    <span className="text-muted-foreground">
                      ${(target - current).toLocaleString()} to go
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Add Money Section */}
          <div className="space-y-3">
            {!isAdding && !isTransferring && (
              <div className="flex gap-2">
                <Button onClick={() => setIsAdding(true)} className="flex-1 gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Add Money
                </Button>
                <Button onClick={() => setIsTransferring(true)} variant="outline" className="flex-1 gap-2">
                  <ArrowRightLeft className="h-4 w-4" />
                  Transfer
                </Button>
              </div>
            )}

            {isAdding && (
              <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
                <Label htmlFor="add-amount">Amount to Add</Label>
                <Input
                  id="add-amount"
                  type="number"
                  placeholder="0.00"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  step="0.01"
                  min="0"
                />
                <div className="flex gap-2">
                  <Button onClick={handleAddMoney} className="flex-1">
                    Confirm
                  </Button>
                  <Button onClick={() => setIsAdding(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {isTransferring && (
              <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
                <div className="space-y-2">
                  <Label htmlFor="transfer-amount">Amount to Transfer</Label>
                  <Input
                    id="transfer-amount"
                    type="number"
                    placeholder="0.00"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    step="0.01"
                    min="0"
                    max={current}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transfer-destination">Transfer To</Label>
                  <Select value={transferDestination} onValueChange={setTransferDestination}>
                    <SelectTrigger id="transfer-destination">
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">Main Account</SelectItem>
                      {allBuckets
                        .filter(b => b.id !== bucket.id)
                        .map(b => (
                          <SelectItem key={b.id} value={b.id}>
                            {b.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleTransferMoney} className="flex-1">
                    Confirm
                  </Button>
                  <Button onClick={() => setIsTransferring(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
