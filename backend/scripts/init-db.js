const { getTursoClient } = require('../lib/database/turso');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  try {
    const client = getTursoClient();
    
    // Read schema file
    const schemaPath = path.join(__dirname, '../../lib/database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log('Initializing database...');
    
    // Execute each statement
    for (const statement of statements) {
      try {
        await client.execute(statement);
        console.log(`✓ Executed: ${statement.substring(0, 50)}...`);
      } catch (error) {
        if (!error.message.includes('already exists')) {
          console.error(`❌ Error executing: ${statement.substring(0, 50)}...`);
          console.error(error.message);
        }
      }
    }
    
    console.log('✅ Database initialization completed!');
    
    // Add some sample data
    await seedSampleData(client);
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

async function seedSampleData(client) {
  console.log('Adding sample data...');
  
  try {
    // Sample influencers
    const sampleInfluencers = [
      { name: 'Alex Johnson', projects: 15, followers: '2.2M', platform: 'Instagram' },
      { name: 'Sarah Wilson', projects: 22, followers: '1.8M', platform: 'LinkedIn' },
      { name: 'Mike Chen', projects: 18, followers: '1.5M', platform: 'Facebook' },
    ];
    
    for (const influencer of sampleInfluencers) {
      await client.execute(
        `INSERT OR IGNORE INTO influencers (name, projects, followers, platform) VALUES (?, ?, ?, ?)`,
        [influencer.name, influencer.projects, influencer.followers, influencer.platform]
      );
    }
    
    // Sample campaigns
    const sampleCampaigns = [
      { 
        name: 'Summer Launch', 
        platform: 'Instagram', 
        status: 'active', 
        budget: 10000, 
        reach: 50000 
      },
      { 
        name: 'Tech Conference', 
        platform: 'LinkedIn', 
        status: 'completed', 
        budget: 15000, 
        reach: 75000 
      },
    ];
    
    for (const campaign of sampleCampaigns) {
      await client.execute(
        `INSERT OR IGNORE INTO campaigns (name, platform, status, budget, reach) VALUES (?, ?, ?, ?, ?)`,
        [campaign.name, campaign.platform, campaign.status, campaign.budget, campaign.reach]
      );
    }
    
    console.log('✅ Sample data added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding sample data:', error);
  }
}

// Run initialization
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };
