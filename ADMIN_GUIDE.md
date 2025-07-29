# Dashboard Admin Interface

## Overview
The admin interface allows you to edit and manage all dashboard data directly from the browser. Changes are saved to localStorage and will be reflected immediately on the main dashboard.

## Access
Navigate to `/admin` or click the "Admin" link in the sidebar (shield icon).

## Features

### 1. Campaign Stats Management
- **Add new stats**: Use the form to create new campaign statistics with custom values
- **Edit existing**: View all current stats and delete unwanted ones
- **Icon selection**: Choose from TrendingUp, Users, Eye, or Target icons

### 2. Influencer Management
- **Add influencers**: Create new influencer entries with name, project count, and follower count
- **Delete influencers**: Remove influencers from the dashboard
- **Follower format**: Use formats like "1.2M", "980K" for follower counts

### 3. Demographics Editor
- **Live editing**: Directly edit age groups and male/female values
- **Real-time updates**: Changes reflect immediately in the age/gender chart
- **Numeric inputs**: Enter raw numbers for male/female demographics

### 4. Interests Editor
- **Category management**: Edit interest categories and their values
- **Value adjustment**: Set interest scores from 0-100
- **Chart synchronization**: Changes update the radar chart instantly

### 5. Data Management
- **Save Data**: Saves current data to localStorage
- **Load Data**: Loads previously saved data
- **Reset Data**: Restores original default data
- **JSON Editor**: Direct JSON editing for advanced users

## Data Flow

1. **Admin Changes**: Make changes in the admin interface
2. **Save to localStorage**: Click "Save Data" to persist changes
3. **Dashboard Updates**: Main dashboard automatically loads saved data on refresh
4. **Live Preview**: Changes are visible immediately when switching between pages

## Usage Tips

1. **Always save**: Click "Save Data" after making changes to persist them
2. **Test changes**: Navigate back to the main dashboard to see your changes
3. **Backup data**: Copy the JSON from the Raw Data section before major changes
4. **Reset safely**: Use "Reset Data" to restore defaults if something goes wrong

## Technical Details

- Data is stored in browser localStorage under the key "dashboardData"
- The main dashboard checks for saved data on every page load
- Changes are applied immediately to the React state
- JSON structure matches the original mock data format

## Troubleshooting

1. **Changes not showing**: Make sure to click "Save Data" and refresh the main dashboard
2. **Invalid JSON**: Use the forms instead of direct JSON editing if you encounter errors
3. **Missing data**: Click "Reset Data" to restore the original dataset
4. **Browser issues**: Clear localStorage and refresh if data appears corrupted
