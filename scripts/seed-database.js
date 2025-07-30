require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@libsql/client');

// Create Turso client
const tursoClient = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const platforms = ['Instagram', 'LinkedIn', 'TikTok', 'Facebook'];
const countries = ['US', 'Canada', 'Germany', 'UK', 'France'];
const ageGroups = ['18-24', '25-34', '35-44', '45-54', '55+'];
const genders = ['Male', 'Female'];

const interestCategories = {
  Instagram: { Fashion: 85, Beauty: 72, Travel: 68, Fitness: 52, Food: 45, Photography: 42, Lifestyle: 38 },
  LinkedIn: { Technology: 78, Business: 65, Marketing: 58, Leadership: 48, Finance: 42, Entrepreneurship: 38, Sales: 35 },
  TikTok: { Comedy: 82, Dance: 75, Music: 68, DIY: 52, Gaming: 48, Sports: 42, Fashion: 38 },
  Facebook: { Family: 62, News: 54, Business: 47, Events: 44, Sports: 41, Hobbies: 38, Community: 35 },
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seedDatabase() {
  try {
    console.log('Starting comprehensive database seeding...');

    // Initialize schema - first create tables without constraints
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
        engagement_rate REAL DEFAULT 0.0,
        avg_likes INTEGER DEFAULT 0,
        avg_comments INTEGER DEFAULT 0,
        verified BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Add country column if it doesn't exist
    try {
      await tursoClient.execute(`ALTER TABLE influencers ADD COLUMN country TEXT DEFAULT 'US'`);
    } catch (error) {
      // Column already exists, ignore error
    }

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
    
    // Add country column to user_interests if it doesn't exist
    try {
      await tursoClient.execute(`ALTER TABLE user_interests ADD COLUMN country TEXT DEFAULT 'US'`);
    } catch (error) {
      // Column already exists, ignore error
    }
    
    // Create geographic_data table
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS geographic_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        country_code TEXT NOT NULL,
        country_name TEXT,
        region TEXT,
        city TEXT,
        user_count INTEGER DEFAULT 0,
        percentage REAL DEFAULT 0.0,
        latitude REAL,
        longitude REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Clear existing data
    console.log('Clearing existing data...');
    await tursoClient.execute('DELETE FROM influencers');
    await tursoClient.execute('DELETE FROM campaigns');
    await tursoClient.execute('DELETE FROM demographics');
    await tursoClient.execute('DELETE FROM user_interests');
    await tursoClient.execute('DELETE FROM geographic_data');

    // Seed campaigns
    console.log('Seeding campaigns...');
    const campaigns = [
      // Instagram Campaigns
      { name: 'Summer Fashion', platform: 'Instagram', status: 'active', country: 'US', budget: 50000, reach: 1200000, impressions: 5400000, clicks: 82000, conversions: 1240 },
      { name: 'Autumn Collection', platform: 'Instagram', status: 'active', country: 'Canada', budget: 65000, reach: 1800000, impressions: 7200000, clicks: 108000, conversions: 1620 },
      { name: 'Beauty Launch', platform: 'Instagram', status: 'active', country: 'UK', budget: 40000, reach: 950000, impressions: 3800000, clicks: 76000, conversions: 912 },
      
      // LinkedIn Campaigns
      { name: 'Tech Product Launch', platform: 'LinkedIn', status: 'active', country: 'US', budget: 75000, reach: 850000, impressions: 2550000, clicks: 51000, conversions: 765 },
      { name: 'B2B Software Demo', platform: 'LinkedIn', status: 'active', country: 'Germany', budget: 90000, reach: 1100000, impressions: 3300000, clicks: 66000, conversions: 990 },
      
      // TikTok Campaigns
      { name: 'Viral Dance Challenge', platform: 'TikTok', status: 'active', country: 'US', budget: 30000, reach: 2100000, impressions: 8400000, clicks: 168000, conversions: 1260 },
      { name: 'Comedy Series', platform: 'TikTok', status: 'active', country: 'Canada', budget: 25000, reach: 1700000, impressions: 6800000, clicks: 136000, conversions: 1020 },

      // Facebook Campaigns
      { name: 'Fashion Promo', platform: 'Facebook', status: 'active', country: 'France', budget: 45000, reach: 1500000, impressions: 6000000, clicks: 90000, conversions: 1350 },
      { name: 'Tech Webinar', platform: 'Facebook', status: 'active', country: 'Germany', budget: 60000, reach: 950000, impressions: 2850000, clicks: 57000, conversions: 855 },
    ];

    for (const campaign of campaigns) {
        await tursoClient.execute(
          `INSERT INTO campaigns (name, platform, status, country, budget, reach, impressions, clicks, conversions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [campaign.name, campaign.platform, campaign.status, campaign.country, campaign.budget, campaign.reach, campaign.impressions, campaign.clicks, campaign.conversions]
        );
      }
    console.log(`- ${campaigns.length} campaigns added`);
    
    // Seed geographic data
    console.log('Seeding geographic data...');
    const geoData = [
      { country_code: 'US', user_count: 1500000 },
      { country_code: 'CA', user_count: 800000 },
      { country_code: 'GB', user_count: 1200000 },
      { country_code: 'DE', user_count: 1100000 },
      { country_code: 'FR', user_count: 900000 },
    ];

    for (const geo of geoData) {
        await tursoClient.execute(
          `INSERT INTO geographic_data (country_code, user_count) VALUES (?, ?)`,
          [geo.country_code, geo.user_count]
        );
    }
    console.log(`- ${geoData.length} geographic records added`);

    // Seed more influencers/leads
    const influencers = [
      // Instagram Influencers
      { name: 'Sarah Johnson', projects: 12, followers: '2.4M', platform: 'Instagram', category: 'Fashion', engagement_rate: 4.5, verified: true, country: 'US' },
      { name: 'Emma Davis', projects: 15, followers: '3.1M', platform: 'Instagram', category: 'Beauty', engagement_rate: 5.2, verified: true, country: 'Canada' },
      { name: 'Jessica Williams', projects: 9, followers: '1.5M', platform: 'Instagram', category: 'Lifestyle', engagement_rate: 3.8, verified: false, country: 'UK' },
      { name: 'Carlos Garcia', projects: 13, followers: '1.7M', platform: 'Instagram', category: 'Fitness', engagement_rate: 4.1, verified: true, country: 'Germany' },
      { name: 'Ryan Thompson', projects: 14, followers: '2.8M', platform: 'Instagram', category: 'Travel', engagement_rate: 4.7, verified: true, country: 'France' },
      
      // LinkedIn Influencers
      { name: 'John Smith', projects: 10, followers: '1.2M', platform: 'LinkedIn', category: 'Technology', engagement_rate: 6.1, verified: true, country: 'US' },
      { name: 'Mike Chen', projects: 8, followers: '1.8M', platform: 'LinkedIn', category: 'Tech', engagement_rate: 6.2, verified: true, country: 'Canada' },
      { name: 'David Brown', projects: 11, followers: '2.1M', platform: 'LinkedIn', category: 'Business', engagement_rate: 5.8, verified: true, country: 'UK' },
      { name: 'Maya Patel', projects: 10, followers: '1.3M', platform: 'LinkedIn', category: 'Marketing', engagement_rate: 5.5, verified: false, country: 'Germany' },
      
      // TikTok Influencers
      { name: 'Emily Jones', projects: 15, followers: '5.2M', platform: 'TikTok', category: 'Entertainment', engagement_rate: 8.2, verified: true, country: 'Canada' },
      { name: 'Alex Rodriguez', projects: 6, followers: '987K', platform: 'TikTok', category: 'Comedy', engagement_rate: 8.9, verified: false, country: 'US' },
      { name: 'Lisa Wang', projects: 7, followers: '890K', platform: 'TikTok', category: 'Dance', engagement_rate: 9.2, verified: false, country: 'UK' },
      { name: 'Jordan Smith', projects: 9, followers: '1.2M', platform: 'TikTok', category: 'Entertainment', engagement_rate: 7.8, verified: true, country: 'Germany' },
      
      // Facebook Influencers
      { name: 'Chris Evans', projects: 5, followers: '800K', platform: 'Facebook', category: 'Lifestyle', engagement_rate: 3.4, verified: false, country: 'UK' },
      { name: 'Amanda Foster', projects: 11, followers: '2.3M', platform: 'Facebook', category: 'Lifestyle', engagement_rate: 3.2, verified: true, country: 'US' },
      { name: 'Marcus Johnson', projects: 8, followers: '1.9M', platform: 'Facebook', category: 'Business', engagement_rate: 2.8, verified: true, country: 'Canada' },
      { name: 'Sofia Martinez', projects: 10, followers: '1.6M', platform: 'Facebook', category: 'Family', engagement_rate: 4.1, verified: false, country: 'France' },
    ];

    for (const influencer of influencers) {
        await tursoClient.execute(
          `INSERT INTO influencers (name, projects, followers, platform, category, engagement_rate, verified, country) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [influencer.name, influencer.projects, influencer.followers, influencer.platform, influencer.category, influencer.engagement_rate, influencer.verified, influencer.country]
        );
      }
      console.log(`- ${influencers.length} influencers added`);

    // Seed Demographics - using actual schema with label, male, female columns
    console.log('Seeding demographics...');
    const demographics = [];
    for (const platform of platforms) {
      for (const country of countries) {
        for (const age_group of ageGroups) {
          demographics.push({
            platform,
            label: age_group,
            location: country,
            male: getRandomInt(20, 60),
            female: getRandomInt(20, 60)
          });
        }
      }
    }

    for (const demo of demographics) {
      await tursoClient.execute(
        `INSERT INTO demographics (platform, label, location, male, female) VALUES (?, ?, ?, ?, ?)`,
        [demo.platform, demo.label, demo.location, demo.male, demo.female]
      );
    }
    console.log(`- ${demographics.length} demographic records added`);

    // Seed User Interests
    console.log('Seeding user interests...');
    const interests = [];
    for (const platform of platforms) {
        for (const country of countries) {
            const platformInterests = interestCategories[platform];
            for (const interestName in platformInterests) {
                interests.push({
                    platform,
                    country,
                    interest_category: 'General',
                    interest_name: interestName,
                    percentage: getRandomInt(20, 90),
                    total_users: getRandomInt(20000, 200000)
                });
            }
        }
    }

    for (const interest of interests) {
      await tursoClient.execute(
        `INSERT INTO user_interests (platform, interest_category, interest_name, percentage, total_users, country) VALUES (?, ?, ?, ?, ?, ?)`,
        [interest.platform, interest.interest_category, interest.interest_name, interest.percentage, interest.total_users, interest.country]
      );
    }
    console.log(`- ${interests.length} interest records added`);

    console.log('Database seeded successfully!');

  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    if (tursoClient) {
        tursoClient.close();
    }
  }
}

// Run the seeding
seedDatabase().catch(console.error);
