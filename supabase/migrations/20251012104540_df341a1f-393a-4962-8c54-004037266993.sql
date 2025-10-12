-- Add onboarding fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS financial_goal TEXT,
ADD COLUMN IF NOT EXISTS future_goal TEXT,
ADD COLUMN IF NOT EXISTS payment_behavior TEXT,
ADD COLUMN IF NOT EXISTS risk_tolerance TEXT,
ADD COLUMN IF NOT EXISTS finance_tracking_frequency TEXT,
ADD COLUMN IF NOT EXISTS current_situation TEXT,
ADD COLUMN IF NOT EXISTS top_priority TEXT,
ADD COLUMN IF NOT EXISTS investment_frequency TEXT,
ADD COLUMN IF NOT EXISTS finance_personality TEXT;