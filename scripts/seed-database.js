require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@libsql/client');

// Create Turso client
const tursoClient = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Initialize schema first
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS influencers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        projects INTEGER NOT NULL DEFAULT 0,
        followers TEXT NOT NULL DEFAULT '0',
        platform TEXT NOT NULL DEFAULT 'General',
        email TEXT,
        phone TEXT,
        location TEXT,
        category TEXT,
        country TEXT DEFAULT 'US',
        engagement_rate REAL DEFAULT 0.0,
        avg_likes INTEGER DEFAULT 0,
        avg_comments INTEGER DEFAULT 0,
        verified BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        platform TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        start_date DATE,
        end_date DATE,
        budget REAL,
        reach INTEGER DEFAULT 0,
        impressions INTEGER DEFAULT 0,
        clicks INTEGER DEFAULT 0,
        conversions INTEGER DEFAULT 0,
        cost_per_click REAL DEFAULT 0.0,
        cost_per_conversion REAL DEFAULT 0.0,
        country TEXT DEFAULT 'US',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS demographics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        platform TEXT NOT NULL,
        age_group TEXT NOT NULL,
        gender TEXT NOT NULL,
        location TEXT NOT NULL,
        percentage REAL NOT NULL DEFAULT 0.0,
        total_users INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS user_interests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        platform TEXT NOT NULL,
        interest_category TEXT NOT NULL,
        interest_name TEXT NOT NULL,
        percentage REAL NOT NULL DEFAULT 0.0,
        total_users INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Clear existing data
    await tursoClient.execute('DELETE FROM influencers');
    await tursoClient.execute('DELETE FROM campaigns');
    await tursoClient.execute('DELETE FROM demographics');
    await tursoClient.execute('DELETE FROM user_interests');

    // Seed influencers with platform-specific data
    const influencers = [
      // Instagram Influencers
      { name: 'Sarah Johnson', projects: 12, followers: '2.4M', platform: 'Instagram', category: 'Fashion', engagement_rate: 4.5, verified: true },
      { name: 'Emma Davis', projects: 15, followers: '3.1M', platform: 'Instagram', category: 'Beauty', engagement_rate: 5.2, verified: true },
      { name: 'Jessica Williams', projects: 9, followers: '1.5M', platform: 'Instagram', category: 'Lifestyle', engagement_rate: 3.8, verified: false },
      { name: 'Carlos Garcia', projects: 13, followers: '1.7M', platform: 'Instagram', category: 'Fitness', engagement_rate: 4.1, verified: true },
      { name: 'Ryan Thompson', projects: 14, followers: '2.8M', platform: 'Instagram', category: 'Travel', engagement_rate: 4.7, verified: true },
      
      // LinkedIn Influencers  
      { name: 'Mike Chen', projects: 8, followers: '1,800,000', platform: 'LinkedIn', category: 'Tech', engagement_rate: 6.2, verified: true },
      { name: 'David Brown', projects: 11, followers: '2,100,000', platform: 'LinkedIn', category: 'Business', engagement_rate: 5.8, verified: true },
      { name: 'Maya Patel', projects: 10, followers: '1,300,000', platform: 'LinkedIn', category: 'Marketing', engagement_rate: 5.5, verified: false },
      
      // TikTok Influencers
      { name: 'Alex Rodriguez', projects: 6, followers: '987K', platform: 'TikTok', category: 'Comedy', engagement_rate: 8.9, verified: false },
      { name: 'Lisa Wang', projects: 7, followers: '890K', platform: 'TikTok', category: 'Dance', engagement_rate: 9.2, verified: false },
      { name: 'Jordan Smith', projects: 9, followers: '1.2M', platform: 'TikTok', category: 'Entertainment', engagement_rate: 7.8, verified: true },
    ];

    for (const influencer of influencers) {
      await tursoClient.execute(
        `INSERT INTO influencers (name, projects, followers, platform, category, engagement_rate, verified) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [influencer.name, influencer.projects, influencer.followers, influencer.platform, influencer.category, influencer.engagement_rate, influencer.verified]
      );
    }

    // Seed campaigns with realistic data
    const campaigns = [
      { name: 'Summer Fashion Campaign', platform: 'Instagram', status: 'active', country: 'US', budget: 50000, reach: 1200000, impressions: 5400000, clicks: 82000, conversions: 1240, cost_per_click: 0.61, cost_per_conversion: 40.32 },
      { name: 'Autumn Style Collection', platform: 'Instagram', status: 'active', country: 'US', budget: 65000, reach: 1800000, impressions: 7200000, clicks: 108000, conversions: 1620, cost_per_click: 0.60, cost_per_conversion: 40.12 },
      { name: 'Beauty Product Launch', platform: 'Instagram', status: 'active', country: 'US', budget: 40000, reach: 950000, impressions: 3800000, clicks: 76000, conversions: 912, cost_per_click: 0.53, cost_per_conversion: 43.86 },
      
      { name: 'Tech Product Launch', platform: 'LinkedIn', status: 'active', country: 'US', budget: 75000, reach: 850000, impressions: 2550000, clicks: 51000, conversions: 765, cost_per_click: 1.47, cost_per_conversion: 98.04 },
      { name: 'B2B Software Demo', platform: 'LinkedIn', status: 'active', country: 'US', budget: 90000, reach: 1100000, impressions: 3300000, clicks: 66000, conversions: 990, cost_per_click: 1.36, cost_per_conversion: 90.91 },
      
      { name: 'Fashion in Canada', platform: 'Instagram', status: 'active', country: 'Canada', budget: 35000, reach: 800000, impressions: 3200000, clicks: 64000, conversions: 960, cost_per_click: 0.55, cost_per_conversion: 36.46 },
      { name: 'Tech in Canada', platform: 'LinkedIn', status: 'active', country: 'Canada', budget: 60000, reach: 650000, impressions: 1950000, clicks: 39000, conversions: 585, cost_per_click: 1.54, cost_per_conversion: 102.56 },
      
      { name: 'German Fashion', platform: 'Instagram', status: 'active', country: 'Germany', budget: 45000, reach: 1000000, impressions: 4000000, clicks: 80000, conversions: 1200, cost_per_click: 0.56, cost_per_conversion: 37.50 },
      { name: 'German B2B', platform: 'LinkedIn', status: 'active', country: 'Germany', budget: 70000, reach: 750000, impressions: 2250000, clicks: 45000, conversions: 675, cost_per_click: 1.56, cost_per_conversion: 103.70 },
      
      { name: 'Viral Dance Challenge', platform: 'TikTok', status: 'active', country: 'US', budget: 30000, reach: 2100000, impressions: 8400000, clicks: 168000, conversions: 1260, cost_per_click: 0.18, cost_per_conversion: 23.81 },
      { name: 'Comedy Content Series', platform: 'TikTok', status: 'active', country: 'US', budget: 25000, reach: 1700000, impressions: 6800000, clicks: 136000, conversions: 1020, cost_per_click: 0.18, cost_per_conversion: 24.51 },
    ];

    for (const campaign of campaigns) {
      await tursoClient.execute(
        `INSERT INTO campaigns (name, platform, status, country, budget, reach, impressions, clicks, conversions, cost_per_click, cost_per_conversion) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [campaign.name, campaign.platform, campaign.status, campaign.country, campaign.budget, campaign.reach, campaign.impressions, campaign.clicks, campaign.conversions, campaign.cost_per_click, campaign.cost_per_conversion]
      );
    }

    // Seed demographics data
    const demographics = [
      // Instagram Demographics
      { platform: 'Instagram', age_group: '18-24', gender: 'Female', location: 'US', percentage: 35.2, total_users: 84480 },
      { platform: 'Instagram', age_group: '18-24', gender: 'Male', location: 'US', percentage: 28.1, total_users: 67440 },
      { platform: 'Instagram', age_group: '25-34', gender: 'Female', location: 'US', percentage: 28.7, total_users: 68880 },
      { platform: 'Instagram', age_group: '25-34', gender: 'Male', location: 'US', percentage: 22.3, total_users: 53520 },
      { platform: 'Instagram', age_group: '35-44', gender: 'Female', location: 'US', percentage: 18.5, total_users: 44400 },
      { platform: 'Instagram', age_group: '35-44', gender: 'Male', location: 'US', percentage: 15.2, total_users: 36480 },
      
      // LinkedIn Demographics
      { platform: 'LinkedIn', age_group: '25-34', gender: 'Male', location: 'US', percentage: 42.1, total_users: 101040 },
      { platform: 'LinkedIn', age_group: '25-34', gender: 'Female', location: 'US', percentage: 38.4, total_users: 92160 },
      { platform: 'LinkedIn', age_group: '35-44', gender: 'Male', location: 'US', percentage: 32.8, total_users: 78720 },
      { platform: 'LinkedIn', age_group: '35-44', gender: 'Female', location: 'US', percentage: 28.9, total_users: 69360 },
      { platform: 'LinkedIn', age_group: '45-54', gender: 'Male', location: 'US', percentage: 25.6, total_users: 61440 },
      { platform: 'LinkedIn', age_group: '45-54', gender: 'Female', location: 'US', percentage: 22.3, total_users: 53520 },
      
      // TikTok Demographics
      { platform: 'TikTok', age_group: '18-24', gender: 'Female', location: 'US', percentage: 48.9, total_users: 117360 },
      { platform: 'TikTok', age_group: '18-24', gender: 'Male', location: 'US', percentage: 41.2, total_users: 98880 },
      { platform: 'TikTok', age_group: '25-34', gender: 'Female', location: 'US', percentage: 32.1, total_users: 77040 },
      { platform: 'TikTok', age_group: '25-34', gender: 'Male', location: 'US', percentage: 28.7, total_users: 68880 },
    ];

    for (const demo of demographics) {
      await tursoClient.execute(
        `INSERT INTO demographics (platform, age_group, gender, location, percentage, total_users) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [demo.platform, demo.age_group, demo.gender, demo.location, demo.percentage, demo.total_users]
      );
    }

    // Seed user interests data
    const interests = [
      // Instagram Interests
      { platform: 'Instagram', interest_category: 'Lifestyle', interest_name: 'Fashion', percentage: 85.0, total_users: 204000 },
      { platform: 'Instagram', interest_category: 'Lifestyle', interest_name: 'Beauty', percentage: 72.0, total_users: 172800 },
      { platform: 'Instagram', interest_category: 'Lifestyle', interest_name: 'Travel', percentage: 68.0, total_users: 163200 },
      { platform: 'Instagram', interest_category: 'Sports', interest_name: 'Fitness', percentage: 52.0, total_users: 124800 },
      { platform: 'Instagram', interest_category: 'Food', interest_name: 'Cooking', percentage: 45.0, total_users: 108000 },
      
      // LinkedIn Interests  
      { platform: 'LinkedIn', interest_category: 'Technology', interest_name: 'Tech', percentage: 78.0, total_users: 187200 },
      { platform: 'LinkedIn', interest_category: 'Business', interest_name: 'Entrepreneurship', percentage: 65.0, total_users: 156000 },
      { platform: 'LinkedIn', interest_category: 'Business', interest_name: 'Marketing', percentage: 58.0, total_users: 139200 },
      { platform: 'LinkedIn', interest_category: 'Professional', interest_name: 'Leadership', percentage: 48.0, total_users: 115200 },
      { platform: 'LinkedIn', interest_category: 'Finance', interest_name: 'Investing', percentage: 42.0, total_users: 100800 },
      
      // TikTok Interests
      { platform: 'TikTok', interest_category: 'Entertainment', interest_name: 'Comedy', percentage: 82.0, total_users: 196800 },
      { platform: 'TikTok', interest_category: 'Entertainment', interest_name: 'Dance', percentage: 75.0, total_users: 180000 },
      { platform: 'TikTok', interest_category: 'Entertainment', interest_name: 'Music', percentage: 68.0, total_users: 163200 },
      { platform: 'TikTok', interest_category: 'Lifestyle', interest_name: 'DIY', percentage: 48.0, total_users: 115200 },
      { platform: 'TikTok', interest_category: 'Education', interest_name: 'Life Hacks', percentage: 38.0, total_users: 91200 },
    ];

    for (const interest of interests) {
      await tursoClient.execute(
        `INSERT INTO user_interests (platform, interest_category, interest_name, percentage, total_users) 
         VALUES (?, ?, ?, ?, ?)`,
        [interest.platform, interest.interest_category, interest.interest_name, interest.percentage, interest.total_users]
      );
    }

    console.log('Database seeded successfully!');
    console.log(`- ${influencers.length} influencers added`);
    console.log(`- ${campaigns.length} campaigns added`);
    console.log(`- ${demographics.length} demographic records added`);
    console.log(`- ${interests.length} interest records added`);

  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await tursoClient.close();
  }
}

// Run the seeding
seedDatabase().catch(console.error);
