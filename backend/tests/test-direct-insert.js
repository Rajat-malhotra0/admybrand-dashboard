const { getTursoClient } = require('../src/database/lib/database/turso');

async function testDirectInsert() {
  try {
    console.log('Testing direct database insertion...');
    
    const client = getTursoClient();
    
    // Test data
    const testInfluencer = {
      name: "Direct Test User",
      projects: 10,
      followers: "200K",
      platform: "Instagram",
      email: "direct@test.com",
      phone: "+1111111111",
      location: "Test City",
      category: "Test Category",
      engagement_rate: 7.5,
      verified: true
    };
    
    console.log('Inserting test influencer:', testInfluencer);
    
    const sql = `INSERT INTO influencers 
                 (name, projects, followers, platform, email, phone, location, category, engagement_rate, verified)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const params = [
      testInfluencer.name,
      testInfluencer.projects,
      testInfluencer.followers,
      testInfluencer.platform,
      testInfluencer.email,
      testInfluencer.phone,
      testInfluencer.location,
      testInfluencer.category,
      testInfluencer.engagement_rate,
      testInfluencer.verified
    ];
    
    console.log('SQL:', sql);
    console.log('Params:', params);
    
    const result = await client.execute(sql, params);
    console.log('Insert result:', result);
    
    // Check if it was inserted
    const checkResult = await client.execute('SELECT * FROM influencers WHERE name = ?', [testInfluencer.name]);
    console.log('Check result:', checkResult.rows);
    
    // Count total influencers
    const countResult = await client.execute('SELECT COUNT(*) as count FROM influencers');
    console.log('Total influencers now:', countResult.rows[0]);
    
    console.log('✅ Direct insertion test completed!');
    
  } catch (error) {
    console.error('❌ Direct insertion test failed:', error);
  }
}

testDirectInsert();
