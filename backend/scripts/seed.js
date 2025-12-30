const db = require('../src/database/database');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Initialize database
    await db.initializeDatabase();

    // Add some sample countries with data
    const countriesWithData = [
      { id: 'US', name: 'United States', coordinates: '{"lat": 37.0902, "lng": -95.7129}', value: 100 },
      { id: 'CA', name: 'Canada', coordinates: '{"lat": 56.1304, "lng": -106.3468}', value: 80 },
      { id: 'DE', name: 'Germany', coordinates: '{"lat": 51.1657, "lng": 10.4515}', value: 75 },
      { id: 'GB', name: 'United Kingdom', coordinates: '{"lat": 55.3781, "lng": -3.4360}', value: 70 },
      { id: 'FR', name: 'France', coordinates: '{"lat": 46.2276, "lng": 2.2137}', value: 65 }
    ];

    for (const country of countriesWithData) {
      try {
        await db.addCountry(country);
        console.log(`✅ Country ${country.name} added`);
      } catch (error) {
        console.error(`Error adding country ${country.name}:`, error);
      }
    }

    // Add some sample campaign stats
    const campaignStats = [
      { title: "Total Reach", value: "1.8M", raw_value: 1800000, icon: "TrendingUp", description: "+12% from last month", platform: "global" },
      { title: "Engagement", value: "24,856", raw_value: 24856, icon: "Users", description: "+8.3% from last week", platform: "global" },
      { title: "Impressions", value: "950K", raw_value: 950000, icon: "Eye", description: "+15.2% from last month", platform: "global" },
      { title: "Conversions", value: "672", raw_value: 672, icon: "Target", description: "+18% from last month", platform: "global" }
    ];

    for (const stat of campaignStats) {
      try {
        await db.addCampaignStat(stat);
        console.log(`✅ Campaign stat ${stat.title} added`);
      } catch (error) {
        console.error(`Error adding campaign stat ${stat.title}:`, error);
      }
    }

    // Add some sample leads
    const leads = [
      { name: "Sarah Chen", projects: 12, followers: "125K", followers_count: 125000, platform: "LinkedIn", email: "sarah@example.com", phone: "+1-555-0101", location: "San Francisco", category: "Business Strategy", engagement_rate: 4.2, verified: true },
      { name: "Michael Torres", projects: 8, followers: "89K", followers_count: 89000, platform: "LinkedIn", email: "michael@example.com", phone: "+1-555-0102", location: "New York", category: "Technology", engagement_rate: 3.8, verified: true },
      { name: "Zoe Martinez", projects: 15, followers: "340K", followers_count: 340000, platform: "Instagram", email: "zoe@example.com", phone: "+1-555-0103", location: "Los Angeles", category: "Fashion", engagement_rate: 6.8, verified: true },
      { name: "Alex Rivera", projects: 10, followers: "156K", followers_count: 156000, platform: "Instagram", email: "alex@example.com", phone: "+1-555-0104", location: "Miami", category: "Fitness", engagement_rate: 7.2, verified: false }
    ];

    for (const lead of leads) {
      try {
        await db.addLead(lead);
        console.log(`✅ Lead ${lead.name} added`);
      } catch (error) {
        console.error(`Error adding lead ${lead.name}:`, error);
      }
    }

    // Add some sample demographics
    const demographics = [
      { label: "18-24", male: 32, female: 45, platform: "global" },
      { label: "25-34", male: 28, female: 38, platform: "global" },
      { label: "35-44", male: 18, female: 22, platform: "global" },
      { label: "45-54", male: 12, female: 15, platform: "global" },
      { label: "55+", male: 8, female: 10, platform: "global" }
    ];

    for (const demo of demographics) {
      try {
        await db.addDemographic(demo);
        console.log(`✅ Demographic ${demo.label} added`);
      } catch (error) {
        console.error(`Error adding demographic ${demo.label}:`, error);
      }
    }

    // Add some sample interests
    const interests = [
      { label: "Business", value: 80, platform: "global" },
      { label: "Technology", value: 75, platform: "global" },
      { label: "Professional Development", value: 70, platform: "global" },
      { label: "Leadership", value: 65, platform: "global" },
      { label: "Marketing", value: 60, platform: "global" }
    ];

    for (const interest of interests) {
      try {
        await db.addInterest(interest);
        console.log(`✅ Interest ${interest.label} added`);
      } catch (error) {
        console.error(`Error adding interest ${interest.label}:`, error);
      }
    }

    // Add some sample campaigns
    const campaigns = [
      { name: "Q3 Brand Awareness", platform: "LinkedIn", country: "US", status: "active", start_date: "2025-07-01", end_date: "2025-09-30", budget: 50000, reach: 1800000, impressions: 950000, clicks: 45000, conversions: 672 },
      { name: "Product Launch", platform: "Instagram", country: "US", status: "active", start_date: "2025-07-15", end_date: "2025-08-15", budget: 25000, reach: 850000, impressions: 1600000, clicks: 89000, conversions: 1234 }
    ];

    for (const campaign of campaigns) {
      try {
        await db.addCampaign(campaign);
        console.log(`✅ Campaign ${campaign.name} added`);
      } catch (error) {
        console.error(`Error adding campaign ${campaign.name}:`, error);
      }
    }

    // Add platform-specific campaign stats
    const platformCampaignStats = [
      { title: "Total Reach", value: "720K", raw_value: 720000, icon: "TrendingUp", description: "+14% from last month", platform: "LinkedIn" },
      { title: "Engagement", value: "9,842", raw_value: 9842, icon: "Users", description: "+10.1% from last week", platform: "LinkedIn" },
      { title: "Impressions", value: "380K", raw_value: 380000, icon: "Eye", description: "+17.2% from last month", platform: "LinkedIn" },
      { title: "Conversions", value: "268", raw_value: 268, icon: "Target", description: "+20% from last month", platform: "LinkedIn" },
      { title: "Total Reach", value: "960K", raw_value: 960000, icon: "TrendingUp", description: "+16% from last month", platform: "Instagram" },
      { title: "Engagement", value: "19,357", raw_value: 19357, icon: "Users", description: "+14.2% from last week", platform: "Instagram" },
      { title: "Impressions", value: "640K", raw_value: 640000, icon: "Eye", description: "+11.3% from last month", platform: "Instagram" },
      { title: "Conversions", value: "494", raw_value: 494, icon: "Target", description: "+24% from last month", platform: "Instagram" },
      { title: "Total Reach", value: "760K", raw_value: 760000, icon: "TrendingUp", description: "+8% from last month", platform: "Facebook" },
      { title: "Engagement", value: "12,874", raw_value: 12874, icon: "Users", description: "+6.2% from last week", platform: "Facebook" },
      { title: "Impressions", value: "480K", raw_value: 480000, icon: "Eye", description: "+7.1% from last month", platform: "Facebook" },
      { title: "Conversions", value: "357", raw_value: 357, icon: "Target", description: "+16% from last month", platform: "Facebook" }
    ];

    for (const stat of platformCampaignStats) {
      try {
        await db.addCampaignStat(stat);
        console.log(`✅ Platform campaign stat ${stat.title} for ${stat.platform} added`);
      } catch (error) {
        console.error(`Error adding platform campaign stat ${stat.title} for ${stat.platform}:`, error);
      }
    }

    // Add platform-specific demographics
    const platformDemographics = [
      { label: "18-24", male: 35, female: 48, platform: "Instagram" },
      { label: "25-34", male: 30, female: 40, platform: "Instagram" },
      { label: "35-44", male: 20, female: 25, platform: "Instagram" },
      { label: "45-54", male: 14, female: 18, platform: "Instagram" },
      { label: "55+", male: 10, female: 12, platform: "Instagram" },
      { label: "25-34", male: 45, female: 40, platform: "LinkedIn" },
      { label: "35-44", male: 38, female: 35, platform: "LinkedIn" },
      { label: "45-54", male: 30, female: 28, platform: "LinkedIn" },
      { label: "55+", male: 22, female: 20, platform: "LinkedIn" },
      { label: "18-24", male: 18, female: 15, platform: "LinkedIn" }
    ];

    for (const demo of platformDemographics) {
      try {
        await db.addDemographic(demo);
        console.log(`✅ Platform demographic ${demo.label} for ${demo.platform} added`);
      } catch (error) {
        console.error(`Error adding platform demographic ${demo.label} for ${demo.platform}:`, error);
      }
    }

    // Add platform-specific interests
    const platformInterests = [
      { label: "Fashion", value: 88, platform: "Instagram" },
      { label: "Beauty", value: 83, platform: "Instagram" },
      { label: "Lifestyle", value: 78, platform: "Instagram" },
      { label: "Travel", value: 73, platform: "Instagram" },
      { label: "Food", value: 68, platform: "Instagram" },
      { label: "Fitness", value: 64, platform: "Instagram" },
      { label: "Business", value: 82, platform: "LinkedIn" },
      { label: "Technology", value: 78, platform: "LinkedIn" },
      { label: "Professional Development", value: 74, platform: "LinkedIn" },
      { label: "Leadership", value: 70, platform: "LinkedIn" },
      { label: "Marketing", value: 65, platform: "LinkedIn" },
      { label: "Finance", value: 61, platform: "LinkedIn" }
    ];

    for (const interest of platformInterests) {
      try {
        await db.addInterest(interest);
        console.log(`✅ Platform interest ${interest.label} for ${interest.platform} added`);
      } catch (error) {
        console.error(`Error adding platform interest ${interest.label} for ${interest.platform}:`, error);
      }
    }

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
