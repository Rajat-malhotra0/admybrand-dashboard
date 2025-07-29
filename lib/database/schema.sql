-- Admin Dashboard Unified Database Schema
-- This file creates all tables needed for the admin dashboard

-- Create Influencers table
CREATE TABLE IF NOT EXISTS influencers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  projects INTEGER NOT NULL DEFAULT 0,
  followers TEXT NOT NULL DEFAULT '0',
  platform TEXT NOT NULL DEFAULT 'General',
  email TEXT,
  phone TEXT,
  location TEXT,
  category TEXT,
  engagement_rate REAL DEFAULT 0.0,
  avg_likes INTEGER DEFAULT 0,
  avg_comments INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  platform TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  start_date DATE,
  end_date DATE,
  budget REAL,
  reach INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  cost_per_click REAL DEFAULT 0.0,
  cost_per_conversion REAL DEFAULT 0.0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Demographics table
CREATE TABLE IF NOT EXISTS demographics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  platform TEXT NOT NULL,
  age_group TEXT NOT NULL,
  gender TEXT NOT NULL,
  location TEXT NOT NULL,
  percentage REAL NOT NULL DEFAULT 0.0,
  total_users INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Platform Stats table
CREATE TABLE IF NOT EXISTS platform_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  platform TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value INTEGER NOT NULL DEFAULT 0,
  metric_type TEXT NOT NULL DEFAULT 'count',
  date DATE DEFAULT CURRENT_DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create User Interests table
CREATE TABLE IF NOT EXISTS user_interests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  platform TEXT NOT NULL,
  interest_category TEXT NOT NULL,
  interest_name TEXT NOT NULL,
  percentage REAL NOT NULL DEFAULT 0.0,
  total_users INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Geographic Data table
CREATE TABLE IF NOT EXISTS geographic_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  region TEXT,
  city TEXT,
  user_count INTEGER DEFAULT 0,
  percentage REAL DEFAULT 0.0,
  latitude REAL,
  longitude REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Campaign Influencer Relations table
CREATE TABLE IF NOT EXISTS campaign_influencers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  campaign_id INTEGER NOT NULL,
  influencer_id INTEGER NOT NULL,
  status TEXT DEFAULT 'active',
  contract_value REAL,
  performance_bonus REAL DEFAULT 0.0,
  deliverables TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
  FOREIGN KEY (influencer_id) REFERENCES influencers(id) ON DELETE CASCADE
);

-- Create Performance Metrics table
CREATE TABLE IF NOT EXISTS performance_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_type TEXT NOT NULL, -- 'influencer', 'campaign', 'platform'
  entity_id INTEGER NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value REAL NOT NULL,
  metric_unit TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Analytics Events table for tracking
CREATE TABLE IF NOT EXISTS analytics_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL,
  event_name TEXT NOT NULL,
  event_data TEXT, -- JSON data
  user_id TEXT,
  session_id TEXT,
  platform TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_influencers_platform ON influencers(platform);
CREATE INDEX IF NOT EXISTS idx_influencers_followers ON influencers(followers);
CREATE INDEX IF NOT EXISTS idx_campaigns_platform ON campaigns(platform);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_demographics_platform ON demographics(platform);
CREATE INDEX IF NOT EXISTS idx_platform_stats_platform ON platform_stats(platform);
CREATE INDEX IF NOT EXISTS idx_platform_stats_date ON platform_stats(date);
CREATE INDEX IF NOT EXISTS idx_user_interests_platform ON user_interests(platform);
CREATE INDEX IF NOT EXISTS idx_geographic_data_country ON geographic_data(country_code);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_entity ON performance_metrics(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_date ON performance_metrics(date);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_date ON analytics_events(created_at);
