-- Add has_income column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN has_income text;