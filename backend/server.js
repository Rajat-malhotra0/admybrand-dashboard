require('dotenv').config({ path: '../.env.local' });
require('dotenv').config(); // Fallback to .env if .env.local doesn't exist
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, "public")));

// Upload routes
app.use('/api/upload', uploadRoutes);

// In-memory data store (platform data only)
let dashboardData = {
  // Platform-specific data
  platforms: {
    "LinkedIn": {
      campaignStats: [
        {
          id: 1,
          title: "Total Reach",
          value: "1.8M",
          icon: "TrendingUp",
          description: "+12% from last month",
        },
        {
          id: 2,
          title: "Engagement",
          value: "24,856",
          icon: "Users",
          description: "+8.3% from last week",
        },
        {
          id: 3,
          title: "Impressions",
          value: "950K",
          icon: "Eye",
          description: "+15.2% from last month",
        },
        {
          id: 4,
          title: "Conversions",
          value: "672",
          icon: "Target",
          description: "+18% from last month",
        },
      ],
      // influencerData is now sourced from database
      demographicsData: [
        { label: "25-34", male: 42, female: 38 },
        { label: "35-44", male: 35, female: 32 },
        { label: "45-54", male: 28, female: 25 },
        { label: "55+", male: 20, female: 18 },
        { label: "18-24", male: 15, female: 12 },
      ],
      interestsData: [
        { label: "Business", value: 92 },
        { label: "Technology", value: 88 },
        { label: "Professional Development", value: 85 },
        { label: "Leadership", value: 78 },
        { label: "Marketing", value: 72 },
        { label: "Finance", value: 68 },
      ],
    },
    "Instagram": {
      campaignStats: [
        {
          id: 1,
          title: "Total Reach",
          value: "2.4M",
          icon: "TrendingUp",
          description: "+15% from last month",
        },
        {
          id: 2,
          title: "Engagement",
          value: "48,392",
          icon: "Users",
          description: "+12.7% from last week",
        },
        {
          id: 3,
          title: "Impressions",
          value: "1.6M",
          icon: "Eye",
          description: "+9.8% from last month",
        },
        {
          id: 4,
          title: "Conversions",
          value: "1,234",
          icon: "Target",
          description: "+22% from last month",
        },
      ],
      // influencerData is now sourced from database
      demographicsData: [
        { label: "18-24", male: 32, female: 45 },
        { label: "25-34", male: 28, female: 38 },
        { label: "35-44", male: 18, female: 22 },
        { label: "45-54", male: 12, female: 15 },
        { label: "55+", male: 8, female: 10 },
      ],
      interestsData: [
        { label: "Fashion", value: 95 },
        { label: "Beauty", value: 88 },
        { label: "Lifestyle", value: 82 },
        { label: "Travel", value: 75 },
        { label: "Food", value: 68 },
        { label: "Fitness", value: 62 },
      ],
    },
    "Facebook": {
      campaignStats: [
        {
          id: 1,
          title: "Total Reach",
          value: "1.9M",
          icon: "TrendingUp",
          description: "+7% from last month",
        },
        {
          id: 2,
          title: "Engagement",
          value: "32,186",
          icon: "Users",
          description: "+5.4% from last week",
        },
        {
          id: 3,
          title: "Impressions",
          value: "1.2M",
          icon: "Eye",
          description: "+6.1% from last month",
        },
        {
          id: 4,
          title: "Conversions",
          value: "892",
          icon: "Target",
          description: "+14% from last month",
        },
      ],
      // influencerData is now sourced from database
      demographicsData: [
        { label: "35-44", male: 28, female: 32 },
        { label: "45-54", male: 25, female: 28 },
        { label: "25-34", male: 22, female: 25 },
        { label: "55+", male: 18, female: 22 },
        { label: "18-24", male: 12, female: 15 },
      ],
      interestsData: [
        { label: "Family", value: 85 },
        { label: "News", value: 78 },
        { label: "Entertainment", value: 72 },
        { label: "Community", value: 68 },
        { label: "Local Events", value: 58 },
        { label: "Sports", value: 52 },
      ],
    },
  },
  // Legacy global stats (for backward compatibility)
  campaignStats: [
    {
      id: 1,
      title: "Total Reach",
      value: "2.0M",
      icon: "TrendingUp",
      description: "+11% from last month",
    },
    {
      id: 2,
      title: "Engagement",
      value: "35,144",
      icon: "Users",
      description: "+8.8% from last week",
    },
    {
      id: 3,
      title: "Impressions",
      value: "1.3M",
      icon: "Eye",
      description: "+10.4% from last month",
    },
    {
      id: 4,
      title: "Conversions",
      value: "933",
      icon: "Target",
      description: "+18% from last month",
    },
  ],
  influencerData: [
    { id: 1, name: "Alex Johnson", projects: 21, followers: "2.2M" },
    { id: 2, name: "Sam Chen", projects: 18, followers: "1.9M" },
    { id: 3, name: "Riley Martinez", projects: 24, followers: "1.6M" },
    { id: 4, name: "Jordan Kim", projects: 15, followers: "1.3M" },
  ],
  demographicsData: [
    { label: "18-24", male: 25, female: 30 },
    { label: "25-34", male: 35, female: 32 },
    { label: "35-44", male: 24, female: 26 },
    { label: "45-54", male: 18, female: 22 },
    { label: "55+", male: 15, female: 18 },
  ],
  interestsData: [
    { label: "Technology", value: 85 },
    { label: "Business", value: 78 },
    { label: "Lifestyle", value: 72 },
    { label: "Entertainment", value: 68 },
    { label: "Education", value: 62 },
    { label: "Sports", value: 55 },
  ],
};

