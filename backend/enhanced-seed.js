const db = require('./database');

async function enhancedSeed() {
  try {
    console.log('🌱 Starting enhanced database seeding...');

    await db.initializeDatabase();
    console.log('Clearing existing data...');
    await db.clearAllData();

    // Countries data for map visualization
    const countries = [
      { id: "CAN", name: "Canada", coordinates: [-106.3468, 56.1304], value: 150000 },
      { id: "DEU", name: "Germany", coordinates: [10.4515, 51.1657], value: 210000 },
      { id: "USA", name: "United States", coordinates: [-95.7129, 37.0902], value: 650000 },
      { id: "GBR", name: "United Kingdom", coordinates: [-3.4360, 55.3781], value: 280000 },
      { id: "FRA", name: "France", coordinates: [2.3522, 48.8566], value: 195000 },
      { id: "JPN", name: "Japan", coordinates: [138.2529, 36.2048], value: 140000 },
      { id: "AUS", name: "Australia", coordinates: [133.7751, -25.2744], value: 95000 },
      { id: "BRA", name: "Brazil", coordinates: [-51.9253, -14.2350], value: 380000 },
      { id: "IND", name: "India", coordinates: [20.5937, 78.9629], value: 420000 },
      { id: "MEX", name: "Mexico", coordinates: [-102.5528, 23.6345], value: 160000 },
    ];

    // Campaign statistics for different platforms
    const campaignStats = [
      // Global Stats
      { title: "Total Reach", value: "12.8M", raw_value: 12800000, icon: "TrendingUp", description: "+14% from last month", platform: "global" },
      { title: "Total Engagement", value: "1.2M", raw_value: 1200000, icon: "Users", description: "+8.7% from last week", platform: "global" },
      { title: "Total Impressions", value: "28.4M", raw_value: 28400000, icon: "Eye", description: "+12.3% from last month", platform: "global" },
      { title: "Conversions", value: "42.1K", raw_value: 42100, icon: "Target", description: "+18.9% from last month", platform: "global" },
      
      // TikTok Stats
      { title: "Video Views", value: "15.6M", raw_value: 15600000, icon: "Eye", description: "+22.1% from last month", platform: "TikTok" },
      { title: "Profile Visits", value: "3.1M", raw_value: 3100000, icon: "Users", description: "+15.8% from last month", platform: "TikTok" },
      { title: "Shares", value: "892K", raw_value: 892000, icon: "Target", description: "+28.4% from last month", platform: "TikTok" },
      { title: "Comments", value: "456K", raw_value: 456000, icon: "TrendingUp", description: "+19.7% from last month", platform: "TikTok" },
      
      // Instagram Stats
      { title: "Post Reach", value: "8.9M", raw_value: 8900000, icon: "TrendingUp", description: "+11.2% from last month", platform: "Instagram" },
      { title: "Story Views", value: "4.2M", raw_value: 4200000, icon: "Eye", description: "+9.8% from last month", platform: "Instagram" },
      { title: "Profile Visits", value: "2.1M", raw_value: 2100000, icon: "Users", description: "+13.5% from last month", platform: "Instagram" },
      { title: "Saves", value: "318K", raw_value: 318000, icon: "Target", description: "+16.3% from last month", platform: "Instagram" },
      
      // Facebook Stats
      { title: "Page Reach", value: "6.2M", raw_value: 6200000, icon: "TrendingUp", description: "+7.4% from last month", platform: "Facebook" },
      { title: "Post Engagement", value: "890K", raw_value: 890000, icon: "Users", description: "+5.9% from last month", platform: "Facebook" },
      { title: "Page Views", value: "1.8M", raw_value: 1800000, icon: "Eye", description: "+6.2% from last month", platform: "Facebook" },
      { title: "Click-throughs", value: "145K", raw_value: 145000, icon: "Target", description: "+12.1% from last month", platform: "Facebook" },
    ];

    // Comprehensive leads data
    const leads = [
      // TikTok Influencers
      { name: "Sophia Chen", projects: 24, followers: "8.9M", followers_count: 8900000, platform: "TikTok", category: "Comedy", email: "sophia@email.com", verified: true, engagement_rate: 7.8 },
      { name: "Marcus Rodriguez", projects: 18, followers: "5.2M", followers_count: 5200000, platform: "TikTok", category: "Dance", email: "marcus@email.com", verified: true, engagement_rate: 8.9 },
      { name: "Zoe Kim", projects: 31, followers: "12.1M", followers_count: 12100000, platform: "TikTok", category: "DIY", email: "zoe@email.com", verified: true, engagement_rate: 6.4 },
      { name: "Alex Rivera", projects: 15, followers: "3.8M", followers_count: 3800000, platform: "TikTok", category: "Tech", email: "alex@email.com", verified: false, engagement_rate: 9.2 },
      { name: "Maya Patel", projects: 22, followers: "7.3M", followers_count: 7300000, platform: "TikTok", category: "Education", email: "maya@email.com", verified: true, engagement_rate: 5.7 },
      
      // Instagram Influencers
      { name: "Emma Watson", projects: 16, followers: "4.1M", followers_count: 4100000, platform: "Instagram", category: "Fashion", email: "emma@email.com", verified: true, engagement_rate: 6.8 },
      { name: "Jake Thompson", projects: 28, followers: "2.9M", followers_count: 2900000, platform: "Instagram", category: "Fitness", email: "jake@email.com", verified: true, engagement_rate: 7.5 },
      { name: "Lily Anderson", projects: 19, followers: "6.4M", followers_count: 6400000, platform: "Instagram", category: "Beauty", email: "lily@email.com", verified: true, engagement_rate: 8.1 },
      { name: "Noah Wilson", projects: 12, followers: "1.8M", followers_count: 1800000, platform: "Instagram", category: "Travel", email: "noah@email.com", verified: false, engagement_rate: 6.2 },
      { name: "Aria Johnson", projects: 25, followers: "3.7M", followers_count: 3700000, platform: "Instagram", category: "Food", email: "aria@email.com", verified: true, engagement_rate: 7.9 },
      
      // Facebook Influencers
      { name: "David Lee", projects: 14, followers: "980K", followers_count: 980000, platform: "Facebook", category: "Business", email: "david@email.com", verified: true, engagement_rate: 4.2 },
      { name: "Sarah Miller", projects: 21, followers: "1.5M", followers_count: 1500000, platform: "Facebook", category: "Parenting", email: "sarah@email.com", verified: true, engagement_rate: 5.1 },
      { name: "James Brown", projects: 8, followers: "720K", followers_count: 720000, platform: "Facebook", category: "Local News", email: "james@email.com", verified: false, engagement_rate: 3.8 },
      { name: "Luna Garcia", projects: 17, followers: "1.2M", followers_count: 1200000, platform: "Facebook", category: "Community", email: "luna@email.com", verified: true, engagement_rate: 4.7 },
    ];

    // Demographics data for age/gender charts
    const demographics = [
      // Global Demographics
      { label: "13-17", male: 20, female: 25, platform: "global" },
      { label: "18-24", male: 32, female: 38, platform: "global" },
      { label: "25-34", male: 28, female: 25, platform: "global" },
      { label: "35-44", male: 15, female: 12, platform: "global" },
      { label: "45-54", male: 8, female: 6, platform: "global" },
      { label: "55+", male: 4, female: 3, platform: "global" },
      
      // TikTok Demographics
      { label: "13-17", male: 35, female: 42, platform: "TikTok" },
      { label: "18-24", male: 28, female: 33, platform: "TikTok" },
      { label: "25-34", male: 20, female: 18, platform: "TikTok" },
      { label: "35-44", male: 12, female: 8, platform: "TikTok" },
      { label: "45-54", male: 4, female: 3, platform: "TikTok" },
      { label: "55+", male: 2, female: 1, platform: "TikTok" },
      
      // Instagram Demographics
      { label: "18-24", male: 25, female: 35, platform: "Instagram" },
      { label: "25-34", male: 30, female: 28, platform: "Instagram" },
      { label: "35-44", male: 20, female: 18, platform: "Instagram" },
      { label: "45-54", male: 15, female: 12, platform: "Instagram" },
      { label: "55+", male: 8, female: 6, platform: "Instagram" },
      
      // Facebook Demographics
      { label: "25-34", male: 22, female: 25, platform: "Facebook" },
      { label: "35-44", male: 28, female: 30, platform: "Facebook" },
      { label: "45-54", male: 25, female: 22, platform: "Facebook" },
      { label: "55+", male: 18, female: 20, platform: "Facebook" },
      { label: "18-24", male: 12, female: 15, platform: "Facebook" },
    ];

    // Interest categories for radar charts
    const interests = [
      // Global Interests
      { label: "Entertainment", value: 92, platform: "global" },
      { label: "Technology", value: 88, platform: "global" },
      { label: "Fashion", value: 85, platform: "global" },
      { label: "Travel", value: 78, platform: "global" },
      { label: "Food", value: 75, platform: "global" },
      { label: "Sports", value: 68, platform: "global" },
      { label: "Music", value: 82, platform: "global" },
      { label: "Gaming", value: 65, platform: "global" },
      
      // TikTok Interests
      { label: "Dance", value: 95, platform: "TikTok" },
      { label: "Comedy", value: 90, platform: "TikTok" },
      { label: "DIY", value: 82, platform: "TikTok" },
      { label: "Music", value: 88, platform: "TikTok" },
      { label: "Challenges", value: 75, platform: "TikTok" },
      { label: "Education", value: 68, platform: "TikTok" },
      
      // Instagram Interests
      { label: "Fashion", value: 95, platform: "Instagram" },
      { label: "Beauty", value: 88, platform: "Instagram" },
      { label: "Lifestyle", value: 85, platform: "Instagram" },
      { label: "Travel", value: 82, platform: "Instagram" },
      { label: "Food", value: 78, platform: "Instagram" },
      { label: "Fitness", value: 72, platform: "Instagram" },
      
      // Facebook Interests
      { label: "News", value: 85, platform: "Facebook" },
      { label: "Family", value: 82, platform: "Facebook" },
      { label: "Community", value: 75, platform: "Facebook" },
      { label: "Local Events", value: 68, platform: "Facebook" },
      { label: "Business", value: 65, platform: "Facebook" },
      { label: "Politics", value: 58, platform: "Facebook" },
    ];

    // Campaigns for country-specific data
    const campaigns = [
      // USA Campaigns
      { name: "Summer Fashion Campaign", platform: "Instagram", country: "USA", status: "active", reach: 2400000, impressions: 8500000, clicks: 125000, conversions: 12500, budget: 85000 },
      { name: "Tech Product Launch", platform: "TikTok", country: "USA", status: "active", reach: 3200000, impressions: 12000000, clicks: 89000, conversions: 8900, budget: 120000 },
      { name: "Local Business Boost", platform: "Facebook", country: "USA", status: "completed", reach: 850000, impressions: 2100000, clicks: 45000, conversions: 4500, budget: 35000 },
      
      // Germany Campaigns
      { name: "Automotive Excellence", platform: "Instagram", country: "Germany", status: "active", reach: 1800000, impressions: 6200000, clicks: 92000, conversions: 9200, budget: 75000 },
      { name: "Oktoberfest Celebration", platform: "Facebook", country: "Germany", status: "pending", reach: 950000, impressions: 3100000, clicks: 68000, conversions: 6800, budget: 45000 },
      
      // Canada Campaigns
      { name: "Winter Sports Gear", platform: "TikTok", country: "Canada", status: "active", reach: 1200000, impressions: 4800000, clicks: 72000, conversions: 7200, budget: 55000 },
      { name: "Maple Syrup Heritage", platform: "Instagram", country: "Canada", status: "completed", reach: 680000, impressions: 2400000, clicks: 38000, conversions: 3800, budget: 28000 },
      
      // UK Campaigns
      { name: "Royal Fashion Week", platform: "Instagram", country: "United Kingdom", status: "active", reach: 1500000, impressions: 5200000, clicks: 85000, conversions: 8500, budget: 68000 },
      { name: "Brexit Business Support", platform: "Facebook", country: "United Kingdom", status: "active", reach: 720000, impressions: 1800000, clicks: 42000, conversions: 4200, budget: 32000 },
      
      // France Campaigns
      { name: "Paris Fashion Week", platform: "Instagram", country: "France", status: "completed", reach: 2100000, impressions: 7800000, clicks: 118000, conversions: 11800, budget: 95000 },
      
      // Brazil Campaigns
      { name: "Carnival Celebration", platform: "TikTok", country: "Brazil", status: "active", reach: 2800000, impressions: 11200000, clicks: 156000, conversions: 15600, budget: 88000 },
      
      // Japan Campaigns
      { name: "Anime Culture Promotion", platform: "TikTok", country: "Japan", status: "pending", reach: 1400000, impressions: 5600000, clicks: 84000, conversions: 8400, budget: 62000 },
    ];

    // Seed all data
    for (const country of countries) {
      await db.addCountry(country);
    }
    console.log(`✅ Seeded ${countries.length} countries`);

    for (const stat of campaignStats) {
      await db.addCampaignStat(stat);
    }
    console.log(`✅ Seeded ${campaignStats.length} campaign stats`);

    for (const lead of leads) {
      await db.addLead(lead);
    }
    console.log(`✅ Seeded ${leads.length} leads`);

    for (const demo of demographics) {
      await db.addDemographic(demo);
    }
    console.log(`✅ Seeded ${demographics.length} demographics`);

    for (const interest of interests) {
      await db.addInterest(interest);
    }
    console.log(`✅ Seeded ${interests.length} interests`);

    for (const campaign of campaigns) {
      await db.addCampaign(campaign);
    }
    console.log(`✅ Seeded ${campaigns.length} campaigns`);

    const counts = await db.getTableCounts();
    console.log('📊 Database table counts:', counts);
    console.log('🎉 Enhanced database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

if (require.main === module) {
  enhancedSeed()
    .then(() => {
      console.log('Enhanced seed script finished.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Enhanced seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { enhancedSeed };
