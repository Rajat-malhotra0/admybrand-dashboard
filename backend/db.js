const { createClient } = require('@libsql/client');
const path = require('path');

// Initialize database client
const client = createClient({
  url: process.env.DATABASE_URL || `file:${path.join(__dirname, 'admybrand.db')}`
});

// Database initialization
async function initializeDatabase() {
  try {
    // Create platforms table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS platforms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create campaign_stats table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS campaign_stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        platform_id INTEGER NOT NULL,
        country TEXT DEFAULT 'global',
        title TEXT NOT NULL,
        value TEXT NOT NULL,
        icon TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (platform_id) REFERENCES platforms(id)
      )
    `);

    // Create influencers table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS influencers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        platform_id INTEGER NOT NULL,
        country TEXT DEFAULT 'global',
        name TEXT NOT NULL,
        handle TEXT NOT NULL,
        avatar TEXT,
        followers INTEGER NOT NULL,
        engagement_rate REAL NOT NULL,
        tier TEXT NOT NULL CHECK(tier IN ('nano', 'micro', 'macro', 'mega')),
        collaboration_status TEXT NOT NULL CHECK(collaboration_status IN ('active', 'pending', 'completed')),
        rating REAL NOT NULL DEFAULT 0,
        category TEXT NOT NULL,
        cost_per_post INTEGER,
        roi REAL,
        avg_likes INTEGER DEFAULT 0,
        avg_comments INTEGER DEFAULT 0,
        reach_rate REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (platform_id) REFERENCES platforms(id)
      )
    `);

    // Create demographics table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS demographics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        platform_id INTEGER NOT NULL,
        country TEXT DEFAULT 'global',
        age_range TEXT NOT NULL,
        male_percentage INTEGER NOT NULL,
        female_percentage INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (platform_id) REFERENCES platforms(id)
      )
    `);

    // Create interests table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS interests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        platform_id INTEGER NOT NULL,
        country TEXT DEFAULT 'global',
        interest TEXT NOT NULL,
        value INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (platform_id) REFERENCES platforms(id)
      )
    `);

    // Create campaigns table for comprehensive campaign management
    await client.execute(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        platform_id INTEGER NOT NULL,
        country TEXT DEFAULT 'global',
        status TEXT NOT NULL CHECK(status IN ('active', 'paused', 'completed', 'draft')),
        budget REAL NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE,
        impressions INTEGER DEFAULT 0,
        clicks INTEGER DEFAULT 0,
        conversions INTEGER DEFAULT 0,
        cost_per_click REAL DEFAULT 0,
        click_through_rate REAL DEFAULT 0,
        reach INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (platform_id) REFERENCES platforms(id)
      )
    `);

    // Create countries table for country-specific data
    await client.execute(`
      CREATE TABLE IF NOT EXISTS countries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        iso_code TEXT NOT NULL UNIQUE,
        has_data BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Platform-related queries
async function getPlatforms() {
  const result = await client.execute('SELECT * FROM platforms ORDER BY name');
  return result.rows;
}

async function getPlatformByName(name) {
  const result = await client.execute({
    sql: 'SELECT * FROM platforms WHERE name = ?',
    args: [name]
  });
  return result.rows[0];
}

async function createPlatform(name) {
  const result = await client.execute({
    sql: 'INSERT INTO platforms (name) VALUES (?) RETURNING *',
    args: [name]
  });
  return result.rows[0];
}

// Campaign stats queries
async function getCampaignStats(platformName, country = 'global') {
  const result = await client.execute({
    sql: `
      SELECT cs.* FROM campaign_stats cs
      JOIN platforms p ON cs.platform_id = p.id
      WHERE p.name = ? AND cs.country = ?
      ORDER BY cs.id
    `,
    args: [platformName, country]
  });
  return result.rows;
}

async function createCampaignStat(platformId, country, title, value, icon, description) {
  const result = await client.execute({
    sql: 'INSERT INTO campaign_stats (platform_id, country, title, value, icon, description) VALUES (?, ?, ?, ?, ?, ?) RETURNING *',
    args: [platformId, country, title, value, icon, description]
  });
  return result.rows[0];
}