// Routes

// Get a list of countries with available campaign data
app.get("/api/countries-with-data", async (req, res) => {
  try {
    const { getTursoClient } = require('./lib/database/turso');
    const client = getTursoClient();
    
    // Query database for distinct countries from campaigns table
    const result = await client.execute('SELECT DISTINCT country FROM campaigns WHERE country IS NOT NULL AND country != ""');
    const countries = result.rows.map(row => row.country);
    
    console.log('Returning countries with data from database:', countries);
    res.json({ countries });
  } catch (error) {
    console.error('Error fetching countries with data:', error);
    res.status(500).json({ error: 'Failed to fetch country data', details: error.message });
  }
});

// Get all dashboard data
app.get("/api/dashboard", (req, res) => {
  res.json(dashboardData);
});

// Platform-specific data routes
app.get("/api/platforms/:platform", (req, res) => {
  const platform = req.params.platform;
  if (dashboardData.platforms[platform]) {
    res.json(dashboardData.platforms[platform]);
  } else {
    res.status(404).json({ error: "Platform not found" });
  }
});

// API endpoint that the frontend usePlatformData hook expects
app.get("/api/platform-data", async (req, res) => {
  const platform = req.query.platform;
  const country = req.query.country;
  
  console.log(`Platform data request - Platform: ${platform}, Country: ${country}`);
  
  try {
    const { getTursoClient } = require('./lib/database/turso');
    const client = getTursoClient();
    
    // If a country is specified, generate stats from database campaigns
    if (country) {
      console.log(`Fetching data for country: ${country}`);
      
      // Query campaigns for the specific country
      const campaignsQuery = platform 
        ? 'SELECT * FROM campaigns WHERE country = ? AND platform = ?'
        : 'SELECT * FROM campaigns WHERE country = ?';
      const campaignParams = platform ? [country, platform] : [country];
      
      const campaignsResult = await client.execute(campaignsQuery, campaignParams);
      const campaigns = campaignsResult.rows;
      
      console.log(`Found ${campaigns.length} campaigns for country: ${country}`);
      
      if (campaigns.length === 0) {
        // No data for this country
        console.log(`No data for country: ${country}. Returning zeroed stats.`);
        const zeroCampaignStats = [
          { id: 1, title: "Total Reach", value: "0", icon: "TrendingUp", description: "0 active campaigns" },
          { id: 2, title: "Engagement", value: "0", icon: "Users", description: "Avg CPC: $0.00" },
          { id: 3, title: "Impressions", value: "0", icon: "Eye", description: "Total views across campaigns" },
          { id: 4, title: "Conversions", value: "0", icon: "Target", description: "Avg cost: $0.00" }
        ];
        return res.json({
          campaignStats: zeroCampaignStats,
          influencerData: [],
          demographicsData: [],
          interestsData: [],
        });
      }
      
      // Calculate aggregated stats from campaigns
      const totalReach = campaigns.reduce((sum, campaign) => sum + (campaign.reach || 0), 0);
      const totalImpressions = campaigns.reduce((sum, campaign) => sum + (campaign.impressions || 0), 0);
      const totalClicks = campaigns.reduce((sum, campaign) => sum + (campaign.clicks || 0), 0);
      const totalConversions = campaigns.reduce((sum, campaign) => sum + (campaign.conversions || 0), 0);
      const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
      
      // Format numbers for display
      const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
        return num.toString();
      };
      
      const campaignStats = [
        { 
          id: 1, 
          title: "Total Reach", 
          value: formatNumber(totalReach), 
          icon: "TrendingUp", 
          description: `${activeCampaigns} active campaigns` 
        },
        { 
          id: 2, 
          title: "Engagement", 
          value: formatNumber(totalClicks), 
          icon: "Users", 
          description: totalImpressions > 0 ? `CTR: ${((totalClicks / totalImpressions) * 100).toFixed(2)}%` : "CTR: 0%" 
        },
        { 
          id: 3, 
          title: "Impressions", 
          value: formatNumber(totalImpressions), 
          icon: "Eye", 
          description: "Total views across campaigns" 
        },
        { 
          id: 4, 
          title: "Conversions", 
          value: formatNumber(totalConversions), 
          icon: "Target", 
          description: totalClicks > 0 ? `CVR: ${((totalConversions / totalClicks) * 100).toFixed(2)}%` : "CVR: 0%" 
        }
      ];
      
      console.log(`Returning calculated stats for country: ${country}`);
      return res.json({
        campaignStats,
        influencerData: [], // TODO: Add country-specific influencer data if needed
        demographicsData: [], // TODO: Add country-specific demographics data if needed
        interestsData: [], // TODO: Add country-specific interests data if needed
      });
    }
    
    // Get database influencers for global/platform data
    let dbInfluencers;
    if (platform) {
      dbInfluencers = await client.execute({
        sql: 'SELECT * FROM influencers WHERE platform = ? ORDER BY id DESC',
        args: [platform],
      });
    } else {
      dbInfluencers = await client.execute('SELECT * FROM influencers ORDER BY id DESC');
    }
    
    // Convert database rows to the expected format
    const influencerData = dbInfluencers.rows.map(row => ({
      id: row.id,
      name: row.name,
      projects: row.projects,
      followers: row.followers
    }));
    
    console.log(`Fetched ${influencerData.length} influencers from database${platform ? ` (filtered by platform: ${platform})` : ' (all platforms)'}`);
    
    if (platform) {
      // Get platform data from in-memory store
      const platformData = dashboardData.platforms[platform] || {};
      
      // Return platform data with database influencers
      res.json({
        ...platformData,
        influencerData: influencerData
      });
    } else {
      // Return global/default data with database influencers
      res.json({
        campaignStats: dashboardData.campaignStats,
        influencerData: influencerData,
        demographicsData: dashboardData.demographicsData,
        interestsData: dashboardData.interestsData
      });
    }
  } catch (error) {
    console.error('Error fetching database data for platform endpoint:', error);
    // Fallback to in-memory data if database fails
    if (platform && dashboardData.platforms[platform]) {
      res.json(dashboardData.platforms[platform]);
    } else if (!platform) {
      res.json({
        campaignStats: dashboardData.campaignStats,
        influencerData: dashboardData.influencerData,
        demographicsData: dashboardData.demographicsData,
        interestsData: dashboardData.interestsData
      });
    } else {
      res.status(404).json({ error: "Platform not found" });
    }
  }
});

