const axios = require('axios');

const API_BASE = 'http://localhost:5000';

async function testEndpoints() {
  console.log('🧪 Testing API endpoints...\n');

  const tests = [
    {
      name: 'Dashboard Data',
      endpoint: '/api/dashboard',
      method: 'GET'
    },
    {
      name: 'Campaign Stats',
      endpoint: '/api/campaign-stats',
      method: 'GET'
    },
    {
      name: 'Leads',
      endpoint: '/api/leads',
      method: 'GET'
    },
    {
      name: 'Demographics',
      endpoint: '/api/demographics',
      method: 'GET'
    },
    {
      name: 'Interests',
      endpoint: '/api/interests',
      method: 'GET'
    },
    {
      name: 'Countries with Data',
      endpoint: '/api/countries-with-data',
      method: 'GET'
    }
  ];

  for (const test of tests) {
    try {
      console.log(`Testing ${test.name}...`);
      const response = await axios({
        method: test.method,
        url: `${API_BASE}${test.endpoint}`,
        timeout: 5000
      });
      
      console.log(`✅ ${test.name}: ${response.status} - ${JSON.stringify(response.data).substring(0, 100)}...`);
    } catch (error) {
      console.log(`❌ ${test.name}: ${error.message}`);
    }
    console.log('');
  }

  // Test POST endpoint
  try {
    console.log('Testing POST /api/leads...');
    const newLead = {
      name: 'Test Lead',
      projects: 5,
      followers: '100K',
      platform: 'Instagram'
    };
    
    const response = await axios.post(`${API_BASE}/api/leads`, newLead);
    console.log(`✅ POST Lead: ${response.status} - ${JSON.stringify(response.data)}`);
  } catch (error) {
    console.log(`❌ POST Lead: ${error.message}`);
  }
}

if (require.main === module) {
  testEndpoints()
    .then(() => {
      console.log('\n🎉 API testing completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Testing failed:', error);
      process.exit(1);
    });
}

module.exports = { testEndpoints };
