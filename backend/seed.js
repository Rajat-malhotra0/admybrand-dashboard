const db = require('./db');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Initialize database
    await db.initializeDatabase();

    // Create platforms
    const platforms = ['LinkedIn', 'Instagram', 'Facebook'];
    const platformIds = {};

    for (const platformName of platforms) {
      try {
        let platform = await db.getPlatformByName(platformName);
        if (!platform) {
          platform = await db.createPlatform(platformName);
        }
        platformIds[platformName] = platform.id;
        console.log(`✅ Platform ${platformName} created/exists with ID: ${platform.id}`);
      } catch (error) {
        console.error(`Error creating platform ${platformName}:`, error);
      }
    }

    // Create countries
    const countries = [
      { name: 'US', isoCode: 'USA', hasData: true },
      { name: 'Canada', isoCode: 'CAN', hasData: true },
      { name: 'Germany', isoCode: 'DEU', hasData: true },
      { name: 'United Kingdom', isoCode: 'GBR', hasData: true },
      { name: 'France', isoCode: 'FRA', hasData: true },
      { name: 'Japan', isoCode: 'JPN', hasData: false },
      { name: 'Australia', isoCode: 'AUS', hasData: false },
      { name: 'Brazil', isoCode: 'BRA', hasData: false },
      { name: 'India', isoCode: 'IND', hasData: false },
      { name: 'China', isoCode: 'CHN', hasData: false }
    ];

    for (const country of countries) {
      try {
        await db.createCountry(country.name, country.isoCode, country.hasData);
        console.log(`✅ Country ${country.name} created`);
      } catch (error) {
        if (!error.message.includes('UNIQUE constraint failed')) {
          console.error(`Error creating country ${country.name}:`, error);
        }
      }
    }

    // Seed campaign stats
    const campaignStatsData = {
      LinkedIn: {
        global: [
          { title: "Total Reach", value: "1.8M", icon: "TrendingUp", description: "+12% from last month" },
          { title: "Engagement", value: "24,856", icon: "Users", description: "+8.3% from last week" },
          { title: "Impressions", value: "950K", icon: "Eye", description: "+15.2% from last month" },
          { title: "Conversions", value: "672", icon: "Target", description: "+18% from last month" }
        ],
        US: [
          { title: "Total Reach", value: "720K", icon: "TrendingUp", description: "+14% from last month" },
          { title: "Engagement", value: "9,842", icon: "Users", description: "+10.1% from last week" },
          { title: "Impressions", value: "380K", icon: "Eye", description: "+17.2% from last month" },
          { title: "Conversions", value: "268", icon: "Target", description: "+20% from last month" }
        ],
        Canada: [
          { title: "Total Reach", value: "180K", icon: "TrendingUp", description: "+9% from last month" },
          { title: "Engagement", value: "2,456", icon: "Users", description: "+6.8% from last week" },
          { title: "Impressions", value: "95K", icon: "Eye", description: "+12.5% from last month" },
          { title: "Conversions", value: "67", icon: "Target", description: "+15% from last month" }
        ]
      },
      Instagram: {
        global: [
          { title: "Total Reach", value: "2.4M", icon: "TrendingUp", description: "+15% from last month" },
          { title: "Engagement", value: "48,392", icon: "Users", description: "+12.7% from last week" },
          { title: "Impressions", value: "1.6M", icon: "Eye", description: "+9.8% from last month" },
          { title: "Conversions", value: "1,234", icon: "Target", description: "+22% from last month" }
        ],
        US: [
          { title: "Total Reach", value: "960K", icon: "TrendingUp", description: "+16% from last month" },
          { title: "Engagement", value: "19,357", icon: "Users", description: "+14.2% from last week" },
          { title: "Impressions", value: "640K", icon: "Eye", description: "+11.3% from last month" },
          { title: "Conversions", value: "494", icon: "Target", description: "+24% from last month" }
        ],
        Germany: [
          { title: "Total Reach", value: "360K", icon: "TrendingUp", description: "+13% from last month" },
          { title: "Engagement", value: "7,259", icon: "Users", description: "+9.8% from last week" },
          { title: "Impressions", value: "240K", icon: "Eye", description: "+8.1% from last month" },
          { title: "Conversions", value: "185", icon: "Target", description: "+19% from last month" }
        ]
      },
      Facebook: {
        global: [
          { title: "Total Reach", value: "1.9M", icon: "TrendingUp", description: "+7% from last month" },
          { title: "Engagement", value: "32,186", icon: "Users", description: "+5.4% from last week" },
          { title: "Impressions", value: "1.2M", icon: "Eye", description: "+6.1% from last month" },
          { title: "Conversions", value: "892", icon: "Target", description: "+14% from last month" }
        ],
        US: [
          { title: "Total Reach", value: "760K", icon: "TrendingUp", description: "+8% from last month" },
          { title: "Engagement", value: "12,874", icon: "Users", description: "+6.2% from last week" },
          { title: "Impressions", value: "480K", icon: "Eye", description: "+7.1% from last month" },
          { title: "Conversions", value: "357", icon: "Target", description: "+16% from last month" }
        ],
        "United Kingdom": [
          { title: "Total Reach", value: "285K", icon: "TrendingUp", description: "+5% from last month" },
          { title: "Engagement", value: "4,827", icon: "Users", description: "+4.1% from last week" },
          { title: "Impressions", value: "180K", icon: "Eye", description: "+4.8% from last month" },
          { title: "Conversions", value: "134", icon: "Target", description: "+12% from last month" }
        ]
      }
    };

    for (const [platformName, platformData] of Object.entries(campaignStatsData)) {
      const platformId = platformIds[platformName];
      if (!platformId) continue;

      for (const [country, stats] of Object.entries(platformData)) {
        for (const stat of stats) {
          try {
            await db.createCampaignStat(platformId, country, stat.title, stat.value, stat.icon, stat.description);
          } catch (error) {
            console.error(`Error creating campaign stat for ${platformName} in ${country}:`, error);
          }
        }
      }
      console.log(`✅ Campaign stats seeded for ${platformName}`);
    }

    // Seed influencers
    const influencersData = {
      LinkedIn: {
        global: [
          { 
            name: "Sarah Chen", handle: "sarahchen", avatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=random",
            followers: 125000, engagement_rate: 4.2, tier: "macro", collaboration_status: "active",
            rating: 4.8, category: "Business Strategy", cost_per_post: 2500, roi: 15.6,
            avg_likes: 850, avg_comments: 120, reach_rate: 12.5
          },
          {
            name: "Michael Torres", handle: "michaeltorres", avatar: "https://ui-avatars.com/api/?name=Michael+Torres&background=random",
            followers: 89000, engagement_rate: 3.8, tier: "macro", collaboration_status: "pending",
            rating: 4.5, category: "Technology", cost_per_post: 2000, roi: 12.3,
            avg_likes: 680, avg_comments: 95, reach_rate: 10.8
          },
          {
            name: "Emily Johnson", handle: "emilyjohnson", avatar: "https://ui-avatars.com/api/?name=Emily+Johnson&background=random",
            followers: 45000, engagement_rate: 5.1, tier: "micro", collaboration_status: "completed",
            rating: 4.9, category: "Marketing", cost_per_post: 1200, roi: 18.7,
            avg_likes: 420, avg_comments: 65, reach_rate: 8.9
          }
        ],
        US: [
          {
            name: "David Kim", handle: "davidkim", avatar: "https://ui-avatars.com/api/?name=David+Kim&background=random",
            followers: 78000, engagement_rate: 4.0, tier: "macro", collaboration_status: "active",
            rating: 4.6, category: "Finance", cost_per_post: 1800, roi: 14.2,
            avg_likes: 590, avg_comments: 85, reach_rate: 9.5
          }
        ]
      },
      Instagram: {
        global: [
          {
            name: "Zoe Martinez", handle: "zoestyle", avatar: "https://ui-avatars.com/api/?name=Zoe+Martinez&background=random",
            followers: 340000, engagement_rate: 6.8, tier: "macro", collaboration_status: "active",
            rating: 4.7, category: "Fashion", cost_per_post: 3500, roi: 22.1,
            avg_likes: 2800, avg_comments: 180, reach_rate: 18.5
          },
          {
            name: "Alex Rivera", handle: "alexfitness", avatar: "https://ui-avatars.com/api/?name=Alex+Rivera&background=random",
            followers: 156000, engagement_rate: 7.2, tier: "macro", collaboration_status: "pending",
            rating: 4.8, category: "Fitness", cost_per_post: 2800, roi: 19.4,
            avg_likes: 1890, avg_comments: 145, reach_rate: 15.2
          },
          {
            name: "Luna Parker", handle: "lunabeauty", avatar: "https://ui-avatars.com/api/?name=Luna+Parker&background=random",
            followers: 89000, engagement_rate: 8.1, tier: "micro", collaboration_status: "completed",
            rating: 4.9, category: "Beauty", cost_per_post: 1500, roi: 25.3,
            avg_likes: 1450, avg_comments: 95, reach_rate: 12.8
          }
        ],
        US: [
          {
            name: "Jake Thompson", handle: "jakethompson", avatar: "https://ui-avatars.com/api/?name=Jake+Thompson&background=random",
            followers: 210000, engagement_rate: 5.9, tier: "macro", collaboration_status: "active",
            rating: 4.5, category: "Travel", cost_per_post: 3200, roi: 16.8,
            avg_likes: 2100, avg_comments: 125, reach_rate: 16.7
          }
        ]
      },
      Facebook: {
        global: [
          {
            name: "Maria Garcia", handle: "mariagarcia", avatar: "https://ui-avatars.com/api/?name=Maria+Garcia&background=random",
            followers: 95000, engagement_rate: 3.2, tier: "micro", collaboration_status: "active",
            rating: 4.3, category: "Parenting", cost_per_post: 1100, roi: 11.5,
            avg_likes: 680, avg_comments: 45, reach_rate: 7.8
          },
          {
            name: "Robert Chen", handle: "robertchen", avatar: "https://ui-avatars.com/api/?name=Robert+Chen&background=random",
            followers: 67000, engagement_rate: 2.8, tier: "micro", collaboration_status: "pending",
            rating: 4.1, category: "Local Business", cost_per_post: 900, roi: 9.2,
            avg_likes: 480, avg_comments: 32, reach_rate: 6.5
          }
        ]
      }
    };

    for (const [platformName, platformData] of Object.entries(influencersData)) {
      const platformId = platformIds[platformName];
      if (!platformId) continue;

      for (const [country, influencers] of Object.entries(platformData)) {
        for (const influencer of influencers) {
          try {
            await db.createInfluencer({
              platform_id: platformId,
              country: country,
              ...influencer
            });
          } catch (error) {
            console.error(`Error creating influencer for ${platformName} in ${country}:`, error);
          }
        }
      }
      console.log(`✅ Influencers seeded for ${platformName}`);
    }

    // Seed demographics
    const demographicsData = {
      LinkedIn: {
        global: [
          { age_range: "25-34", male_percentage: 42, female_percentage: 38 },
          { age_range: "35-44", male_percentage: 35, female_percentage: 32 },
          { age_range: "45-54", male_percentage: 28, female_percentage: 25 },
          { age_range: "55+", male_percentage: 20, female_percentage: 18 },
          { age_range: "18-24", male_percentage: 15, female_percentage: 12 }
        ],
        US: [
          { age_range: "25-34", male_percentage: 45, female_percentage: 40 },
          { age_range: "35-44", male_percentage: 38, female_percentage: 35 },
          { age_range: "45-54", male_percentage: 30, female_percentage: 28 },
          { age_range: "55+", male_percentage: 22, female_percentage: 20 },
          { age_range: "18-24", male_percentage: 18, female_percentage: 15 }
        ]
      },
      Instagram: {
        global: [
          { age_range: "18-24", male_percentage: 32, female_percentage: 45 },
          { age_range: "25-34", male_percentage: 28, female_percentage: 38 },
          { age_range: "35-44", male_percentage: 18, female_percentage: 22 },
          { age_range: "45-54", male_percentage: 12, female_percentage: 15 },
          { age_range: "55+", male_percentage: 8, female_percentage: 10 }
        ],
        US: [
          { age_range: "18-24", male_percentage: 35, female_percentage: 48 },
          { age_range: "25-34", male_percentage: 30, female_percentage: 40 },
          { age_range: "35-44", male_percentage: 20, female_percentage: 25 },
          { age_range: "45-54", male_percentage: 14, female_percentage: 18 },
          { age_range: "55+", male_percentage: 10, female_percentage: 12 }
        ]
      },
      Facebook: {
        global: [
          { age_range: "35-44", male_percentage: 28, female_percentage: 32 },
          { age_range: "45-54", male_percentage: 25, female_percentage: 28 },
          { age_range: "25-34", male_percentage: 22, female_percentage: 25 },
          { age_range: "55+", male_percentage: 18, female_percentage: 22 },
          { age_range: "18-24", male_percentage: 12, female_percentage: 15 }
        ]
      }
    };

    for (const [platformName, platformData] of Object.entries(demographicsData)) {
      const platformId = platformIds[platformName];
      if (!platformId) continue;

      for (const [country, demographics] of Object.entries(platformData)) {
        for (const demo of demographics) {
          try {
            await db.createDemographic(platformId, country, demo.age_range, demo.male_percentage, demo.female_percentage);
          } catch (error) {
            console.error(`Error creating demographic for ${platformName} in ${country}:`, error);
          }
        }
      }
      console.log(`✅ Demographics seeded for ${platformName}`);
    }

    // Seed interests
    const interestsData = {
      LinkedIn: {
        global: [
          { interest: "Business", value: 92 },
          { interest: "Technology", value: 88 },
          { interest: "Professional Development", value: 85 },
          { interest: "Leadership", value: 78 },
          { interest: "Marketing", value: 72 },
          { interest: "Finance", value: 68 }
        ],
        US: [
          { interest: "Business", value: 95 },
          { interest: "Technology", value: 91 },
          { interest: "Professional Development", value: 88 },
          { interest: "Leadership", value: 82 },
          { interest: "Marketing", value: 76 },
          { interest: "Finance", value: 73 }
        ]
      },
      Instagram: {
        global: [
          { interest: "Fashion", value: 95 },
          { interest: "Beauty", value: 88 },
          { interest: "Lifestyle", value: 82 },
          { interest: "Travel", value: 75 },
          { interest: "Food", value: 68 },
          { interest: "Fitness", value: 62 }
        ],
        US: [
          { interest: "Fashion", value: 97 },
          { interest: "Beauty", value: 92 },
          { interest: "Lifestyle", value: 86 },
          { interest: "Travel", value: 79 },
          { interest: "Food", value: 72 },
          { interest: "Fitness", value: 68 }
        ]
      },
      Facebook: {
        global: [
          { interest: "Family", value: 85 },
          { interest: "News", value: 78 },
          { interest: "Entertainment", value: 72 },
          { interest: "Community", value: 68 },
          { interest: "Local Events", value: 58 },
          { interest: "Sports", value: 52 }
        ]
      }
    };

    for (const [platformName, platformData] of Object.entries(interestsData)) {
      const platformId = platformIds[platformName];
      if (!platformId) continue;

      for (const [country, interests] of Object.entries(platformData)) {
        for (const interest of interests) {
          try {
            await db.createInterest(platformId, country, interest.interest, interest.value);
          } catch (error) {
            console.error(`Error creating interest for ${platformName} in ${country}:`, error);
          }
        }
      }
      console.log(`✅ Interests seeded for ${platformName}`);
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
