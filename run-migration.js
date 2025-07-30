// Database Migration Script
// Run this to add missing columns to production database

import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function runMigration() {
  try {
    console.log('Starting database migration...');
    
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    // Try to add cost_per_click column
    try {
      console.log('Adding cost_per_click column...');
      await client.execute('ALTER TABLE campaigns ADD COLUMN cost_per_click REAL DEFAULT 0.0');
      console.log('✓ cost_per_click column added successfully');
    } catch (error) {
      if (error.message.includes('duplicate column name')) {
        console.log('⚠ cost_per_click column already exists');
      } else {
        console.error('✗ Failed to add cost_per_click column:', error.message);
      }
    }

    // Update existing records
    try {
      console.log('Updating existing records...');
      await client.execute('UPDATE campaigns SET cost_per_click = 0.0 WHERE cost_per_click IS NULL');
      console.log('✓ Records updated successfully');
    } catch (error) {
      console.error('✗ Failed to update records:', error.message);
    }

    console.log('Migration completed!');
    
    // Test the updated schema
    console.log('\nTesting updated schema...');
    const result = await client.execute('SELECT * FROM campaigns LIMIT 1');
    console.log('Sample campaign record:', result.rows[0]);
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

runMigration();
