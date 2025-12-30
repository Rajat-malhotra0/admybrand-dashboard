const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing database API endpoints...');
    
    // Test GET endpoints
    console.log('\n=== Testing GET endpoints ===');
    
    const influencersResponse = await axios.get('http://localhost:5000/api/db/influencers');
    console.log('Influencers from DB API:', influencersResponse.data.length, 'records');
    console.log('First influencer:', influencersResponse.data[0]);
    
    const campaignsResponse = await axios.get('http://localhost:5000/api/db/campaigns');
    console.log('Campaigns from DB API:', campaignsResponse.data.length, 'records');
    
    const demographicsResponse = await axios.get('http://localhost:5000/api/db/demographics');
    console.log('Demographics from DB API:', demographicsResponse.data.length, 'records');
    
    // Test POST endpoint - add a new influencer
    console.log('\n=== Testing POST endpoint ===');
    
    const newInfluencer = {
      name: "API Test User",
      projects: 15,
      followers: "300K",
      platform: "LinkedIn",
      email: "api@test.com",
      engagement_rate: 8.2,
      verified: true
    };
    
    const postResponse = await axios.post('http://localhost:5000/api/influencers', newInfluencer);
    console.log('POST response:', postResponse.data);
    
    // Check if it was added
    const updatedInfluencersResponse = await axios.get('http://localhost:5000/api/db/influencers');
    console.log('Total influencers after POST:', updatedInfluencersResponse.data.length);
    
    console.log('✅ API tests completed!');
    
  } catch (error) {
    console.error('❌ API test failed:', error.response ? error.response.data : error.message);
  }
}

testAPI();
