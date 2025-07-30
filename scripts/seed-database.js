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
  Instagram: { Fashion: 85, Beauty: 72, Travel: 68, Fitness: 52, Food: 45 },
  LinkedIn: { Technology: 78, Business: 65, Marketing: 58, Leadership: 48, Finance: 42 },
  TikTok: { Comedy: 82, Dance: 75, Entertainment: 68, DIY: 48, 'Life Hacks': 38 },
  Facebook: { Family: 62, 'Local Events': 54, 'Small Business': 47, 'Current Events': 41, Crafts: 35 },
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

    // Clear existing data
    console.log('Clearing existing data...');
    await tursoClient.execute('DELETE FROM influencers');
    await tursoClient.execute('DELETE FROM campaigns');
    await tursoClient.execute('DELETE FROM demographics');
    await tursoClient.execute('DELETE FROM user_interests');

    // Seed influencers
    const influencers = [
      { name: 'Sarah Johnson', projects: 12, followers: '2.4M', platform: 'Instagram', category: 'Fashion', engagement_rate: 4.5, verified: true, country: 'US' },
      { name: 'John Smith', projects: 10, followers: '1.2M', platform: 'LinkedIn', category: 'Technology', engagement_rate: 6.1, verified: true, country: 'US' },
      { name: 'Emily Jones', projects: 15, followers: '5.2M', platform: 'TikTok', category: 'Entertainment', engagement_rate: 8.2, verified: true, country: 'Canada' },
      { name: 'Chris Evans', projects: 5, followers: '800k', platform: 'Facebook', category: 'Lifestyle', engagement_rate: 3.4, verified: false, country: 'UK' },
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
