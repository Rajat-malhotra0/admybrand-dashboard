require('dotenv').config({ path: '../.env.local' });
require('dotenv').config(); // Fallback to .env if .env.local doesn't exist
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const uploadRoutes = require('./routes/upload');
const dynamicDataRoutes = require('./routes/dynamic-data');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, "public")));

// Upload routes
app.use('/api/upload', uploadRoutes);

// Dynamic data routes
app.use('/api/dynamic-data', dynamicDataRoutes);

// Initialize database on startup
db.initializeDatabase().catch(error => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});

// Routes

// Get a list of countries with available campaign data
app.get("/api/countries-with-data", async (req, res) => {
  try {
    const { getTursoClient } = require('./lib/database/turso');
    const client = getTursoClient();
    
    const result = await client.execute(
      `SELECT DISTINCT location FROM demographics WHERE location != 'global' 
       UNION 
       SELECT DISTINCT country FROM campaigns WHERE country IS NOT NULL AND country != 'global'
       ORDER BY location`
    );
    
    const countries = result.rows.map(row => row.location || row.country).filter(Boolean);
    console.log('Returning countries with data from cloud database:', countries);
    
    res.json({ countries });
  } catch (error) {
    console.error('Error fetching countries with data:', error);
    res.status(500).json({ error: 'Failed to fetch country data', details: error.message });
  }
});

