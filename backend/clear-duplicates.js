const { createClient } = require('@libsql/client');
const path = require('path');

const dbPath = path.join(__dirname, 'admybrand.db');
const db = createClient({ url: `file:${dbPath}` });

async function clearDuplicates() {
  try {
    console.log('🧹 Clearing duplicate data from database...');

    // Clear all data and restart with proper seeding
    await db.execute('DELETE FROM campaign_stats');
    await db.execute('DELETE FROM influencers');
    await db.execute('DELETE FROM demographics');
    await db.execute('DELETE FROM interests');
    
    console.log('✅ All data cleared. Database is ready for fresh seeding.');
    
  } catch (error) {
    console.error('Error clearing data:', error);
  } finally {
    db.close();
  }
}

clearDuplicates();
