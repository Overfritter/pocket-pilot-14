import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  trigger: z.string().min(1, "Trigger is required").max(200, "Trigger must be less than 200 characters"),
  action: z.string().min(1, "Action is required").max(200, "Action must be less than 200 characters"),
  enabled: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

interface RuleDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: () => void;
}

export default function RuleDialog({ open, setOpen, onSuccess }: RuleDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      trigger: "",
      action: "",
      enabled: true,
    },
  });

  const enabled = watch("enabled");

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create rules",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("rules").insert({
        user_id: user.id,
        name: data.name,
        trigger: data.trigger,
        action: data.action,
        enabled: data.enabled,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Rule created successfully",
      });

      reset();
      setOpen(false);
      onSuccess();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error creating rule:", error);
      }
      toast({
        title: "Error",
        description: "Unable to create rule. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Funding Rule</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Rule Name</Label>
            <Input
              id="name"
              placeholder="e.g., Auto-fund Expenses"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="trigger">When (Trigger)</Label>
            <Input
              id="trigger"
              placeholder="e.g., Income received"
              {...register("trigger")}
            />
            {errors.trigger && (
              <p className="text-sm text-destructive">{errors.trigger.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="action">Then (Action)</Label>
            <Input
              id="action"
              placeholder="e.g., Move 60% to Expenses bucket"
              {...register("action")}
            />
            {errors.action && (
              <p className="text-sm text-destructive">{errors.action.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="enabled"
              checked={enabled}
              onCheckedChange={(checked) => setValue("enabled", checked)}
            />
            <Label htmlFor="enabled">Enable rule immediately</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Rule"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