// Get platform-specific campaign stats
app.get("/api/platforms/:platform/campaign-stats", (req, res) => {
  const platform = req.params.platform;
  if (dashboardData.platforms[platform]) {
    res.json(dashboardData.platforms[platform].campaignStats);
  } else {
    res.status(404).json({ error: "Platform not found" });
  }
});

// Get platform-specific influencers
app.get("/api/platforms/:platform/influencers", async (req, res) => {
  const platform = req.params.platform;
  
  try {
    const { getTursoClient } = require('./lib/database/turso');
    const client = getTursoClient();
    
    // Query Turso database for platform-specific influencers
    const result = await client.execute(
      'SELECT * FROM influencers WHERE platform = ? ORDER BY id DESC',
      [req.params.platform]
    );
    
    // Return result.rows in the same structure the frontend expects
    res.json(result.rows);
    
  } catch (error) {
    console.error('Influencer fetch error:', error);
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
app.get("/api/campaign-stats", (req, res) => {
  res.json(dashboardData.campaignStats);
});

app.post("/api/campaign-stats", (req, res) => {
  const newStat = {
    id: dashboardData.campaignStats.length + 1,
    ...req.body,
  };
  dashboardData.campaignStats.push(newStat);
  res.status(201).json(newStat);
});

app.put("/api/campaign-stats/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const statIndex = dashboardData.campaignStats.findIndex(
    (stat) => stat.id === id,
  );

  if (statIndex === -1) {
    return res.status(404).json({ error: "Campaign stat not found" });
  }

  dashboardData.campaignStats[statIndex] = { id, ...req.body };
  res.json(dashboardData.campaignStats[statIndex]);
});

app.delete("/api/campaign-stats/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const statIndex = dashboardData.campaignStats.findIndex(
    (stat) => stat.id === id,
  );

  if (statIndex === -1) {
    return res.status(404).json({ error: "Campaign stat not found" });
  }

  dashboardData.campaignStats.splice(statIndex, 1);
  res.status(204).send();
});

// Influencer Data Routes
app.get("/api/influencers", (req, res) => {
  res.json(dashboardData.influencerData);
});

