const db = require('../src/database/database');

async function seed() {
  try {
    console.log('🌱 Starting comprehensive database seeding...');

    await db.initializeDatabase();
    console.log('Clearing existing data...');
    await db.client.execute('DELETE FROM campaign_stats');
    await db.client.execute('DELETE FROM influencers');
    await db.client.execute('DELETE FROM demographics');
    await db.client.execute('DELETE FROM interests');
    await db.client.execute('DELETE FROM campaigns');
    await db.client.execute('DELETE FROM countries');
    await db.client.execute('DELETE FROM platforms');

    // Create platforms
    const platforms = ['LinkedIn', 'Instagram', 'Facebook', 'TikTok'];
    const platformIds = {};
    for (const name of platforms) {
      const p = await db.createPlatform(name);
      platformIds[name] = p.id;
      console.log(`Created platform: ${name} (ID: ${p.id})`);
    }

    // Countries data
    const countries = [
      { name: 'Global', iso_code: 'global', has_data: true },
      { name: 'United States', iso_code: 'USA', has_data: true },
      { name: 'Canada', iso_code: 'CAN', has_data: true },
      { name: 'Germany', iso_code: 'DEU', has_data: true },
      { name: 'United Kingdom', iso_code: 'GBR', has_data: true },
      { name: 'France', iso_code: 'FRA', has_data: false },
      { name: 'Japan', iso_code: 'JPN', has_data: false },
      { name: 'Australia', iso_code: 'AUS', has_data: false },
      { name: 'Brazil', iso_code: 'BRA', has_data: false },
      { name: 'India', iso_code: 'IND', has_data: false },
    ];
    for (const country of countries) {
      await db.createCountry(country.name, country.iso_code, country.has_data);
    }
    console.log(`✅ Seeded ${countries.length} countries`);

    // Campaign Stats
    const campaignStats = [
      // LinkedIn Stats (Global)
      { platform: 'LinkedIn', country: 'global', title: 'Total Reach', value: '1.8M', icon: 'TrendingUp', description: '+12% from last month' },
      { platform: 'LinkedIn', country: 'global', title: 'Engagement', value: '24,856', icon: 'Users', description: '+8.3% from last week' },

      // Instagram Stats (Global)
      { platform: 'Instagram', country: 'global', title: 'Total Reach', value: '2.4M', icon: 'TrendingUp', description: '+15% from last month' },
      { platform: 'Instagram', country: 'global', title: 'Engagement', value: '48,392', icon: 'Users', description: '+12.7% from last week' },

      // Facebook Stats (Global)
      { platform: 'Facebook', country: 'global', title: 'Total Reach', value: '1.9M', icon: 'TrendingUp', description: '+7% from last month' },
      { platform: 'Facebook', country: 'global', title: 'Engagement', value: '32,186', icon: 'Users', description: '+5.4% from last week' },

      // USA-specific Stats
      { platform: 'Instagram', country: 'United States', title: 'USA Reach', value: '1.2M', icon: 'TrendingUp', description: '+18% from last month' },
      { platform: 'Facebook', country: 'United States', title: 'USA Engagement', value: '15,420', icon: 'Users', description: '+9.1% from last week' },
    ];

    for (const stat of campaignStats) {
      await db.createCampaignStat(platformIds[stat.platform], stat.country, stat.title, stat.value, stat.icon, stat.description);
    }
    console.log(`✅ Seeded ${campaignStats.length} campaign stats`);

    // Influencers
    const influencers = [
      // LinkedIn Influencers
      { platform: 'LinkedIn', country: 'global', name: 'John Doe', handle: '@johndoe', followers: 150000, engagement_rate: 5.5, tier: 'macro', collaboration_status: 'active', rating: 4.8, category: 'Technology' },
      { platform: 'LinkedIn', country: 'United States', name: 'Jane Smith', handle: '@janesmith', followers: 80000, engagement_rate: 6.2, tier: 'micro', collaboration_status: 'pending', rating: 4.5, category: 'Marketing' },

      // Instagram Influencers
      { platform: 'Instagram', country: 'global', name: 'Alex Johnson', handle: '@alexj', followers: 2500000, engagement_rate: 4.8, tier: 'mega', collaboration_status: 'completed', rating: 4.9, category: 'Fashion' },
      { platform: 'Instagram', country: 'United States', name: 'Emily White', handle: '@emilyw', followers: 500000, engagement_rate: 7.1, tier: 'macro', collaboration_status: 'active', rating: 4.7, category: 'Beauty' },

      // Facebook Influencers
      { platform: 'Facebook', country: 'global', name: 'Michael Brown', handle: '@michaelb', followers: 120000, engagement_rate: 3.9, tier: 'micro', collaboration_status: 'active', rating: 4.2, category: 'Gaming' },
      { platform: 'Facebook', country: 'Canada', name: 'Jessica Green', handle: '@jessgreen', followers: 75000, engagement_rate: 4.5, tier: 'micro', collaboration_status: 'completed', rating: 4.6, category: 'Lifestyle' },
    ];

    for (const i of influencers) {
      await db.createInfluencer({ ...i, platform_id: platformIds[i.platform] });
    }
    console.log(`✅ Seeded ${influencers.length} influencers`);

    // Demographics
    const demographics = [
      // LinkedIn Demographics (Global)
      { platform: 'LinkedIn', country: 'global', age_range: '25-34', male_percentage: 55, female_percentage: 45 },
      { platform: 'LinkedIn', country: 'global', age_range: '35-44', male_percentage: 60, female_percentage: 40 },

      // Instagram Demographics (USA)
      { platform: 'Instagram', country: 'United States', age_range: '18-24', male_percentage: 40, female_percentage: 60 },
      { platform: 'Instagram', country: 'United States', age_range: '25-34', male_percentage: 45, female_percentage: 55 },
      
      // Facebook Demographics (Canada)
      { platform: 'Facebook', country: 'Canada', age_range: '35-44', male_percentage: 50, female_percentage: 50 },
      { platform: 'Facebook', country: 'Canada', age_range: '45-54', male_percentage: 48, female_percentage: 52 },
    ];

    for (const d of demographics) {
      await db.createDemographic(platformIds[d.platform], d.country, d.age_range, d.male_percentage, d.female_percentage);
    }
    console.log(`✅ Seeded ${demographics.length} demographics`);

    // Interests
    const interests = [
      { platform: 'LinkedIn', country: 'global', interest: 'Technology', value: 85 },
      { platform: 'Instagram', country: 'United States', interest: 'Fashion', value: 92 },
      { platform: 'Facebook', country: 'Canada', interest: 'Gaming', value: 78 },
    ];

    for (const i of interests) {
      await db.createInterest(platformIds[i.platform], i.country, i.interest, i.value);
    }
    console.log(`✅ Seeded ${interests.length} interests`);

    console.log('🎉 Comprehensive database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

if (require.main === module) {
  seed().catch(e => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = { seed };
