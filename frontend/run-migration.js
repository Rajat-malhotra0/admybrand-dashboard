// Database Migration Script
// Run this to add missing columns to production database

import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function populateSampleData(client) {
  try {
    // Sample campaigns data
    const campaigns = [
      { name: 'LinkedIn Brand Awareness', platform: 'LinkedIn', status: 'active', reach: 150000, impressions: 420000, clicks: 12500, conversions: 850, cost_per_click: 2.50, cost_per_conversion: 35.20, country: 'USA' },
      { name: 'Instagram Fashion Campaign', platform: 'Instagram', status: 'active', reach: 280000, impressions: 650000, clicks: 18400, conversions: 1240, cost_per_click: 1.80, cost_per_conversion: 28.90, country: 'USA' },
      { name: 'Facebook Tech Launch', platform: 'Facebook', status: 'active', reach: 320000, impressions: 890000, clicks: 24500, conversions: 1680, cost_per_click: 2.10, cost_per_conversion: 31.40, country: 'UK' },
      { name: 'LinkedIn B2B Campaign', platform: 'LinkedIn', status: 'active', reach: 95000, impressions: 245000, clicks: 8200, conversions: 520, cost_per_click: 3.20, cost_per_conversion: 42.50, country: 'Canada' },
      { name: 'Instagram Lifestyle', platform: 'Instagram', status: 'active', reach: 210000, impressions: 520000, clicks: 15600, conversions: 980, cost_per_click: 1.95, cost_per_conversion: 29.80, country: 'Australia' }
    ];

    for (const campaign of campaigns) {
      await client.execute(
        'INSERT INTO campaigns (name, platform, status, reach, impressions, clicks, conversions, cost_per_click, cost_per_conversion, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [campaign.name, campaign.platform, campaign.status, campaign.reach, campaign.impressions, campaign.clicks, campaign.conversions, campaign.cost_per_click, campaign.cost_per_conversion, campaign.country]
      );
    }
    console.log('✓ Sample campaigns added');

    // Sample influencers data
    const influencers = [
      { name: 'Sarah Johnson', projects: 15, followers: '125K', platform: 'LinkedIn' },
      { name: 'Mike Chen', projects: 22, followers: '340K', platform: 'Instagram' },
      { name: 'Emily Rodriguez', projects: 18, followers: '2.1M', platform: 'Instagram' },
      { name: 'David Kim', projects: 12, followers: '89K', platform: 'LinkedIn' },
      { name: 'Jessica Taylor', projects: 28, followers: '1.8M', platform: 'Facebook' },
      { name: 'Alex Brown', projects: 35, followers: '3.2M', platform: 'Instagram' },
      { name: 'Lisa Wang', projects: 14, followers: '156K', platform: 'LinkedIn' },
      { name: 'Carlos Mendez', projects: 19, followers: '890K', platform: 'Facebook' }
    ];

    for (const influencer of influencers) {
      await client.execute(
        'INSERT INTO influencers (name, projects, followers, platform) VALUES (?, ?, ?, ?)',
        [influencer.name, influencer.projects, influencer.followers, influencer.platform]
      );
    }
    console.log('✓ Sample influencers added');

    // Sample demographics data (matching actual schema: id, label, male, female, platform, location)
    const demographics = [
      { label: '18-24', male: 15.2, female: 12.8, platform: 'LinkedIn', location: 'USA' },
      { label: '25-34', male: 28.5, female: 24.1, platform: 'LinkedIn', location: 'USA' },
      { label: '35-44', male: 19.4, female: 16.8, platform: 'LinkedIn', location: 'USA' },
      { label: '45-54', male: 12.3, female: 14.2, platform: 'LinkedIn', location: 'USA' },
      { label: '18-24', male: 22.3, female: 28.7, platform: 'Instagram', location: 'USA' },
      { label: '25-34', male: 18.9, female: 20.1, platform: 'Instagram', location: 'USA' },
      { label: '35-44', male: 15.4, female: 17.8, platform: 'Instagram', location: 'USA' },
      { label: '25-34', male: 24.8, female: 26.2, platform: 'Facebook', location: 'USA' },
      { label: '35-44', male: 21.5, female: 27.5, platform: 'Facebook', location: 'USA' },
      { label: '45-54', male: 18.9, female: 22.1, platform: 'Facebook', location: 'USA' }
    ];

    for (const demo of demographics) {
      await client.execute(
        'INSERT INTO demographics (label, male, female, platform, location) VALUES (?, ?, ?, ?, ?)',
        [demo.label, demo.male, demo.female, demo.platform, demo.location]
      );
    }
    console.log('✓ Sample demographics added');

    // Sample user interests data
    const interests = [
      { platform: 'LinkedIn', interest_category: 'Professional', interest_name: 'Technology', percentage: 28.5 },
      { platform: 'LinkedIn', interest_category: 'Professional', interest_name: 'Business', percentage: 24.2 },
      { platform: 'LinkedIn', interest_category: 'Professional', interest_name: 'Marketing', percentage: 18.7 },
      { platform: 'LinkedIn', interest_category: 'Professional', interest_name: 'Finance', percentage: 15.1 },
      { platform: 'Instagram', interest_category: 'Lifestyle', interest_name: 'Fashion', percentage: 32.1 },
      { platform: 'Instagram', interest_category: 'Lifestyle', interest_name: 'Travel', percentage: 28.9 },
      { platform: 'Instagram', interest_category: 'Lifestyle', interest_name: 'Food', percentage: 24.5 },
      { platform: 'Instagram', interest_category: 'Lifestyle', interest_name: 'Fitness', percentage: 22.3 },
      { platform: 'Facebook', interest_category: 'General', interest_name: 'Entertainment', percentage: 26.8 },
      { platform: 'Facebook', interest_category: 'General', interest_name: 'News', percentage: 23.4 },
      { platform: 'Facebook', interest_category: 'General', interest_name: 'Sports', percentage: 21.7 },
      { platform: 'Facebook', interest_category: 'General', interest_name: 'Gaming', percentage: 18.9 }
    ];

    for (const interest of interests) {
      await client.execute(
        'INSERT INTO user_interests (platform, interest_category, interest_name, percentage) VALUES (?, ?, ?, ?)',
        [interest.platform, interest.interest_category, interest.interest_name, interest.percentage]
      );
    }
    console.log('✓ Sample user interests added');
    
    console.log('\n🎉 Sample data population completed successfully!');
  } catch (error) {
    console.error('Error populating sample data:', error);
  }
}

