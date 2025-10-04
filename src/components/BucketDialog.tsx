import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CATEGORIES = [
  "Travel",
  "Emergency Fund",
  "Electronics",
  "Home & Living",
  "Education",
  "Health & Fitness",
  "Entertainment",
  "Savings",
  "Other",
];

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  category: z.string().min(1, "Category is required"),
  target_amount: z.string().optional(),
  time_limit: z.string().optional(),
});

interface BucketDialogProps {
  onSuccess: () => void;
}

export function BucketDialog({ onSuccess }: BucketDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      target_amount: "",
      time_limit: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to create a bucket");
        return;
      }

      const { error } = await (supabase as any).from("buckets").insert({
        user_id: user.id,
        name: values.name,
        category: values.category,
        target_amount: values.target_amount ? parseFloat(values.target_amount) : null,
        time_limit: values.time_limit ? new Date(values.time_limit).toISOString() : null,
      });

      if (error) throw error;

      toast.success("Bucket created successfully!");
      form.reset();
      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error("Error creating bucket:", error);
      toast.error("Failed to create bucket");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="h-4 w-4" />
          Create Bucket
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Bucket</DialogTitle>
          <DialogDescription>
            Set up a new savings goal. Give it a name, choose a category, and optionally set a target amount and deadline.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bucket Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Summer Vacation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the category that best matches your savings goal
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="target_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Amount (Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="e.g., 5000" {...field} />
                  </FormControl>
                  <FormDescription>
                    How much money do you want to save?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Date (Optional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>
                    When do you want to reach your goal?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Bucket"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
