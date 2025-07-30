-- Database Migration Script
-- Add missing columns to existing tables in production database

-- Add missing columns to campaigns table
ALTER TABLE campaigns ADD COLUMN cost_per_click REAL DEFAULT 0.0;
ALTER TABLE campaigns ADD COLUMN cost_per_conversion REAL DEFAULT 0.0;
ALTER TABLE campaigns ADD COLUMN country TEXT DEFAULT 'global';

-- Add other potentially missing columns from schema
ALTER TABLE campaigns ADD COLUMN budget REAL;
ALTER TABLE campaigns ADD COLUMN start_date DATE;
ALTER TABLE campaigns ADD COLUMN end_date DATE;

-- Update existing records to have default values
UPDATE campaigns SET cost_per_click = 0.0 WHERE cost_per_click IS NULL;
UPDATE campaigns SET cost_per_conversion = 0.0 WHERE cost_per_conversion IS NULL;
UPDATE campaigns SET country = 'global' WHERE country IS NULL OR country = '';

-- Verify the changes
-- SELECT * FROM campaigns LIMIT 5;