async function runMigration() {
  try {
    console.log('Starting database migration...');
    
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    // Try to add cost_per_click column
    try {
      console.log('Adding cost_per_click column...');
      await client.execute('ALTER TABLE campaigns ADD COLUMN cost_per_click REAL DEFAULT 0.0');
      console.log('✓ cost_per_click column added successfully');
    } catch (error) {
      if (error.message.includes('duplicate column name')) {
        console.log('⚠ cost_per_click column already exists');
      } else {
        console.error('✗ Failed to add cost_per_click column:', error.message);
      }
    }

    // Update existing records
    try {
      console.log('Updating existing records...');
      await client.execute('UPDATE campaigns SET cost_per_click = 0.0 WHERE cost_per_click IS NULL');
      console.log('✓ Records updated successfully');
    } catch (error) {
      console.error('✗ Failed to update records:', error.message);
    }

    console.log('Migration completed!');
    
    // Check existing data
    console.log('\nChecking existing data...');
    
    // First, let's check what columns exist in tables
    try {
      const demoInfo = await client.execute('PRAGMA table_info(demographics)');
      console.log('Demographics table columns:', demoInfo.rows.map(r => r.name));
      
      const interestsInfo = await client.execute('PRAGMA table_info(user_interests)');
      console.log('User interests table columns:', interestsInfo.rows.map(r => r.name));
    } catch (e) {
      console.log('Could not get table info:', e.message);
    }
    
    const campaignCount = await client.execute('SELECT COUNT(*) as count FROM campaigns');
    const influencerCount = await client.execute('SELECT COUNT(*) as count FROM influencers');
    const demographicsCount = await client.execute('SELECT COUNT(*) as count FROM demographics');
    const interestsCount = await client.execute('SELECT COUNT(*) as count FROM user_interests');
    
    console.log('Current data counts:');
    console.log('- Campaigns:', campaignCount.rows[0].count);
    console.log('- Influencers:', influencerCount.rows[0].count);
    console.log('- Demographics:', demographicsCount.rows[0].count);
    console.log('- User Interests:', interestsCount.rows[0].count);
    
    // If no data exists, populate with sample data
    if (campaignCount.rows[0].count === 0 || demographicsCount.rows[0].count === 0 || interestsCount.rows[0].count === 0) {
      console.log('\nMissing data found. Populating with sample data...');
      await populateSampleData(client);
    }
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

runMigration();
