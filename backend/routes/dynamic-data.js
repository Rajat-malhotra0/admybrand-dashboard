const express = require('express');
const { createClient } = require('@libsql/client');
const path = require('path');

const router = express.Router();
const dbPath = path.join(__dirname, '..', 'admybrand.db');
const db = createClient({ url: `file:${dbPath}` });

// Helper function to generate random data
function generateRandomData() {
  return {
    campaignStats: [
      {
        title: 'Total Reach',
        value: `${Math.floor(Math.random() * 5000) + 500}K`,
        icon: 'TrendingUp',
        description: `+${Math.floor(Math.random() * 30) + 5}% from last month`
      },
      {
        title: 'Engagement',
        value: `${Math.floor(Math.random() * 50000) + 10000}`,
        icon: 'Users',
        description: `+${Math.floor(Math.random() * 15) + 2}% from last week`
      },
      {
        title: 'Impressions',
        value: `${Math.floor(Math.random() * 2000) + 100}K`,
        icon: 'Eye',
        description: `+${Math.floor(Math.random() * 25) + 5}% from last month`
      },
      {
        title: 'Conversions',
        value: `${Math.floor(Math.random() * 1000) + 50}`,
        icon: 'Target',
        description: `+${Math.floor(Math.random() * 35) + 5}% from last month`
      }
    ],
    influencers: Array.from({ length: Math.floor(Math.random() * 5) + 3 }, (_, i) => ({
      id: Date.now() + i,
      name: `Dynamic Influencer ${i + 1}`,
      handle: `dynamic_${i + 1}`,
      followers: Math.floor(Math.random() * 100000) + 10000,
      engagement_rate: Math.random() * 10,
      tier: ['nano', 'micro', 'macro', 'mega'][Math.floor(Math.random() * 4)],
      collaboration_status: ['active', 'pending', 'completed'][Math.floor(Math.random() * 3)],
      rating: Math.random() * 5,
      category: ['Tech', 'Fashion', 'Gaming', 'Food', 'Travel'][Math.floor(Math.random() * 5)],
      cost_per_post: Math.floor(Math.random() * 5000) + 500,
      roi: Math.random() * 30,
      avg_likes: Math.floor(Math.random() * 5000) + 100,
      avg_comments: Math.floor(Math.random() * 500) + 10,
      reach_rate: Math.random() * 20
    })),
    demographics: [
      { age_range: '18-24', male_percentage: Math.floor(Math.random() * 30) + 15, female_percentage: Math.floor(Math.random() * 30) + 15 },
      { age_range: '25-34', male_percentage: Math.floor(Math.random() * 40) + 20, female_percentage: Math.floor(Math.random() * 40) + 20 },
      { age_range: '35-44', male_percentage: Math.floor(Math.random() * 30) + 15, female_percentage: Math.floor(Math.random() * 30) + 15 },
      { age_range: '45-54', male_percentage: Math.floor(Math.random() * 25) + 10, female_percentage: Math.floor(Math.random() * 25) + 10 },
      { age_range: '55+', male_percentage: Math.floor(Math.random() * 20) + 5, female_percentage: Math.floor(Math.random() * 20) + 5 }
    ],
    interests: [
      { interest: 'Technology', value: Math.floor(Math.random() * 100) + 30 },
      { interest: 'Entertainment', value: Math.floor(Math.random() * 100) + 40 },
      { interest: 'Sports', value: Math.floor(Math.random() * 100) + 20 },
      { interest: 'Fashion', value: Math.floor(Math.random() * 100) + 35 },
      { interest: 'Gaming', value: Math.floor(Math.random() * 100) + 25 },
      { interest: 'Travel', value: Math.floor(Math.random() * 100) + 30 }
    ]
  };
}

