-- Create rules table
CREATE TABLE public.rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  trigger TEXT NOT NULL,
  action TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT check_name_length CHECK (char_length(name) <= 100),
  CONSTRAINT check_trigger_length CHECK (char_length(trigger) <= 200),
  CONSTRAINT check_action_length CHECK (char_length(action) <= 200)
);

-- Enable Row Level Security
ALTER TABLE public.rules ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own rules" 
ON public.rules 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own rules" 
ON public.rules 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rules" 
ON public.rules 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rules" 
ON public.rules 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_rules_updated_at
BEFORE UPDATE ON public.rules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();