const db = require('./backend/src/database/database');

async function test() {
  console.log('Testing SQL query directly...');
  await db.initializeDatabase();
  console.log('Database initialized');
  
  console.log('Testing different SQL queries...');
  
  try {
    console.log('Query 1: Simple SELECT *');
    const result1 = await db.getCampaigns();
    console.log('Result 1 (first campaign):', result1[0]);
  } catch (error) {
    console.error('Error in query 1:', error.message);
  }
  
  try {
    console.log('Query 2: Get countries with data');
    const result2 = await db.getCountriesWithData();
    console.log('Result 2 (countries with data):', result2);
  } catch (error) {
    console.error('Error in query 2:', error.message);
  }
  
  try {
    console.log('Query 3: Get table counts');
    const result3 = await db.getTableCounts();
    console.log('Result 3 (table counts):', result3);
  } catch (error) {
    console.error('Error in query 3:', error.message);
  }
}

test().catch(console.error);