// GET endpoint to generate new data for a country
router.get('/generate/:country', async (req, res) => {
  try {
    const { country } = req.params;
    const platform = req.query.platform || 'LinkedIn';
    
    console.log(`Generating dynamic data for ${country} on ${platform}`);
    
    // Define countries that should have data
    const validCountries = ['US', 'Canada', 'Germany', 'United Kingdom', 'France', 'Japan', 'Australia', 'Brazil'];
    
    if (!validCountries.includes(country)) {
      return res.json({
        success: false,
        message: `No data available for ${country}`,
        country,
        platform,
        error: 'Country not supported'
      });
    }
    
    const newData = generateRandomData();
    
    // Get or create platform
    let platformResult = await db.execute({
      sql: 'SELECT * FROM platforms WHERE name = ?',
      args: [platform]
    });
    
    let platformId;
    if (platformResult.rows.length === 0) {
      const createPlatform = await db.execute({
        sql: 'INSERT INTO platforms (name) VALUES (?) RETURNING *',
        args: [platform]
      });
      platformId = createPlatform.rows[0].id;
    } else {
      platformId = platformResult.rows[0].id;
    }
    
    // Clear ALL existing data for this country/platform combination (including global fallbacks)
    await db.execute({
      sql: 'DELETE FROM campaign_stats WHERE platform_id = ? AND country = ?',
      args: [platformId, country]
    });
    
    await db.execute({
      sql: 'DELETE FROM influencers WHERE platform_id = ? AND country = ?',
      args: [platformId, country]
    });
    
    await db.execute({
      sql: 'DELETE FROM demographics WHERE platform_id = ? AND country = ?',
      args: [platformId, country]
    });
    
    await db.execute({
      sql: 'DELETE FROM interests WHERE platform_id = ? AND country = ?',
      args: [platformId, country]
    });
    
    console.log(`Cleared existing data for ${country} on platform ${platform}`);
    
    // Insert new campaign stats
    for (const stat of newData.campaignStats) {
      await db.execute({
        sql: 'INSERT INTO campaign_stats (platform_id, country, title, value, icon, description) VALUES (?, ?, ?, ?, ?, ?)',
        args: [platformId, country, stat.title, stat.value, stat.icon, stat.description]
      });
    }
    
    // Insert new influencers
    for (const influencer of newData.influencers) {
      await db.execute({
        sql: `INSERT INTO influencers (platform_id, country, name, handle, avatar, followers, engagement_rate, tier, collaboration_status, rating, category, cost_per_post, roi, avg_likes, avg_comments, reach_rate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          platformId, country, influencer.name, influencer.handle, 
          'https://ui-avatars.com/api/?name=' + encodeURIComponent(influencer.name),
          influencer.followers, influencer.engagement_rate, influencer.tier,
          influencer.collaboration_status, influencer.rating, influencer.category,
          influencer.cost_per_post, influencer.roi, influencer.avg_likes,
          influencer.avg_comments, influencer.reach_rate
        ]
      });
    }
    
    // Insert new demographics
    for (const demo of newData.demographics) {
      await db.execute({
        sql: 'INSERT INTO demographics (platform_id, country, age_range, male_percentage, female_percentage) VALUES (?, ?, ?, ?, ?)',
        args: [platformId, country, demo.age_range, demo.male_percentage, demo.female_percentage]
      });
    }
    
    // Insert new interests
    for (const interest of newData.interests) {
      await db.execute({
        sql: 'INSERT INTO interests (platform_id, country, interest, value) VALUES (?, ?, ?, ?)',
        args: [platformId, country, interest.interest, interest.value]
      });
    }
    
    res.json({
      success: true,
      message: `Dynamic data generated for ${country} on ${platform}`,
      country,
      platform,
      data: newData
    });
    
  } catch (error) {
    console.error('Error generating dynamic data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate dynamic data',
      details: error.message
    });
  }
});

// POST endpoint to update specific data values
router.post('/update/:country', async (req, res) => {
  try {
    const { country } = req.params;
    const { platform, dataType, updates } = req.body;
    
    console.log(`Updating ${dataType} data for ${country} on ${platform}`);
    
    // Get platform ID
    const platformResult = await db.execute({
      sql: 'SELECT * FROM platforms WHERE name = ?',
      args: [platform || 'LinkedIn']
    });
    
    if (platformResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Platform not found'
      });
    }
    
    const platformId = platformResult.rows[0].id;
    
    // Update based on data type
    switch (dataType) {
      case 'campaignStats':
        // Update campaign stats
        for (const update of updates) {
          await db.execute({
            sql: 'UPDATE campaign_stats SET value = ?, description = ? WHERE platform_id = ? AND country = ? AND title = ?',
            args: [update.value, update.description, platformId, country, update.title]
          });
        }
        break;
        
      case 'demographics':
        // Update demographics
        for (const update of updates) {
          await db.execute({
            sql: 'UPDATE demographics SET male_percentage = ?, female_percentage = ? WHERE platform_id = ? AND country = ? AND age_range = ?',
            args: [update.male_percentage, update.female_percentage, platformId, country, update.age_range]
          });
        }
        break;
        
      case 'interests':
        // Update interests
        for (const update of updates) {
          await db.execute({
            sql: 'UPDATE interests SET value = ? WHERE platform_id = ? AND country = ? AND interest = ?',
            args: [update.value, platformId, country, update.interest]
          });
        }
        break;
        
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid data type'
        });
    }
    
    res.json({
      success: true,
      message: `${dataType} updated for ${country} on ${platform}`,
      country,
      platform,
      dataType,
      updates
    });
    
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update data',
      details: error.message
    });
  }
});

module.exports = router;
