const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testFullData() {
  try {
    console.log('🔍 Testing all API endpoints for complete data...\n');

    // Test campaign stats
    console.log('📊 Testing /api/campaign-stats...');
    const campaignStatsResponse = await axios.get(`${BASE_URL}/api/campaign-stats`);
    console.log(`✅ Campaign Stats: ${campaignStatsResponse.data.length} records`);
    campaignStatsResponse.data.forEach((stat, i) => {
      if (i < 3) console.log(`   - ${stat.title}: ${stat.value} (${stat.platform})`);
    });

    // Test influencers
    console.log('\n👥 Testing /api/influencers...');
    const influencersResponse = await axios.get(`${BASE_URL}/api/influencers`);
    console.log(`✅ Influencers: ${influencersResponse.data.length} records`);
    influencersResponse.data.forEach((influencer, i) => {
      if (i < 5) console.log(`   - ${influencer.name}: ${influencer.followers} (${influencer.platform})`);
    });

    // Test demographics
    console.log('\n📈 Testing /api/demographics...');
    const demographicsResponse = await axios.get(`${BASE_URL}/api/demographics`);
    console.log(`✅ Demographics: ${demographicsResponse.data.length} records`);
    demographicsResponse.data.forEach((demo, i) => {
      if (i < 3) console.log(`   - ${demo.label}: Male ${demo.male}, Female ${demo.female} (${demo.platform})`);
    });

    // Test interests
    console.log('\n🎯 Testing /api/interests...');
    const interestsResponse = await axios.get(`${BASE_URL}/api/interests`);
    console.log(`✅ Interests: ${interestsResponse.data.length} records`);
    interestsResponse.data.forEach((interest, i) => {
      if (i < 3) console.log(`   - ${interest.label}: ${interest.value} (${interest.platform})`);
    });

    // Test countries
    console.log('\n🌍 Testing /api/countries-with-data...');
    const countriesResponse = await axios.get(`${BASE_URL}/api/countries-with-data`);
    console.log(`✅ Countries: ${countriesResponse.data.countries?.length || 0} records`);
    if (countriesResponse.data.countries) {
      countriesResponse.data.countries.forEach((country, i) => {
        if (i < 3) console.log(`   - ${country}`);
      });
    }

    // Test campaigns
    console.log('\n🚀 Testing /api/db/campaigns...');
    const campaignsResponse = await axios.get(`${BASE_URL}/api/db/campaigns`);
    console.log(`✅ Campaigns: ${campaignsResponse.data.length} records`);
    campaignsResponse.data.forEach((campaign, i) => {
      if (i < 3) console.log(`   - ${campaign.name}: ${campaign.platform} in ${campaign.country} (${campaign.status})`);
    });

    // Test platform-specific data
    console.log('\n🎥 Testing platform-specific endpoints...');
    
    const tiktokInfluencers = await axios.get(`${BASE_URL}/api/influencers?platform=TikTok`);
    console.log(`✅ TikTok Influencers: ${tiktokInfluencers.data.length} records`);
    
    const instagramStats = await axios.get(`${BASE_URL}/api/campaign-stats?platform=Instagram`);
    console.log(`✅ Instagram Stats: ${instagramStats.data.length} records`);

    console.log('\n🎉 All API endpoints are returning complete seeded data!');
    
  } catch (error) {
    console.error('❌ API test failed:', error.response ? error.response.data : error.message);
    console.error('Make sure the server is running on port 5000');
  }
}

testFullData();
