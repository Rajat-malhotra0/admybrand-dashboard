const axios = require('axios');

const BASE_URL = '/api';

const testEndpoints = [
  '/dashboard',
  '/campaign-stats', 
  '/influencers',
  '/demographics',
  '/interests'
];

async function testBackendConnection() {
  console.log('🔍 Testing Backend API Connection...\n');
  
  for (const endpoint of testEndpoints) {
    try {
      console.log(`Testing ${BASE_URL}${endpoint}...`);
      const response = await axios.get(`${BASE_URL}${endpoint}`, { timeout: 5000 });
      
      console.log(`✅ ${endpoint}: Status ${response.status}`);
      
      if (endpoint === '/dashboard') {
        const data = response.data;
        console.log(`   📊 Campaign Stats: ${data.campaignStats?.length || 0} items`);
        console.log(`   👥 Influencers: ${data.influencerData?.length || 0} items`);
        console.log(`   📈 Demographics: ${data.demographicsData?.length || 0} items`);
        console.log(`   🎯 Interests: ${data.interestsData?.length || 0} items`);
      } else if (Array.isArray(response.data)) {
        console.log(`   📄 Response: ${response.data.length} items`);
      }
      
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error.message}`);
      if (error.code === 'ECONNREFUSED') {
        console.log(`   💡 Suggestion: Make sure the backend server is running on port 5000`);
      }
    }
    console.log('');
  }
}

// Test CORS headers
async function testCORS() {
  console.log('🌐 Testing CORS Configuration...\n');
  
  try {
    const response = await axios.get(`${BASE_URL}/dashboard`, { timeout: 5000 });
    const corsHeader = response.headers['access-control-allow-origin'];
    
    if (corsHeader) {
      console.log(`✅ CORS Header: ${corsHeader}`);
      if (corsHeader === '*' || corsHeader.includes('localhost:3001')) {
        console.log('   👍 CORS is properly configured for frontend');
      } else {
        console.log('   ⚠️  CORS might not allow localhost:3001');
      }
    } else {
      console.log('❌ No CORS headers found');
    }
  } catch (error) {
    console.log(`❌ CORS Test Failed: ${error.message}`);
  }
  console.log('');
}

async function runTests() {
  await testBackendConnection();
  await testCORS();
  
  console.log('🏁 Backend Connection Test Complete!');
}

runTests();
