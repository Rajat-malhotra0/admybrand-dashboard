import { createClient } from '@libsql/client';

function getTursoClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error('TURSO_DATABASE_URL environment variable is not set');
  }

  return createClient({
    url,
    authToken,
  });
}

export const handler = async (event) => {
  try {
    console.log('Environment check:', {
      hasUrl: !!process.env.TURSO_DATABASE_URL,
      hasToken: !!process.env.TURSO_AUTH_TOKEN,
      event: event.queryStringParameters
    });
    
    const client = getTursoClient();
    const { platform, country } = event.queryStringParameters || {};

    let campaignStatsQuery = `
      SELECT 
        SUM(reach) as total_reach,
        SUM(impressions) as total_impressions,
        SUM(clicks) as total_clicks,
        SUM(conversions) as total_conversions,
        AVG(cost_per_click) as avg_cpc,
        AVG(cost_per_conversion) as avg_cpc_conversion,
        COUNT(*) as total_campaigns
      FROM campaigns 
      WHERE status = 'active'`;

    const campaignParams = [];
    if (platform && platform !== 'global') {
      campaignStatsQuery += ' AND platform = ?';
      campaignParams.push(platform);
    }
    if (country && country !== 'global') {
      campaignStatsQuery += ' AND country = ?';
      campaignParams.push(country);
    }
    
    const campaignResult = await client.execute(campaignStatsQuery, campaignParams);
    const stats = campaignResult.rows[0];
    
    const formatNumber = (num) => {
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
      if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
      return num.toLocaleString();
    };
    
    const campaignStats = stats ? [
      {
        id: 1,
        title: "Total Reach",
        value: formatNumber(Number(stats.total_reach) || 0),
        icon: "TrendingUp",
        description: `${stats.total_campaigns} active campaigns`
      },
      {
        id: 2,
        title: "Engagement",
        value: formatNumber(Number(stats.total_clicks) || 0),
        icon: "Users", 
        description: `Avg CPC: $${Number(stats.avg_cpc || 0).toFixed(2)}`
      },
      {
        id: 3,
        title: "Impressions",
        value: formatNumber(Number(stats.total_impressions) || 0),
        icon: "Eye",
        description: `Total views across campaigns`
      },
      {
        id: 4,
        title: "Conversions", 
        value: formatNumber(Number(stats.total_conversions) || 0),
        icon: "Target",
        description: `Avg cost: $${Number(stats.avg_cpc_conversion || 0).toFixed(2)}`
      }
    ] : [];
    
    let influencerQuery = 'SELECT * FROM influencers';
    const influencerParams = [];
    if (platform && platform !== 'global') {
      influencerQuery += ' WHERE platform = ?';
      influencerParams.push(platform);
    }
    influencerQuery += ' ORDER BY CAST(REPLACE(REPLACE(REPLACE(followers, "M", "000000"), "K", "000"), ",", "") AS INTEGER) DESC LIMIT 50';
    
    const influencerResult = await client.execute(influencerQuery, influencerParams);
    const leadData = influencerResult.rows.map((inf) => ({
      id: inf.id,
      name: inf.name,
      projects: inf.projects,
      followers: inf.followers,
      platform: inf.platform
    }));
    
    let demographicsQuery = 'SELECT * FROM demographics';
    const demographicsParams = [];
    if (platform && platform !== 'global') {
      demographicsQuery += ' WHERE platform = ?';
      demographicsParams.push(platform);
    }
    demographicsQuery += ' ORDER BY created_at DESC';
    
    const demographicsResult = await client.execute(demographicsQuery, demographicsParams);
    
    const demographicsMap = new Map();
    demographicsResult.rows.forEach((demo) => {
      const ageGroup = demo.age_group;
      const gender = demo.gender.toLowerCase();
      const percentage = demo.percentage;
      
      if (!demographicsMap.has(ageGroup)) {
        demographicsMap.set(ageGroup, { male: 0, female: 0 });
      }
      
      const entry = demographicsMap.get(ageGroup);
      if (gender === 'male') entry.male = percentage;
      else if (gender === 'female') entry.female = percentage;
    });
    
    const demographicsData = Array.from(demographicsMap.entries()).map(([label, data]) => ({
      label,
      ...data
    }));
    
    let interestsQuery = 'SELECT interest_name as label, percentage as value FROM user_interests';
    const interestsParams = [];
    if (platform && platform !== 'global') {
      interestsQuery += ' WHERE platform = ?';
      interestsParams.push(platform);
    } else {
      interestsQuery = 'SELECT interest_name as label, AVG(percentage) as value FROM user_interests GROUP BY interest_name';
    }
    interestsQuery += ' ORDER BY value DESC';
    
    const interestsResult = await client.execute(interestsQuery, interestsParams);
    const interestsData = interestsResult.rows.map((row) => ({
      label: String(row.label),
      value: Number(row.value)
    }));

    const data = {
      campaignStats,
      leadData,
      demographicsData,
      interestsData
    };

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to fetch platform data',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

