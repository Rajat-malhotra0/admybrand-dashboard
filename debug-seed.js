const path = require('path');
const db = require('./backend/src/database/database');

async function debugSeed() {
  console.log('Debug seed script');
  console.log('Current working directory:', process.cwd());
  console.log('Absolute path to local.db:', path.resolve('local.db'));
  console.log('File exists:', require('fs').existsSync(path.resolve('local.db')));
  
  await db.initializeDatabase();
  console.log('Database initialized');
  
  // Check table counts before clearing
  console.log('Table counts before clearing:');
  const countsBefore = await db.getTableCounts();
  console.log(countsBefore);
  
  // Clear data
  console.log('Clearing existing data...');
  await db.clearAllData();
  
  // Check table counts after clearing
  console.log('Table counts after clearing:');
  const countsAfter = await db.getTableCounts();
  console.log(countsAfter);
  
  // Add a test campaign
  console.log('Adding test campaign...');
  const testCampaign = {
    name: 'Test Campaign',
    platform: 'Instagram',
    country: 'TestCountry',
    status: 'active',
    budget: 1000,
    reach: 10000,
    impressions: 100000,
    clicks: 1000,
    conversions: 100
  };
  
  await db.addCampaign(testCampaign);
  console.log('Test campaign added');
  
  // Check table counts after adding test campaign
  console.log('Table counts after adding test campaign:');
  const countsAfterAdd = await db.getTableCounts();
  console.log(countsAfterAdd);
  
  // Get countries with data
  console.log('Getting countries with data...');
  const countries = await db.getCountriesWithData();
  console.log('Countries with data:', countries);
}

debugSeed().catch(console.error);
