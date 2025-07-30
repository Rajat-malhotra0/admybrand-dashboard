const { getTursoClient } = require('./lib/database/turso');

class DatabaseService {
  constructor() {
    this.client = null;
  }

  async initialize() {
    try {
      this.client = getTursoClient();
      await this.createTables();
      console.log('✅ Database initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  async createTables() {
    const tables = [
      // Countries table for geographic data
      `CREATE TABLE IF NOT EXISTS countries (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        coordinates TEXT NOT NULL,
        value INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Campaign stats for KPI metrics
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

      // Leads with extended details
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

      // Demographics for age/gender distribution
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

      // Interests/categories for radar chart
      `CREATE TABLE IF NOT EXISTS interests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        label TEXT NOT NULL,
        value INTEGER NOT NULL DEFAULT 0,
        platform TEXT DEFAULT 'global',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Campaigns for detailed tracking
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

    // Create indexes for better performance
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_campaign_stats_platform ON campaign_stats(platform)',
      'CREATE INDEX IF NOT EXISTS idx_leads_platform ON leads(platform)',
      'CREATE INDEX IF NOT EXISTS idx_demographics_platform ON demographics(platform)',
      'CREATE INDEX IF NOT EXISTS idx_interests_platform ON interests(platform)',
      'CREATE INDEX IF NOT EXISTS idx_campaigns_platform ON campaigns(platform)',
      'CREATE INDEX IF NOT EXISTS idx_campaigns_country ON campaigns(country)',
      'CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status)'
    ];

    for (const sql of tables) {
      await this.client.execute(sql);
    }

    for (const sql of indexes) {
      await this.client.execute(sql);
    }
  }

  // Countries methods
  async getCountriesWithData() {
    const result = await this.client.execute('SELECT DISTINCT country FROM campaigns WHERE country IS NOT NULL AND country != ""');
    return result.rows.map(row => row.country);
  }

  async getCountries() {
    const result = await this.client.execute('SELECT * FROM countries ORDER BY name');
    return result.rows;
  }

  async addCountry(countryData) {
    const { id, name, coordinates, value } = countryData;
    const coordinatesStr = JSON.stringify(coordinates);
    
    await this.client.execute(
      'INSERT OR REPLACE INTO countries (id, name, coordinates, value) VALUES (?, ?, ?, ?)',
      [id, name, coordinatesStr, value || 0]
    );
  }

  // Campaign Stats methods
  async getCampaignStats(platform = 'global') {
    let query = 'SELECT * FROM campaign_stats';
    let params = [];
    
    if (platform && platform !== 'global') {
      query += ' WHERE platform = ? OR platform = ?';
      params = [platform, 'global'];
    } else if (platform === 'global') {
      query += ' WHERE platform = ?';
      params = ['global'];
    }
    
    query += ' ORDER BY id';
    
    const result = await this.client.execute(query, params);
    return result.rows;
  }

  async getCampaignStatsByPlatform(platform) {
    const result = await this.client.execute(
      'SELECT * FROM campaign_stats WHERE platform = ? OR platform = "global" ORDER BY id',
      [platform]
    );
    return result.rows;
  }

  async addCampaignStat(statData) {
    const { title, value, raw_value, icon, description, platform } = statData;
    
    const result = await this.client.execute(
      'INSERT INTO campaign_stats (title, value, raw_value, icon, description, platform) VALUES (?, ?, ?, ?, ?, ?)',
      [title, value, raw_value || 0, icon || 'TrendingUp', description, platform || 'global']
    );
    
    return { id: Number(result.lastInsertRowid), ...statData };
  }

  // Leads methods
  async getLeads(platform = null) {
    let query = 'SELECT * FROM leads';
    let params = [];
    
    if (platform) {
      query += ' WHERE platform = ?';
      params = [platform];
    }
    
    query += ' ORDER BY id DESC';
    
    const result = await this.client.execute(query, params);
    return result.rows;
  }

  async getLeadsByPlatform(platform) {
    const result = await this.client.execute(
      'SELECT * FROM leads WHERE platform = ? ORDER BY id DESC',
      [platform]
    );
    return result.rows;
  }

  async addLead(leadData) {
    const { 
      name, projects, followers, followers_count, platform, email, phone, 
      location, category, engagement_rate, verified 
    } = leadData;
    
    const result = await this.client.execute(
      `INSERT INTO leads 
       (name, projects, followers, followers_count, platform, email, phone, location, category, engagement_rate, verified) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, 
        projects || 0, 
        followers, 
        followers_count || 0, 
        platform || 'general',
        email || null,
        phone || null,
        location || null,
        category || null,
        engagement_rate || 0.0,
        verified || false
      ]
    );
    
    return { id: Number(result.lastInsertRowid), ...leadData };
  }

  // Demographics methods
  async getDemographics(platform = 'global') {
    let query = 'SELECT * FROM demographics';
    let params = [];
    
    if (platform && platform !== 'global') {
      query += ' WHERE platform = ? OR platform = "global"';
      params = [platform];
    }
    
    query += ' ORDER BY id';
    
    const result = await this.client.execute(query, params);
    return result.rows;
  }

  async getDemographicsByPlatform(platform) {
    const result = await this.client.execute(
      'SELECT * FROM demographics WHERE platform = ? OR platform = "global" ORDER BY id',
      [platform]
    );
    return result.rows;
  }

  async addDemographic(demoData) {
    const { label, male, female, platform, location } = demoData;
    
    const result = await this.client.execute(
      'INSERT INTO demographics (label, male, female, platform, location) VALUES (?, ?, ?, ?, ?)',
      [label, male || 0, female || 0, platform || 'global', location || 'global']
    );
    
    return { id: Number(result.lastInsertRowid), ...demoData };
  }

  // Interests methods
  async getInterests(platform = 'global') {
    let query = 'SELECT * FROM interests';
    let params = [];
    
    if (platform && platform !== 'global') {
      query += ' WHERE platform = ? OR platform = "global"';
      params = [platform];
    }
    
    query += ' ORDER BY id';
    
    const result = await this.client.execute(query, params);
    return result.rows;
  }

  async getInterestsByPlatform(platform) {
    const result = await this.client.execute(
      'SELECT * FROM interests WHERE platform = ? OR platform = "global" ORDER BY id',
      [platform]
    );
    return result.rows;
  }

  async addInterest(interestData) {
    const { label, value, platform } = interestData;
    
    const result = await this.client.execute(
      'INSERT INTO interests (label, value, platform) VALUES (?, ?, ?)',
      [label, value || 0, platform || 'global']
    );
    
    return { id: Number(result.lastInsertRowid), ...interestData };
  }

  // Campaigns methods
  async getCampaigns(filters = {}) {
    let query = 'SELECT * FROM campaigns';
    let params = [];
    let conditions = [];
    
    if (filters.platform) {
      conditions.push('platform = ?');
      params.push(filters.platform);
    }
    
    if (filters.country) {
      conditions.push('country = ?');
      params.push(filters.country);
    }
    
    if (filters.status) {
      conditions.push('status = ?');
      params.push(filters.status);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await this.client.execute(query, params);
    return result.rows;
  }

  async addCampaign(campaignData) {
    const { 
      name, platform, country, status, start_date, end_date, 
      budget, reach, impressions, clicks, conversions 
    } = campaignData;
    
    const result = await this.client.execute(
      `INSERT INTO campaigns 
       (name, platform, country, status, start_date, end_date, budget, reach, impressions, clicks, conversions) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        platform,
        country || null,
        status || 'active',
        start_date || null,
        end_date || null,
        budget || null,
        reach || 0,
        impressions || 0,
        clicks || 0,
        conversions || 0
      ]
    );
    
    return { id: Number(result.lastInsertRowid), ...campaignData };
  }

  // Utility methods
  async clearAllData() {
    const tables = ['countries', 'campaign_stats', 'leads', 'demographics', 'interests', 'campaigns'];
    
    for (const table of tables) {
      await this.client.execute(`DELETE FROM ${table}`);
    }
  }

  async getTableCounts() {
    const tables = ['countries', 'campaign_stats', 'leads', 'demographics', 'interests', 'campaigns'];
    const counts = {};
    
    for (const table of tables) {
      const result = await this.client.execute(`SELECT COUNT(*) as count FROM ${table}`);
      counts[table] = result.rows[0].count;
    }
    
    return counts;
  }
}

// Export singleton instance
const dbService = new DatabaseService();

module.exports = {
  initializeDatabase: () => dbService.initialize(),
  getCountriesWithData: () => dbService.getCountriesWithData(),
  getCountries: () => dbService.getCountries(),
  addCountry: (data) => dbService.addCountry(data),
  getCampaignStats: (platform) => dbService.getCampaignStats(platform),
  getCampaignStatsByPlatform: (platform) => dbService.getCampaignStatsByPlatform(platform),
  addCampaignStat: (data) => dbService.addCampaignStat(data),
  getLeads: (platform) => dbService.getLeads(platform),
  getLeadsByPlatform: (platform) => dbService.getLeadsByPlatform(platform),
  addLead: (data) => dbService.addLead(data),
  getDemographics: (platform) => dbService.getDemographics(platform),
  getDemographicsByPlatform: (platform) => dbService.getDemographicsByPlatform(platform),
  addDemographic: (data) => dbService.addDemographic(data),
  getInterests: (platform) => dbService.getInterests(platform),
  getInterestsByPlatform: (platform) => dbService.getInterestsByPlatform(platform),
  addInterest: (data) => dbService.addInterest(data),
  getCampaigns: (filters) => dbService.getCampaigns(filters),
  addCampaign: (data) => dbService.addCampaign(data),
  clearAllData: () => dbService.clearAllData(),
  getTableCounts: () => dbService.getTableCounts()
};
