const db = require('./backend/src/database/database');

async function test() {
  console.log('Testing database connection...');
  await db.initializeDatabase();
  console.log('Database initialized');
  
  console.log('Getting campaigns...');
  const campaigns = await db.getCampaigns();
  console.log('Campaigns count:', campaigns.length);
  console.log('Campaigns:', campaigns.map(c => ({ id: c.id, name: c.name, country: c.country })));
  
  console.log('Getting countries with data...');
  const countries = await db.getCountriesWithData();
  console.log('Countries with data:', countries);
}

test().catch(console.error);
