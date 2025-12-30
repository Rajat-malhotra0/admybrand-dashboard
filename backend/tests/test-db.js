const { getTursoClient } = require('../src/database/lib/database/turso.js');

async function testDatabase() {
  try {
    const client = getTursoClient();
    
    // Check if tables exist
    const tablesResult = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('Tables in database:', tablesResult.rows);
    
    // Check if influencers table has data
    try {
      const influencersResult = await client.execute('SELECT COUNT(*) as count FROM influencers');
      console.log('Influencers count:', influencersResult.rows[0]);
    } catch (error) {
      console.log('Error checking influencers table:', error.message);
    }
    
    // Check if campaigns table has data
    try {
      const campaignsResult = await client.execute('SELECT COUNT(*) as count FROM campaigns');
      console.log('Campaigns count:', campaignsResult.rows[0]);
    } catch (error) {
      console.log('Error checking campaigns table:', error.message);
    }
    
    // Check if demographics table has data
    try {
      const demographicsResult = await client.execute('SELECT COUNT(*) as count FROM demographics');
      console.log('Demographics count:', demographicsResult.rows[0]);
    } catch (error) {
      console.log('Error checking demographics table:', error.message);
    }
    
  } catch (error) {
    console.error('Database test failed:', error);
  }
}

testDatabase();
