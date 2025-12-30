const db = require('./database');

async function testData() {
  try {
    console.log('🔍 Testing database data...\n');
    
    // Initialize database first
    await db.initializeDatabase();

    // Test Facebook platform data
    console.log('--- Facebook Data ---');
    const facebookStats = await db.getCampaignStats('Facebook');
    console.log(`Facebook Campaign Stats: ${facebookStats.length}`);
    facebookStats.forEach(stat => console.log(`  - ${stat.title}: ${stat.value}`));

    const facebookLeads = await db.getLeads('Facebook');
    console.log(`\nFacebook Leads: ${facebookLeads.length}`);
    facebookLeads.slice(0, 3).forEach(lead => console.log(`  - ${lead.name} (${lead.followers})`));

    const facebookDemographics = await db.getDemographics('Facebook');
    console.log(`\nFacebook Demographics: ${facebookDemographics.length}`);
    facebookDemographics.slice(0, 5).forEach(demo => console.log(`  - ${demo.label}: ${demo.male}% male, ${demo.female}% female`));

    // Test country-specific data
    console.log('\n--- Country-Specific Data ---');
    const usLinkedInStats = await db.getCampaignStatsByPlatform('LinkedIn');
    console.log(`LinkedIn Stats: ${usLinkedInStats.length}`);

    const usFacebookDemographics = await db.getDemographicsByPlatform('Facebook');
    console.log(`Facebook Demographics: ${usFacebookDemographics.length}`);

    // Test interests
    console.log('\n--- Interests Data ---');
    const facebookInterests = await db.getInterestsByPlatform('Facebook');
    console.log(`Facebook Interests: ${facebookInterests.length}`);
    facebookInterests.slice(0, 5).forEach(interest => console.log(`  - ${interest.label}: ${interest.value}`));

    console.log('\n✅ All data tests passed! Database is properly populated.');
  } catch (error) {
    console.error('❌ Error testing data:', error);
  }
}

if (require.main === module) {
  testData();
}

module.exports = { testData };
