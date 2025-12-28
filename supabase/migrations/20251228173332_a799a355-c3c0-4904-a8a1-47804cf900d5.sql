-- Add income_duration and income_stability columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN income_duration text,
ADD COLUMN income_stability text;