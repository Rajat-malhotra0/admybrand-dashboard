const { createClient } = require('@libsql/client');
const path = require('path');

const dbPath = path.join(__dirname, 'admybrand.db');
const db = createClient({ url: `file:${dbPath}` });

const countries = ['US', 'Canada', 'Germany', 'United Kingdom', 'France', 'Japan', 'Australia', 'Brazil'];

async function seedCountryData() {
  try {
    console.log('🌱 Seeding additional country-specific data...');

    for (const country of countries) {
      // Seed influencers
      await db.execute({
        sql: `INSERT INTO influencers (platform_id, country, name, handle, avatar, followers, engagement_rate, tier, collaboration_status, rating, category, cost_per_post, roi, avg_likes, avg_comments, reach_rate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          1, country, `Test Influencer ${country}`, `test_${country}`, 'https://ui-avatars.com/api/?name=Test+User', 
          Math.floor(Math.random() * 100000), Math.random() * 10, 'micro', 'active', Math.random() * 5, 
          'Tech', Math.floor(Math.random() * 1000), Math.random() * 20, Math.floor(Math.random() * 1000), 
          Math.floor(Math.random() * 100), Math.random() * 15
        ]
      });

      // Seed demographics
      await db.execute({
        sql: `INSERT INTO demographics (platform_id, country, age_range, male_percentage, female_percentage) VALUES (?, ?, ?, ?, ?)`,
        args: [1, country, '25-34', Math.floor(Math.random() * 50), Math.floor(Math.random() * 50)]
      });

      // Seed campaign stats
      await db.execute({
        sql: `INSERT INTO campaign_stats (platform_id, country, title, value, icon, description) VALUES (?, ?, ?, ?, ?, ?)`,
        args: [1, country, 'Total Reach', `${Math.floor(Math.random() * 500)}K`, 'TrendingUp', '+10% from last month']
      });

      // Seed interests
      await db.execute({
        sql: `INSERT INTO interests (platform_id, country, interest, value) VALUES (?, ?, ?, ?)`,
        args: [1, country, 'Gaming', Math.floor(Math.random() * 100)]
      });
    }

    console.log('✅ Country-specific data seeded successfully!');

  } catch (error) {
    console.error('Error seeding country data:', error);
  } finally {
    db.close();
  }
}

seedCountryData();
