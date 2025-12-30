const { getTursoClient } = require('../src/database/lib/database/turso');

async function testInfluencerInsert() {
  console.log('=== TESTING INFLUENCER INSERT ===');
  
  try {
    const client = getTursoClient();
    console.log('Database client obtained successfully');
    
    // Test data similar to what frontend sends
    const testData = {
      name: 'Test User',
      projects: 5,
      followers: '1.2M'
    };
    
    console.log('Test data:', testData);
    
    const { name, projects, followers, platform = 'General', email, phone, location, category, engagement_rate = 0, verified = false } = testData;
    
    console.log('Extracted data:', {
      name, projects, followers, platform, email, phone, location, category, engagement_rate, verified
    });
    
    const sql = `INSERT INTO influencers 
                 (name, projects, followers, platform, email, phone, location, category, engagement_rate, verified)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const params = [
      name,
      parseInt(projects),
      followers,
      platform,
      email || null,
      phone || null,
      location || null,
      category || null,
      parseFloat(engagement_rate),
      Boolean(verified)
    ];
    
    console.log('SQL Query:', sql);
    console.log('SQL Parameters:', params);
    console.log('Parameter count:', params.length);
    
    const result = await client.execute(sql, params);
    console.log('Database execution result:', result);
    
    // Query the inserted record
    const selectResult = await client.execute('SELECT * FROM influencers WHERE id = ?', [Number(result.lastInsertRowid)]);
    console.log('Inserted record:', selectResult.rows[0]);
    
  } catch (error) {
    console.error('=== ERROR ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
  }
}

testInfluencerInsert();
