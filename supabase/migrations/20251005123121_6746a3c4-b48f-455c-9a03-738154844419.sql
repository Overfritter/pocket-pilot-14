-- Add database constraints for bucket validation
ALTER TABLE buckets 
  ADD CONSTRAINT check_target_amount_positive CHECK (target_amount > 0),
  ADD CONSTRAINT check_target_amount_reasonable CHECK (target_amount <= 1000000000),
  ADD CONSTRAINT check_name_length CHECK (char_length(name) <= 100),
  ADD CONSTRAINT check_category_length CHECK (char_length(category) <= 50);