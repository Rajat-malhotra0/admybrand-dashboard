require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@libsql/client');

// Create Turso client
const tursoClient = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrateAddCountry() {
  try {
    console.log('Starting migration to add country columns...');

    // Add country column to campaigns table
    try {
      await tursoClient.execute(`
        ALTER TABLE campaigns ADD COLUMN country TEXT DEFAULT 'US';
      `);
      console.log('Added country column to campaigns table');
    } catch (error) {
      if (error.message.includes('duplicate column name')) {
        console.log('Country column already exists in campaigns table');
      } else {
        throw error;
      }
    }

    // Add country column to influencers table
    try {
      await tursoClient.execute(`
        ALTER TABLE influencers ADD COLUMN country TEXT DEFAULT 'US';
      `);
      console.log('Added country column to influencers table');
    } catch (error) {
      if (error.message.includes('duplicate column name')) {
        console.log('Country column already exists in influencers table');
      } else {
        throw error;
      }
    }

    console.log('Migration completed successfully!');

  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  } finally {
    await tursoClient.close();
  }
}

// Run the migration
migrateAddCountry().catch(console.error);