// Get all dashboard data from database
app.get("/api/dashboard", async (req, res) => {
  try {
    const campaignStats = await db.getCampaignStats('global');
    const leadData = await db.getLeads();
    const demographicsData = await db.getDemographics('global');
    const interestsData = await db.getInterests('global');
    
    res.json({
      campaignStats,
      leadData,
      demographicsData,
      interestsData
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data', details: error.message });
  }
});

// Platform-specific data routes
app.get("/api/platforms/:platform", async (req, res) => {
  const platform = req.params.platform;
  try {
    const campaignStats = await db.getCampaignStatsByPlatform(platform);
    const leadData = await db.getLeadsByPlatform(platform);
    const demographicsData = await db.getDemographicsByPlatform(platform);
    const interestsData = await db.getInterestsByPlatform(platform);
    
    if (campaignStats.length === 0 && leadData.length === 0) {
      return res.status(404).json({ error: "Platform not found or no data available" });
    }
    
    res.json({
      campaignStats,
      leadData,
      demographicsData,
      interestsData
    });
  } catch (error) {
    console.error('Error fetching platform data:', error);
    res.status(500).json({ error: 'Failed to fetch platform data', details: error.message });
  }
});

// API endpoint that the frontend usePlatformData hook expects
app.get("/api/platform-data", async (req, res) => {
  const platform = req.query.platform || 'LinkedIn';
  const country = req.query.country;
  
  console.log(`Platform data request - Platform: ${platform}, Country: ${country}`);
  
  try {
    const { getTursoClient } = require('./lib/database/turso');
    const client = getTursoClient();
    
    // Build queries based on platform and country filters
    const countryFilter = country && country !== 'global' ? country : 'global';
    
    // Get campaign stats - use the correct schema (platform column instead of platform_id)
    let campaignStats = await client.execute({
      sql: `SELECT * FROM campaign_stats WHERE platform = ? ORDER BY id`,
      args: [platform]
    });
    
    // Get leads - use the correct schema (platform column instead of platform_id)
    let leadData = await client.execute({
      sql: `SELECT * FROM leads WHERE platform = ? ORDER BY followers_count DESC`,
      args: [platform]
    });
    
    // Get demographics - use the correct schema with location column
    let demographicsData = await client.execute({
      sql: `SELECT * FROM demographics WHERE platform = ? AND location = ? ORDER BY id`,
      args: [platform, countryFilter]
    });
    
    // If no country-specific demographics, fall back to global
    if (demographicsData.rows.length === 0 && countryFilter !== 'global') {
      demographicsData = await client.execute({
        sql: `SELECT * FROM demographics WHERE platform = ? AND location = 'global' ORDER BY id`,
        args: [platform]
      });
    }
    
    // Get interests - use the correct schema
    let interestsData = await client.execute({
      sql: `SELECT * FROM interests WHERE platform = ? ORDER BY value DESC`,
      args: [platform]
    });
    
    // Format campaign stats for frontend
    const formattedCampaignStats = campaignStats.rows.map(row => ({
      id: row.id,
      title: row.title,
      value: row.value,
      icon: row.icon,
      description: row.description
    }));
    
    // Format lead data for frontend
    const formattedLeadData = leadData.rows.map(row => ({
      id: row.id,
      name: row.name,
      projects: row.projects || Math.floor(Math.random() * 20) + 1,
      followers: row.followers // Already formatted as string in database
    }));
    
    // Format demographics data for frontend
    const formattedDemographicsData = demographicsData.rows.map(row => ({
      label: row.label, // Use 'label' instead of 'age_range'
      male: row.male,   // Use 'male' instead of 'male_percentage'
      female: row.female // Use 'female' instead of 'female_percentage'
    }));
    
    // Format interests data for frontend
    const formattedInterestsData = interestsData.rows.map(row => ({
      label: row.label, // Use 'label' instead of 'interest'
      value: row.value
    }));
    
    console.log(`Returning data for ${platform}${country ? ` in ${country}` : ' globally'}:`);
    console.log(`- Campaign Stats: ${formattedCampaignStats.length}`);
    console.log(`- Leads: ${formattedLeadData.length}`);
    console.log(`- Demographics: ${formattedDemographicsData.length}`);
    console.log(`- Interests: ${formattedInterestsData.length}`);
    
    const response = {
      campaignStats: formattedCampaignStats,
      leadData: formattedLeadData,
      demographicsData: formattedDemographicsData,
      interestsData: formattedInterestsData
    };
    
    res.json(response);
    
  } catch (error) {
    console.error('Error fetching database data for platform endpoint:', error);
    res.status(500).json({ error: 'Failed to fetch platform data', details: error.message });
  }
});

// Get platform-specific campaign stats
app.get("/api/platforms/:platform/campaign-stats", async (req, res) => {
  try {
    const data = await db.getCampaignStatsByPlatform(req.params.platform);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get platform-specific leads
app.get("/api/platforms/:platform/leads", async (req, res) => {
  const platform = req.params.platform;
  
  try {
    const { getTursoClient } = require('./lib/database/turso');
    const client = getTursoClient();
    
    // Query Turso database for platform-specific leads
    const result = await client.execute(
      'SELECT * FROM leads WHERE platform = ? ORDER BY id DESC',
      [req.params.platform]
    );
    
    // Return result.rows in the same structure the frontend expects
    res.json(result.rows);
    
  } catch (error) {
    console.error('Lead fetch error:', error);
    return res.status(500).json({ error: 'DB error', details: error.message, fallback: true });
  }
});

// Get platform-specific demographics
app.get("/api/platforms/:platform/demographics", (req, res) => {
  const platform = req.params.platform;
  if (dashboardData.platforms[platform]) {
    res.json(dashboardData.platforms[platform].demographicsData);
  } else {
    res.status(404).json({ error: "Platform not found" });
  }
});

// Get platform-specific interests
app.get("/api/platforms/:platform/interests", (req, res) => {
  const platform = req.params.platform;
  if (dashboardData.platforms[platform]) {
    res.json(dashboardData.platforms[platform].interestsData);
  } else {
    res.status(404).json({ error: "Platform not found" });
  }
});

// Update platform-specific data
app.put("/api/platforms/:platform", (req, res) => {
  const platform = req.params.platform;
  if (dashboardData.platforms[platform]) {
    dashboardData.platforms[platform] = { ...dashboardData.platforms[platform], ...req.body };
    res.json(dashboardData.platforms[platform]);
  } else {
    res.status(404).json({ error: "Platform not found" });
  }
});

// Campaign Stats Routes
app.get("/api/campaign-stats", async (req, res) => {
  try {
    const data = await db.getCampaignStats('global');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/campaign-stats", async (req, res) => {
  try {
    const newStat = await db.addCampaignStat(req.body);
    res.status(201).json(newStat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lead Data Routes
app.get("/api/leads", async (req, res) => {
  try {
    const data = await db.getLeads();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Demographics Data Routes
app.get("/api/demographics", async (req, res) => {
  try {
    const data = await db.getDemographics('global');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Interests Data Routes
app.get("/api/interests", async (req, res) => {
  try {
    const data = await db.getInterests('global');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Direct data insertion endpoints (no file upload)
app.post("/api/leads", async (req, res) => {
  console.log('=== LEAD POST REQUEST ===');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  console.log('Request headers:', req.headers);
  
  try {
    const { getTursoClient } = require('./lib/database/turso');
    const client = getTursoClient();
    console.log('Database client obtained successfully');
    
    const { name, projects, followers, platform = 'General', email, phone, location, category, engagement_rate = 0, verified = false } = req.body;
    
    console.log('Extracted data:', {
      name, projects, followers, platform, email, phone, location, category, engagement_rate, verified
    });
    
    if (!name || projects === undefined || !followers) {
      console.log('Validation failed - missing required fields');
      return res.status(400).json({ error: 'Name, projects, and followers are required' });
    }
    
    const sql = `INSERT INTO leads 
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
    
    const result = await client.execute(sql, params);
    console.log('Database execution result:', result);
    
    const response = { 
      message: 'Lead added successfully',
      id: Number(result.lastInsertRowid),
      data: { name, projects: parseInt(projects), followers, platform }
    };
    
    console.log('Sending response:', response);
    res.status(201).json(response);
    
  } catch (error) {
    console.error('=== ERROR IN LEAD POST ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to add lead', details: error.message });
  }
});

app.post("/api/campaigns", async (req, res) => {
  console.log('=== CAMPAIGN POST REQUEST ===');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  console.log('Request headers:', req.headers);
  
  try {
    const { getTursoClient } = require('./lib/database/turso');
    const client = getTursoClient();
    console.log('Database client obtained successfully');
    
    const { name, platform, country, status = 'active', start_date, end_date, budget, reach = 0, impressions = 0, clicks = 0, conversions = 0 } = req.body;
    
    console.log('Extracted data:', {
      name, platform, country, status, start_date, end_date, budget, reach, impressions, clicks, conversions
    });
    
    if (!name || !platform) {
      console.log('Validation failed - missing required fields');
      return res.status(400).json({ error: 'Name and platform are required' });
    }
    
    const sql = `INSERT INTO campaigns 
                 (name, platform, country, status, start_date, end_date, budget, reach, impressions, clicks, conversions)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const params = [
      name,
      platform,
      country || null,
      status,
      start_date || null,
      end_date || null,
      budget ? parseFloat(budget) : null,
      parseInt(reach),
      parseInt(impressions),
      parseInt(clicks),
      parseInt(conversions)
    ];
    
    console.log('SQL Query:', sql);
    console.log('SQL Parameters:', params);
    
    const result = await client.execute(sql, params);
    console.log('Database execution result:', result);
    
    const response = { 
      message: 'Campaign added successfully',
      id: Number(result.lastInsertRowid),
      data: { name, platform, status }
    };
    
    console.log('Sending response:', response);
    res.status(201).json(response);
    
  } catch (error) {
    console.error('=== ERROR IN CAMPAIGN POST ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to add campaign', details: error.message });
  }
});

app.post("/api/demographics", async (req, res) => {
  try {
    const { getTursoClient } = require('./lib/database/turso');
    const client = getTursoClient();
    
    const { platform, age_group, gender, location, percentage, total_users = 0 } = req.body;
    
    if (!platform || !age_group || !gender || !location || percentage === undefined) {
      return res.status(400).json({ error: 'Platform, age_group, gender, location, and percentage are required' });
    }
    
    const sql = `INSERT INTO demographics 
                 (platform, age_group, gender, location, percentage, total_users)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    
    const result = await client.execute(sql, [
      platform,
      age_group,
      gender,
      location,
      parseFloat(percentage),
      parseInt(total_users)
    ]);
    
    res.status(201).json({ 
      message: 'Demographics data added successfully',
      id: Number(result.lastInsertRowid),
      data: { platform, age_group, gender, location, percentage }
    });
    
  } catch (error) {
    console.error('Error adding demographics:', error);
    res.status(500).json({ error: 'Failed to add demographics', details: error.message });
  }
});

// Get data from database endpoints
app.get("/api/db/leads", async (req, res) => {
  try {
    const { getTursoClient } = require('./lib/database/turso');
    const client = getTursoClient();
    
    const result = await client.execute('SELECT * FROM leads ORDER BY id DESC');
    res.json(result.rows);
    
  } catch (error) {
    console.error('Lead fetch error:', error);
    return res.status(500).json({ error: 'DB error', details: error.message, fallback: true });
  }
});

app.get("/api/db/campaigns", async (req, res) => {
  try {
    const { getTursoClient } = require('./lib/database/turso');
    const client = getTursoClient();
    
    const result = await client.execute('SELECT * FROM campaigns ORDER BY id DESC');
    res.json(result.rows);
    
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns', details: error.message });
  }
});

app.get("/api/db/demographics", async (req, res) => {
  try {
    const { getTursoClient } = require('./lib/database/turso');
    const client = getTursoClient();
    
    const result = await client.execute('SELECT * FROM demographics ORDER BY id DESC');
    res.json(result.rows);
    
  } catch (error) {
    console.error('Error fetching demographics:', error);
    res.status(500).json({ error: 'Failed to fetch demographics', details: error.message });
  }
});

// Reset data to default
app.post("/api/reset", async (req, res) => {
  try {
    const { enhancedSeed } = require('./enhanced-seed');
    await enhancedSeed();
    res.json({ message: "Data reset successfully with enhanced seed data" });
  } catch (error) {
    console.error('Error in reset endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});


// Test interface route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Test interface available at http://localhost:${PORT}`);
});