// Influencer queries
async function getInfluencers(platformName, country = 'global') {
  const result = await client.execute({
    sql: `
      SELECT i.* FROM influencers i
      JOIN platforms p ON i.platform_id = p.id
      WHERE p.name = ? AND i.country = ?
      ORDER BY i.followers DESC
    `,
    args: [platformName, country]
  });
  return result.rows;
}

async function createInfluencer(data) {
  const result = await client.execute({
    sql: `INSERT INTO influencers 
          (platform_id, country, name, handle, avatar, followers, engagement_rate, tier, 
           collaboration_status, rating, category, cost_per_post, roi, avg_likes, avg_comments, reach_rate) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
    args: [
      data.platform_id, data.country, data.name, data.handle, data.avatar,
      data.followers, data.engagement_rate, data.tier, data.collaboration_status,
      data.rating, data.category, data.cost_per_post, data.roi,
      data.avg_likes, data.avg_comments, data.reach_rate
    ]
  });
  return result.rows[0];
}

// Demographics queries
async function getDemographics(platformName, country = 'global') {
  const result = await client.execute({
    sql: `
      SELECT d.* FROM demographics d
      JOIN platforms p ON d.platform_id = p.id
      WHERE p.name = ? AND d.country = ?
      ORDER BY d.age_range
    `,
    args: [platformName, country]
  });
  return result.rows;
}

async function createDemographic(platformId, country, ageRange, malePercentage, femalePercentage) {
  const result = await client.execute({
    sql: 'INSERT INTO demographics (platform_id, country, age_range, male_percentage, female_percentage) VALUES (?, ?, ?, ?, ?) RETURNING *',
    args: [platformId, country, ageRange, malePercentage, femalePercentage]
  });
  return result.rows[0];
}

// Interests queries
async function getInterests(platformName, country = 'global') {
  const result = await client.execute({
    sql: `
      SELECT i.* FROM interests i
      JOIN platforms p ON i.platform_id = p.id
      WHERE p.name = ? AND i.country = ?
      ORDER BY i.value DESC
    `,
    args: [platformName, country]
  });
  return result.rows;
}

async function createInterest(platformId, country, interest, value) {
  const result = await client.execute({
    sql: 'INSERT INTO interests (platform_id, country, interest, value) VALUES (?, ?, ?, ?) RETURNING *',
    args: [platformId, country, interest, value]
  });
  return result.rows[0];
}

// Countries queries
async function getCountriesWithData() {
  const result = await client.execute('SELECT name FROM countries WHERE has_data = TRUE ORDER BY name');
  return result.rows.map(row => row.name);
}

async function createCountry(name, isoCode, hasData = false) {
  const result = await client.execute({
    sql: 'INSERT INTO countries (name, iso_code, has_data) VALUES (?, ?, ?) RETURNING *',
    args: [name, isoCode, hasData]
  });
  return result.rows[0];
}

// Campaign queries
async function getCampaigns(platformName, country = 'global') {
  const result = await client.execute({
    sql: `
      SELECT c.* FROM campaigns c
      JOIN platforms p ON c.platform_id = p.id
      WHERE p.name = ? AND c.country = ?
      ORDER BY c.created_at DESC
    `,
    args: [platformName, country]
  });
  return result.rows;
}

async function createCampaign(data) {
  const result = await client.execute({
    sql: `INSERT INTO campaigns 
          (name, platform_id, country, status, budget, start_date, end_date, 
           impressions, clicks, conversions, cost_per_click, click_through_rate, reach) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
    args: [
      data.name, data.platform_id, data.country, data.status, data.budget,
      data.start_date, data.end_date, data.impressions, data.clicks,
      data.conversions, data.cost_per_click, data.click_through_rate, data.reach
    ]
  });
  return result.rows[0];
}

// Generic query function for custom queries
async function query(sql, args = []) {
  return await client.execute({ sql, args });
}

module.exports = {
  client,
  initializeDatabase,
  // Platform functions
  getPlatforms,
  getPlatformByName,
  createPlatform,
  // Campaign stats functions
  getCampaignStats,
  createCampaignStat,
  // Influencer functions
  getInfluencers,
  createInfluencer,
  // Demographics functions
  getDemographics,
  createDemographic,
  // Interests functions
  getInterests,
  createInterest,
  // Countries functions
  getCountriesWithData,
  createCountry,
  // Campaign functions
  getCampaigns,
  createCampaign,
  // Generic query
  query
};
