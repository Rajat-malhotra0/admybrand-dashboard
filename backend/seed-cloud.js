// Load environment variables first
require('dotenv').config({ path: require('path').join(__dirname, '../.env.local') });
require('dotenv').config();

const { getTursoClient } = require('./lib/database/turso');

// Force Turso connection by checking environment variables
if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  console.error('❌ Turso credentials not found in environment variables!');
  console.error('Please check your .env.local file contains:');
  console.error('- TURSO_DATABASE_URL');
  console.error('- TURSO_AUTH_TOKEN');
  process.exit(1);
}

async function seedCloudDatabase() {
  try {
    console.log('🌐 Starting Turso cloud database seeding...');
    console.log(`📍 Connecting to: ${process.env.TURSO_DATABASE_URL}`);

    const client = getTursoClient();

    // Create tables first
    console.log('Creating tables...');
    
    const tables = [
      `CREATE TABLE IF NOT EXISTS countries (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        coordinates TEXT NOT NULL,
        value INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS campaign_stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        value TEXT NOT NULL,
        raw_value INTEGER DEFAULT 0,
        icon TEXT NOT NULL DEFAULT 'TrendingUp',
        description TEXT,
        platform TEXT DEFAULT 'global',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        projects INTEGER NOT NULL DEFAULT 0,
        followers TEXT NOT NULL DEFAULT '0',
        followers_count INTEGER DEFAULT 0,
        platform TEXT NOT NULL DEFAULT 'general',
        email TEXT,
        phone TEXT,
        location TEXT,
        category TEXT,
        engagement_rate REAL DEFAULT 0.0,
        verified BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS demographics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        label TEXT NOT NULL,
        male INTEGER DEFAULT 0,
        female INTEGER DEFAULT 0,
        platform TEXT DEFAULT 'global',
        location TEXT DEFAULT 'global',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS user_interests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        platform TEXT NOT NULL,
        interest_category TEXT NOT NULL,
        interest_name TEXT NOT NULL,
        percentage REAL NOT NULL DEFAULT 0.0,
        total_users INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS campaigns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        platform TEXT NOT NULL,
        country TEXT,
        status TEXT NOT NULL DEFAULT 'active',
        start_date DATE,
        end_date DATE,
        budget REAL,
        reach INTEGER DEFAULT 0,
        impressions INTEGER DEFAULT 0,
        clicks INTEGER DEFAULT 0,
        conversions INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    for (const sql of tables) {
      await client.execute(sql);
    }
    console.log('✅ Tables created successfully');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    const tablesToClear = ['campaign_stats', 'leads', 'demographics', 'user_interests', 'campaigns', 'countries'];
    for (const table of tablesToClear) {
      await client.execute(`DELETE FROM ${table}`);
    }
    console.log('✅ Data cleared successfully');

    // Countries data for map visualization
    const countries = [
      { id: "CAN", name: "Canada", coordinates: [-106.3468, 56.1304], value: 150000 },
      { id: "DEU", name: "Germany", coordinates: [10.4515, 51.1657], value: 210000 },
      { id: "USA", name: "US", coordinates: [-95.7129, 37.0902], value: 650000 },
      { id: "GBR", name: "United Kingdom", coordinates: [-3.4360, 55.3781], value: 280000 },
      { id: "FRA", name: "France", coordinates: [2.3522, 48.8566], value: 195000 },
      { id: "JPN", name: "Japan", coordinates: [138.2529, 36.2048], value: 140000 },
      { id: "AUS", name: "Australia", coordinates: [133.7751, -25.2744], value: 95000 },
      { id: "BRA", name: "Brazil", coordinates: [-51.9253, -14.2350], value: 380000 },
      { id: "IND", name: "India", coordinates: [20.5937, 78.9629], value: 420000 },
      { id: "CHN", name: "China", coordinates: [104.1954, 35.8617], value: 320000 },
    ];

    // Campaign statistics for all platforms including Facebook
    const campaignStats = [
      // Global Stats
      { title: "Total Reach", value: "15.2M", raw_value: 15200000, icon: "TrendingUp", description: "+18% from last month", platform: "global" },
      { title: "Total Engagement", value: "2.8M", raw_value: 2800000, icon: "Users", description: "+12.4% from last week", platform: "global" },
      { title: "Total Impressions", value: "45.7M", raw_value: 45700000, icon: "Eye", description: "+15.6% from last month", platform: "global" },
      { title: "Conversions", value: "68.9K", raw_value: 68900, icon: "Target", description: "+22.3% from last month", platform: "global" },
      
      // LinkedIn Stats
      { title: "Professional Reach", value: "3.4M", raw_value: 3400000, icon: "TrendingUp", description: "+14.2% from last month", platform: "LinkedIn" },
      { title: "Profile Views", value: "890K", raw_value: 890000, icon: "Users", description: "+9.8% from last week", platform: "LinkedIn" },
      { title: "Content Impressions", value: "12.1M", raw_value: 12100000, icon: "Eye", description: "+11.3% from last month", platform: "LinkedIn" },
      { title: "Lead Generation", value: "15.4K", raw_value: 15400, icon: "Target", description: "+19.7% from last month", platform: "LinkedIn" },
      
      // Instagram Stats
      { title: "Post Reach", value: "8.9M", raw_value: 8900000, icon: "TrendingUp", description: "+16.8% from last month", platform: "Instagram" },
      { title: "Story Views", value: "4.2M", raw_value: 4200000, icon: "Eye", description: "+13.2% from last month", platform: "Instagram" },
      { title: "Profile Visits", value: "2.1M", raw_value: 2100000, icon: "Users", description: "+18.5% from last month", platform: "Instagram" },
      { title: "Saves & Shares", value: "425K", raw_value: 425000, icon: "Target", description: "+24.1% from last month", platform: "Instagram" },
      
      // Facebook Stats
      { title: "Page Reach", value: "6.8M", raw_value: 6800000, icon: "TrendingUp", description: "+8.4% from last month", platform: "Facebook" },
      { title: "Post Engagement", value: "1.2M", raw_value: 1200000, icon: "Users", description: "+7.2% from last month", platform: "Facebook" },
      { title: "Page Views", value: "2.4M", raw_value: 2400000, icon: "Eye", description: "+9.8% from last month", platform: "Facebook" },
      { title: "Click-throughs", value: "185K", raw_value: 185000, icon: "Target", description: "+15.6% from last month", platform: "Facebook" },
    ];

    // Comprehensive leads data including Facebook influencers
    const leads = [
      // LinkedIn Influencers
      { name: "Sarah Johnson", projects: 24, followers: "2.3M", followers_count: 2300000, platform: "LinkedIn", category: "Business Strategy", email: "sarah@email.com", verified: true, engagement_rate: 6.8, location: "US" },
      { name: "Mike Chen", projects: 18, followers: "1.8M", followers_count: 1800000, platform: "LinkedIn", category: "Technology", email: "mike@email.com", verified: true, engagement_rate: 7.2, location: "Canada" },
      { name: "Emma Davis", projects: 32, followers: "3.1M", followers_count: 3100000, platform: "LinkedIn", category: "Marketing", email: "emma@email.com", verified: true, engagement_rate: 5.9, location: "United Kingdom" },
      { name: "Alex Rodriguez", projects: 15, followers: "987K", followers_count: 987000, platform: "LinkedIn", category: "Finance", email: "alex@email.com", verified: false, engagement_rate: 8.1, location: "Germany" },
      
      // Instagram Influencers
      { name: "Jessica Williams", projects: 28, followers: "4.5M", followers_count: 4500000, platform: "Instagram", category: "Fashion", email: "jessica@email.com", verified: true, engagement_rate: 8.7, location: "US" },
      { name: "David Brown", projects: 21, followers: "2.1M", followers_count: 2100000, platform: "Instagram", category: "Fitness", email: "david@email.com", verified: true, engagement_rate: 9.2, location: "Canada" },
      { name: "Lisa Wang", projects: 35, followers: "6.8M", followers_count: 6800000, platform: "Instagram", category: "Beauty", email: "lisa@email.com", verified: true, engagement_rate: 7.4, location: "US" },
      { name: "Carlos Garcia", projects: 19, followers: "1.7M", followers_count: 1700000, platform: "Instagram", category: "Travel", email: "carlos@email.com", verified: true, engagement_rate: 8.3, location: "Germany" },
      
      // Facebook Influencers
      { name: "Maya Patel", projects: 26, followers: "3.2M", followers_count: 3200000, platform: "Facebook", category: "Parenting", email: "maya@email.com", verified: true, engagement_rate: 6.1, location: "US" },
      { name: "Ryan Thompson", projects: 22, followers: "2.8M", followers_count: 2800000, platform: "Facebook", category: "Food & Cooking", email: "ryan@email.com", verified: true, engagement_rate: 7.3, location: "Canada" },
      { name: "Sophie Mueller", projects: 18, followers: "1.9M", followers_count: 1900000, platform: "Facebook", category: "Local Community", email: "sophie@email.com", verified: true, engagement_rate: 5.8, location: "Germany" },
      { name: "James Wilson", projects: 31, followers: "4.1M", followers_count: 4100000, platform: "Facebook", category: "Entertainment", email: "james@email.com", verified: true, engagement_rate: 6.9, location: "United Kingdom" },
      { name: "Isabella Chen", projects: 20, followers: "2.4M", followers_count: 2400000, platform: "Facebook", category: "Health & Wellness", email: "isabella@email.com", verified: true, engagement_rate: 7.1, location: "US" },
      { name: "Oliver Schmidt", projects: 16, followers: "1.6M", followers_count: 1600000, platform: "Facebook", category: "Gaming", email: "oliver@email.com", verified: false, engagement_rate: 8.4, location: "Germany" },
    ];

    // Comprehensive demographics data for all platforms and locations
    const demographics = [
      // Global Demographics
      { label: "13-17", male: 18, female: 22, platform: "global", location: "global" },
      { label: "18-24", male: 28, female: 32, platform: "global", location: "global" },
      { label: "25-34", male: 31, female: 29, platform: "global", location: "global" },
      { label: "35-44", male: 18, female: 16, platform: "global", location: "global" },
      { label: "45-54", male: 12, female: 10, platform: "global", location: "global" },
      { label: "55+", male: 8, female: 6, platform: "global", location: "global" },
      
      // LinkedIn Demographics (Professional focus)
      { label: "22-29", male: 45, female: 38, platform: "LinkedIn", location: "global" },
      { label: "30-39", male: 42, female: 40, platform: "LinkedIn", location: "global" },
      { label: "40-49", male: 35, female: 32, platform: "LinkedIn", location: "global" },
      { label: "50+", male: 28, female: 25, platform: "LinkedIn", location: "global" },
      
      // LinkedIn - US
      { label: "22-29", male: 48, female: 35, platform: "LinkedIn", location: "US" },
      { label: "30-39", male: 44, female: 42, platform: "LinkedIn", location: "US" },
      { label: "40-49", male: 38, female: 34, platform: "LinkedIn", location: "US" },
      { label: "50+", male: 30, female: 27, platform: "LinkedIn", location: "US" },
      
      // LinkedIn - Canada
      { label: "22-29", male: 42, female: 41, platform: "LinkedIn", location: "Canada" },
      { label: "30-39", male: 40, female: 43, platform: "LinkedIn", location: "Canada" },
      { label: "40-49", male: 33, female: 35, platform: "LinkedIn", location: "Canada" },
      { label: "50+", male: 25, female: 28, platform: "LinkedIn", location: "Canada" },
      
      // Instagram Demographics (Younger skew)
      { label: "13-17", male: 32, female: 38, platform: "Instagram", location: "global" },
      { label: "18-24", male: 35, female: 42, platform: "Instagram", location: "global" },
      { label: "25-34", male: 28, female: 32, platform: "Instagram", location: "global" },
      { label: "35-44", male: 18, female: 22, platform: "Instagram", location: "global" },
      { label: "45+", male: 12, female: 15, platform: "Instagram", location: "global" },
      
      // Instagram - US
      { label: "13-17", male: 30, female: 40, platform: "Instagram", location: "US" },
      { label: "18-24", male: 33, female: 45, platform: "Instagram", location: "US" },
      { label: "25-34", male: 26, female: 34, platform: "Instagram", location: "US" },
      { label: "35-44", male: 16, female: 24, platform: "Instagram", location: "US" },
      { label: "45+", male: 10, female: 17, platform: "Instagram", location: "US" },
      
      // Facebook Demographics (Broader age range)
      { label: "18-24", male: 22, female: 25, platform: "Facebook", location: "global" },
      { label: "25-34", male: 28, female: 32, platform: "Facebook", location: "global" },
      { label: "35-44", male: 35, female: 38, platform: "Facebook", location: "global" },
      { label: "45-54", male: 32, female: 35, platform: "Facebook", location: "global" },
      { label: "55-64", male: 28, female: 30, platform: "Facebook", location: "global" },
      { label: "65+", male: 22, female: 25, platform: "Facebook", location: "global" },
      
      // Facebook - US
      { label: "18-24", male: 20, female: 23, platform: "Facebook", location: "US" },
      { label: "25-34", male: 26, female: 30, platform: "Facebook", location: "US" },
      { label: "35-44", male: 33, female: 36, platform: "Facebook", location: "US" },
      { label: "45-54", male: 30, female: 33, platform: "Facebook", location: "US" },
      { label: "55-64", male: 26, female: 28, platform: "Facebook", location: "US" },
      { label: "65+", male: 20, female: 23, platform: "Facebook", location: "US" },
      
      // Facebook - Canada
      { label: "18-24", male: 24, female: 27, platform: "Facebook", location: "Canada" },
      { label: "25-34", male: 30, female: 34, platform: "Facebook", location: "Canada" },
      { label: "35-44", male: 37, female: 40, platform: "Facebook", location: "Canada" },
      { label: "45-54", male: 34, female: 37, platform: "Facebook", location: "Canada" },
      { label: "55-64", male: 30, female: 32, platform: "Facebook", location: "Canada" },
      { label: "65+", male: 24, female: 27, platform: "Facebook", location: "Canada" },
      
      // Facebook - Germany
      { label: "18-24", male: 21, female: 24, platform: "Facebook", location: "Germany" },
      { label: "25-34", male: 27, female: 31, platform: "Facebook", location: "Germany" },
      { label: "35-44", male: 34, female: 37, platform: "Facebook", location: "Germany" },
      { label: "45-54", male: 31, female: 34, platform: "Facebook", location: "Germany" },
      { label: "55-64", male: 27, female: 29, platform: "Facebook", location: "Germany" },
      { label: "65+", male: 21, female: 24, platform: "Facebook", location: "Germany" },
      
      // Facebook - United Kingdom
      { label: "18-24", male: 23, female: 26, platform: "Facebook", location: "United Kingdom" },
      { label: "25-34", male: 29, female: 33, platform: "Facebook", location: "United Kingdom" },
      { label: "35-44", male: 36, female: 39, platform: "Facebook", location: "United Kingdom" },
      { label: "45-54", male: 33, female: 36, platform: "Facebook", location: "United Kingdom" },
      { label: "55-64", male: 29, female: 31, platform: "Facebook", location: "United Kingdom" },
      { label: "65+", male: 23, female: 26, platform: "Facebook", location: "United Kingdom" },
    ];

    // Interest categories for all platforms
    const interests = [
      // Global Interests
      { label: "Technology", value: 95, platform: "global" },
      { label: "Entertainment", value: 85, platform: "global" },
      { label: "Fashion", value: 70, platform: "global" },
      { label: "Travel", value: 80, platform: "global" },
      { label: "Food", value: 90, platform: "global" },
      { label: "Sports", value: 65, platform: "global" },
      { label: "Music", value: 75, platform: "global" },
      { label: "Gaming", value: 68, platform: "global" },
      
      // LinkedIn Interests
      { label: "Business Strategy", value: 65, platform: "LinkedIn" },
      { label: "Professional Development", value: 50, platform: "LinkedIn" },
      { label: "Technology Trends", value: 60, platform: "LinkedIn" },
      { label: "Leadership", value: 55, platform: "LinkedIn" },
      { label: "Marketing & Sales", value: 66, platform: "LinkedIn" },
      { label: "Finance & Economics", value: 48, platform: "LinkedIn" },
      { label: "Industry News", value: 58, platform: "LinkedIn" },
      { label: "Career Growth", value: 52, platform: "LinkedIn" },
      
      // Instagram Interests
      { label: "Fashion & Style", value: 90, platform: "Instagram" },
      { label: "Beauty & Makeup", value: 70, platform: "Instagram" },
      { label: "Lifestyle", value: 85, platform: "Instagram" },
      { label: "Travel & Adventure", value: 65, platform: "Instagram" },
      { label: "Food & Dining", value: 88, platform: "Instagram" },
      { label: "Fitness & Health", value: 60, platform: "Instagram" },
      { label: "Art & Photography", value: 82, platform: "Instagram" },
      { label: "Home Decor", value: 68, platform: "Instagram" },
      
      // Facebook Interests
      { label: "Family & Parenting", value: 28, platform: "Facebook" },
      { label: "Local Community", value: 18, platform: "Facebook" },
      { label: "News & Current Events", value: 25, platform: "Facebook" },
      { label: "Entertainment & Movies", value: 22, platform: "Facebook" },
      { label: "Health & Wellness", value: 27, platform: "Facebook" },
      { label: "Hobbies & Crafts", value: 19, platform: "Facebook" },
      { label: "Food & Cooking", value: 26, platform: "Facebook" },
      { label: "Shopping & Deals", value: 20, platform: "Facebook" },
      { label: "Gaming & Apps", value: 24, platform: "Facebook" },
      { label: "Sports & Recreation", value: 21, platform: "Facebook" },
    ];

    // Comprehensive campaigns data
    const campaigns = [
      // US Campaigns
      { name: "Summer Fashion Collection 2024", platform: "Instagram", country: "US", status: "active", reach: 2800000, impressions: 12500000, clicks: 185000, conversions: 18500, budget: 125000 },
      { name: "Tech Innovation Showcase", platform: "LinkedIn", country: "US", status: "active", reach: 1200000, impressions: 4800000, clicks: 96000, conversions: 9600, budget: 85000 },
      { name: "Family Life Campaign", platform: "Facebook", country: "US", status: "active", reach: 3200000, impressions: 9600000, clicks: 128000, conversions: 12800, budget: 95000 },
      
      // Canada Campaigns
      { name: "Canadian Heritage Collection", platform: "Instagram", country: "Canada", status: "completed", reach: 980000, impressions: 3920000, clicks: 58800, conversions: 5880, budget: 42000 },
      { name: "Professional Network Growth", platform: "LinkedIn", country: "Canada", status: "active", reach: 650000, impressions: 2600000, clicks: 52000, conversions: 5200, budget: 38000 },
      { name: "Community Connect", platform: "Facebook", country: "Canada", status: "active", reach: 1400000, impressions: 4200000, clicks: 84000, conversions: 8400, budget: 58000 },
      
      // Germany Campaigns
      { name: "Precision Engineering", platform: "LinkedIn", country: "Germany", status: "active", reach: 850000, impressions: 3400000, clicks: 68000, conversions: 6800, budget: 52000 },
      { name: "Lifestyle & Culture", platform: "Instagram", country: "Germany", status: "pending", reach: 1200000, impressions: 4800000, clicks: 72000, conversions: 7200, budget: 65000 },
      { name: "Local Community Events", platform: "Facebook", country: "Germany", status: "active", reach: 1800000, impressions: 5400000, clicks: 108000, conversions: 10800, budget: 72000 },
      
      // UK Campaigns
      { name: "British Excellence", platform: "LinkedIn", country: "United Kingdom", status: "completed", reach: 720000, impressions: 2880000, clicks: 57600, conversions: 5760, budget: 48000 },
      { name: "Fashion Week London", platform: "Instagram", country: "United Kingdom", status: "active", reach: 1600000, impressions: 6400000, clicks: 96000, conversions: 9600, budget: 78000 },
      { name: "UK Community Network", platform: "Facebook", country: "United Kingdom", status: "active", reach: 2100000, impressions: 6300000, clicks: 126000, conversions: 12600, budget: 85000 },
    ];

    // Seed all data to cloud database
    console.log('📝 Seeding countries...');
    for (const country of countries) {
      const coordinatesStr = JSON.stringify(country.coordinates);
      await client.execute(
        'INSERT OR REPLACE INTO countries (id, name, coordinates, value) VALUES (?, ?, ?, ?)',
        [country.id, country.name, coordinatesStr, country.value || 0]
      );
    }
    console.log(`✅ Seeded ${countries.length} countries`);

    console.log('📝 Seeding campaign stats...');
    for (const stat of campaignStats) {
      await client.execute(
        'INSERT INTO campaign_stats (title, value, raw_value, icon, description, platform) VALUES (?, ?, ?, ?, ?, ?)',
        [stat.title, stat.value, stat.raw_value || 0, stat.icon || 'TrendingUp', stat.description, stat.platform || 'global']
      );
    }
    console.log(`✅ Seeded ${campaignStats.length} campaign stats`);

    console.log('📝 Seeding leads...');
    for (const lead of leads) {
      await client.execute(
        `INSERT INTO leads 
         (name, projects, followers, followers_count, platform, email, phone, location, category, engagement_rate, verified) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          lead.name, 
          lead.projects || 0, 
          lead.followers, 
          lead.followers_count || 0, 
          lead.platform || 'general',
          lead.email || null,
          lead.phone || null,
          lead.location || null,
          lead.category || null,
          lead.engagement_rate || 0.0,
          lead.verified || false
        ]
      );
    }
    console.log(`✅ Seeded ${leads.length} leads`);

    console.log('📝 Seeding demographics...');
    for (const demo of demographics) {
      await client.execute(
        'INSERT INTO demographics (label, male, female, platform, location) VALUES (?, ?, ?, ?, ?)',
        [demo.label, demo.male || 0, demo.female || 0, demo.platform || 'global', demo.location || 'global']
      );
    }
    console.log(`✅ Seeded ${demographics.length} demographics`);

    console.log('📝 Seeding interests...');
    for (const interest of interests) {
        await client.execute(
          'INSERT INTO user_interests (platform, interest_category, interest_name, percentage, total_users) VALUES (?, ?, ?, ?, ?)',
          [interest.platform, interest.label, interest.label, interest.value || 0, Math.floor(interest.value * 1000)]
        );
    }
    console.log(`✅ Seeded ${interests.length} interests`);

    console.log('📝 Seeding campaigns...');
    for (const campaign of campaigns) {
      await client.execute(
        `INSERT INTO campaigns 
         (name, platform, country, status, start_date, end_date, budget, reach, impressions, clicks, conversions) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          campaign.name,
          campaign.platform,
          campaign.country || null,
          campaign.status || 'active',
          campaign.start_date || null,
          campaign.end_date || null,
          campaign.budget || null,
          campaign.reach || 0,
          campaign.impressions || 0,
          campaign.clicks || 0,
          campaign.conversions || 0
        ]
      );
    }
    console.log(`✅ Seeded ${campaigns.length} campaigns`);

    // Verify data counts
    console.log('\n📊 Verifying data in cloud database...');
    const tablesToCount = ['countries', 'campaign_stats', 'leads', 'demographics', 'user_interests', 'campaigns'];
    const counts = {};
    
    for (const table of tablesToCount) {
      const result = await client.execute(`SELECT COUNT(*) as count FROM ${table}`);
      counts[table] = result.rows[0].count;
    }
    
    console.log('📊 Cloud database table counts:', counts);
    console.log('\n🎉 Cloud database seeding completed successfully!');
    console.log('');
    console.log('✨ Available platforms: LinkedIn, Instagram, Facebook');
    console.log('✨ Available countries: US, Canada, Germany, United Kingdom');
    console.log('✨ Demographics available for all platform/country combinations');
    console.log('✨ Facebook data now fully populated with influencers and campaigns in CLOUD DATABASE');
  } catch (error) {
    console.error('❌ Error seeding cloud database:', error);
    throw error;
  }
}

if (require.main === module) {
  seedCloudDatabase()
    .then(() => {
      console.log('Cloud seed script finished.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Cloud seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedCloudDatabase };
