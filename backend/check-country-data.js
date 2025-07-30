const { createClient } = require('@libsql/client');
const path = require('path');

const dbPath = path.join(__dirname, 'admybrand.db');
const db = createClient({ url: `file:${dbPath}` });

async function checkCountryData() {
  try {
    console.log('📊 Checking country-specific data in database...\n');

    // Check influencers by country
    console.log('=== INFLUENCERS BY COUNTRY ===');
    const influencersResult = await db.execute("SELECT country, COUNT(*) as count FROM influencers WHERE country IS NOT NULL AND country != '' GROUP BY country ORDER BY country");
    influencersResult.rows.forEach(row => {
      console.log(`${row.country}: ${row.count} influencers`);
    });
    
    // Check demographics by country
    console.log('\n=== DEMOGRAPHICS BY COUNTRY ===');
    const demographicsResult = await db.execute("SELECT country, COUNT(*) as count FROM demographics WHERE country IS NOT NULL AND country != '' GROUP BY country ORDER BY country");
    demographicsResult.rows.forEach(row => {
      console.log(`${row.country}: ${row.count} demographic entries`);
    });
    
    // Check campaign stats by country
    console.log('\n=== CAMPAIGN STATS BY COUNTRY ===');
    const campaignResult = await db.execute("SELECT country, COUNT(*) as count FROM campaign_stats WHERE country IS NOT NULL AND country != '' GROUP BY country ORDER BY country");
    campaignResult.rows.forEach(row => {
      console.log(`${row.country}: ${row.count} campaign stat entries`);
    });
    
    // Check interests by country
    console.log('\n=== INTERESTS BY COUNTRY ===');
    const interestsResult = await db.execute("SELECT country, COUNT(*) as count FROM interests WHERE country IS NOT NULL AND country != '' GROUP BY country ORDER BY country");
    interestsResult.rows.forEach(row => {
      console.log(`${row.country}: ${row.count} interest entries`);
    });
    
    // Sample data from each table
    console.log('\n=== SAMPLE INFLUENCER DATA ===');
    const sampleInfluencers = await db.execute("SELECT * FROM influencers LIMIT 5");
    console.table(sampleInfluencers.rows);
    
    console.log('\n=== SAMPLE DEMOGRAPHIC DATA ===');
    const sampleDemographics = await db.execute("SELECT * FROM demographics LIMIT 5");
    console.table(sampleDemographics.rows);
    
    console.log('\n=== SAMPLE CAMPAIGN STATS ===');
    const sampleCampaign = await db.execute("SELECT * FROM campaign_stats LIMIT 5");
    console.table(sampleCampaign.rows);
    
  } catch (error) {
    console.error('Error checking country data:', error);
  } finally {
    db.close();
  }
}

checkCountryData();
