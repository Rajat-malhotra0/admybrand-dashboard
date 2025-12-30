const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function forceReseed() {
  try {
    console.log('🔄 Forcing database reseed with enhanced data...\n');
    
    // Call the reset endpoint to trigger enhanced seeding
    console.log('📡 Calling /api/reset endpoint...');
    const resetResponse = await axios.post(`${BASE_URL}/api/reset`);
    console.log('✅ Reset response:', resetResponse.data);
    
    // Wait a moment for seeding to complete
    console.log('⏳ Waiting for seeding to complete...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test if data was properly seeded
    console.log('\n🔍 Verifying seeded data...');
    
    const campaignStatsResponse = await axios.get(`${BASE_URL}/api/campaign-stats`);
    console.log(`✅ Campaign Stats: ${campaignStatsResponse.data.length} records`);
    
    const influencersResponse = await axios.get(`${BASE_URL}/api/influencers`);
    console.log(`✅ Influencers: ${influencersResponse.data.length} records`);
    
    const demographicsResponse = await axios.get(`${BASE_URL}/api/demographics`);
    console.log(`✅ Demographics: ${demographicsResponse.data.length} records`);
    
    const interestsResponse = await axios.get(`${BASE_URL}/api/interests`);
    console.log(`✅ Interests: ${interestsResponse.data.length} records`);
    
    console.log('\n🎉 Database has been reseeded with enhanced data!');
    
  } catch (error) {
    console.error('❌ Force reseed failed:', error.response ? error.response.data : error.message);
    console.error('Make sure the server is running on port 5000');
  }
}

forceReseed();
