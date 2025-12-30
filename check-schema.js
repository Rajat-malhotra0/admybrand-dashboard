const db = require('./backend/src/database/database');

async function checkSchema() {
  await db.initializeDatabase();
  console.log('Database initialized');
  
  // Since we can't directly access the client, let's test the getCountriesWithData function
  try {
    console.log('Testing getCountriesWithData function...');
    const countries = await db.getCountriesWithData();
    console.log('Countries with data:', countries);
  } catch (error) {
    console.error('Error with getCountriesWithData:', error);
  }
  
  // Let's also check the table counts
  try {
    console.log('Checking table counts...');
    const counts = await db.getTableCounts();
    console.log('Table counts:', counts);
  } catch (error) {
    console.error('Error getting table counts:', error);
  }
  
  // Let's check the campaigns data
  try {
    console.log('Checking campaigns data...');
    const campaigns = await db.getCampaigns();
    console.log('Number of campaigns:', campaigns.length);
    if (campaigns.length > 0) {
      console.log('First campaign:', campaigns[0]);
    }
  } catch (error) {
    console.error('Error getting campaigns:', error);
  }
}

checkSchema().catch(console.error);
