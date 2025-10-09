-- Add financial_focus column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN financial_focus text CHECK (financial_focus IN ('investing', 'home_buyer', 'saving_retirement', 'debt_payoff'));