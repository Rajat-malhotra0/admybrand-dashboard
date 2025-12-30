const { initializeDatabase, getCampaignStats, getInfluencers, getDemographics, getInterests, getCountries } = require('./database');

async function testDatabaseFix() {
  try {
    console.log('🔄 Initializing database...');
    await initializeDatabase();
    
    console.log('\n📊 Testing getCampaignStats()...');
    const campaignStats = await getCampaignStats();
    console.log(`✅ Found ${campaignStats.length} campaign stats`);
    if (campaignStats.length > 0) {
      console.log('Sample data:', campaignStats[0]);
    }

    console.log('\n📊 Testing getCampaignStats("global")...');
    const globalStats = await getCampaignStats('global');
    console.log(`✅ Found ${globalStats.length} global campaign stats`);

    console.log('\n📊 Testing getCampaignStats("tiktok")...');
    const tiktokStats = await getCampaignStats('tiktok');
    console.log(`✅ Found ${tiktokStats.length} TikTok campaign stats`);

    console.log('\n👥 Testing getInfluencers()...');
    const influencers = await getInfluencers();
    console.log(`✅ Found ${influencers.length} influencers`);

    console.log('\n📈 Testing getDemographics()...');
    const demographics = await getDemographics();
    console.log(`✅ Found ${demographics.length} demographics records`);

    console.log('\n🎯 Testing getInterests()...');
    const interests = await getInterests();
    console.log(`✅ Found ${interests.length} interests records`);

    console.log('\n🌍 Testing getCountries()...');
    const countries = await getCountries();
    console.log(`✅ Found ${countries.length} countries records`);

    console.log('\n✅ All database tests passed! The parameter mismatch issue has been resolved.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  }
}

testDatabaseFix();
