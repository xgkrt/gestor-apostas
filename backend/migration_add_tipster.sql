-- Migration: Add tipster column to bets table
-- Date: 2024-03-26

USE apostas_db;

-- Add tipster column (allows NULL for backward compatibility)
ALTER TABLE bets 
ADD COLUMN tipster VARCHAR(100) NULL AFTER bookmaker;

-- Optional: Update existing records with a default value if needed
-- UPDATE bets SET tipster = 'N/A' WHERE tipster IS NULL;

-- Show table structure to confirm
DESCRIBE bets;
