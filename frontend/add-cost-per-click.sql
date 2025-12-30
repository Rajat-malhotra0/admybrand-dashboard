-- Add missing cost_per_click column
ALTER TABLE campaigns ADD COLUMN cost_per_click REAL DEFAULT 0.0;

-- Update existing records to have default values
UPDATE campaigns SET cost_per_click = 0.0 WHERE cost_per_click IS NULL;