// POST route for influencers is defined below with database integration

app.put("/api/influencers/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const influencerIndex = dashboardData.influencerData.findIndex(
    (inf) => inf.id === id,
  );

  if (influencerIndex === -1) {
    return res.status(404).json({ error: "Influencer not found" });
  }

  dashboardData.influencerData[influencerIndex] = { id, ...req.body };
  res.json(dashboardData.influencerData[influencerIndex]);
});

app.delete("/api/influencers/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const influencerIndex = dashboardData.influencerData.findIndex(
    (inf) => inf.id === id,
  );

  if (influencerIndex === -1) {
    return res.status(404).json({ error: "Influencer not found" });
  }

  dashboardData.influencerData.splice(influencerIndex, 1);
  res.status(204).send();
});

// Demographics Data Routes
app.get("/api/demographics", (req, res) => {
  res.json(dashboardData.demographicsData);
});

app.put("/api/demographics/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const demoIndex = dashboardData.demographicsData.findIndex(
    (demo) => demo.id === id,
  );

  if (demoIndex === -1) {
    return res.status(404).json({ error: "Demographics data not found" });
  }

  dashboardData.demographicsData[demoIndex] = { id, ...req.body };
  res.json(dashboardData.demographicsData[demoIndex]);
});

// Interests Data Routes
app.get("/api/interests", (req, res) => {
  res.json(dashboardData.interestsData);
});

app.put("/api/interests/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const interestIndex = dashboardData.interestsData.findIndex(
    (int) => int.id === id,
  );

  if (interestIndex === -1) {
    return res.status(404).json({ error: "Interest data not found" });
  }

  dashboardData.interestsData[interestIndex] = { id, ...req.body };
  res.json(dashboardData.interestsData[interestIndex]);
});

// Direct data insertion endpoints (no file upload)
app.post("/api/influencers", async (req, res) => {
  console.log('=== INFLUENCER POST REQUEST ===');
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
    
    const result = await client.execute(sql, params);
    console.log('Database execution result:', result);
    
    const response = { 
      message: 'Influencer added successfully',
      id: Number(result.lastInsertRowid),
      data: { name, projects: parseInt(projects), followers, platform }
    };
    
    console.log('Sending response:', response);
    res.status(201).json(response);
    
  } catch (error) {
    console.error('=== ERROR IN INFLUENCER POST ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to add influencer', details: error.message });
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
app.get("/api/db/influencers", async (req, res) => {
  try {
    const { getTursoClient } = require('./lib/database/turso');
    const client = getTursoClient();
    
    const result = await client.execute('SELECT * FROM influencers ORDER BY id DESC');
    res.json(result.rows);
    
  } catch (error) {
    console.error('Influencer fetch error:', error);
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
app.post("/api/reset", (req, res) => {
  dashboardData = {
    campaignStats: [
      {
        id: 1,
        title: "Total Likes",
        value: "350,809",
        icon: "thumbs-up",
      },
      {
        id: 2,
        title: "Total Comments",
        value: "186,072",
        icon: "message-square",
      },
      {
        id: 3,
        title: "Total Shares",
        value: "120,043",
        icon: "share",
      },
      {
        id: 4,
        title: "Engagement",
        value: "48.07%",
        icon: "bar-chart-2",
      },
    ],
    influencerData: [
      { id: 1, name: "Malik Wiwoho", projects: 23, followers: "1,620,201" },
      { id: 2, name: "Nancy Aulia", projects: 34, followers: "1,224,820" },
      { id: 3, name: "Natasha Vinessa", projects: 12, followers: "1,100,491" },
      { id: 4, name: "Wilona Hamda", projects: 8, followers: "927,421" },
      { id: 5, name: "Rava Hamda", projects: 10, followers: "827,810" },
    ],
    demographicsData: [
      { id: 1, label: "18-24", value: 28, color: "rgb(59, 130, 246)" },
      { id: 2, label: "25-34", value: 35, color: "rgb(16, 185, 129)" },
      { id: 3, label: "35-44", value: 22, color: "rgb(245, 158, 11)" },
      { id: 4, label: "45-54", value: 12, color: "rgb(239, 68, 68)" },
      { id: 5, label: "55+", value: 8, color: "rgb(139, 92, 246)" },
    ],
    interestsData: [
      { id: 1, label: "Technology", value: 85 },
      { id: 2, label: "Business", value: 72 },
      { id: 3, label: "Marketing", value: 90 },
      { id: 4, label: "Design", value: 65 },
      { id: 5, label: "Finance", value: 58 },
      { id: 6, label: "Education", value: 78 },
    ],
  };
  res.json({ message: "Data reset successfully", data: dashboardData });
});


// Test interface route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Test interface available at http://localhost:${PORT}`);
});
