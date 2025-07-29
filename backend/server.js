const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory data store (in production, you'd use a database)
let dashboardData = {
  campaignStats: [
    {
      id: 1,
      title: 'Total Likes',
      value: '350,809',
      icon: 'thumbs-up'
    },
    {
      id: 2,
      title: 'Total Comments',
      value: '186,072',
      icon: 'message-square'
    },
    {
      id: 3,
      title: 'Total Shares',
      value: '120,043',
      icon: 'share'
    },
    {
      id: 4,
      title: 'Engagement',
      value: '48.07%',
      icon: 'bar-chart-2'
    }
  ],
  influencerData: [
    { id: 1, name: 'Malik Wiwoho', projects: 23, followers: '1,620,201' },
    { id: 2, name: 'Nancy Aulia', projects: 34, followers: '1,224,820' },
    { id: 3, name: 'Natasha Vinessa', projects: 12, followers: '1,100,491' },
    { id: 4, name: 'Wilona Hamda', projects: 8, followers: '927,421' },
    { id: 5, name: 'Rava Hamda', projects: 10, followers: '827,810' }
  ],
  demographicsData: [
    { id: 1, label: '18-24', value: 28, color: 'rgb(59, 130, 246)' },
    { id: 2, label: '25-34', value: 35, color: 'rgb(16, 185, 129)' },
    { id: 3, label: '35-44', value: 22, color: 'rgb(245, 158, 11)' },
    { id: 4, label: '45-54', value: 12, color: 'rgb(239, 68, 68)' },
    { id: 5, label: '55+', value: 8, color: 'rgb(139, 92, 246)' }
  ],
  interestsData: [
    { id: 1, label: 'Technology', value: 85 },
    { id: 2, label: 'Business', value: 72 },
    { id: 3, label: 'Marketing', value: 90 },
    { id: 4, label: 'Design', value: 65 },
    { id: 5, label: 'Finance', value: 58 },
    { id: 6, label: 'Education', value: 78 }
  ]
};

// Routes

// Get all dashboard data
app.get('/api/dashboard', (req, res) => {
  res.json(dashboardData);
});

// Campaign Stats Routes
app.get('/api/campaign-stats', (req, res) => {
  res.json(dashboardData.campaignStats);
});

app.post('/api/campaign-stats', (req, res) => {
  const newStat = {
    id: dashboardData.campaignStats.length + 1,
    ...req.body
  };
  dashboardData.campaignStats.push(newStat);
  res.status(201).json(newStat);
});

app.put('/api/campaign-stats/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const statIndex = dashboardData.campaignStats.findIndex(stat => stat.id === id);
  
  if (statIndex === -1) {
    return res.status(404).json({ error: 'Campaign stat not found' });
  }
  
  dashboardData.campaignStats[statIndex] = { id, ...req.body };
  res.json(dashboardData.campaignStats[statIndex]);
});

app.delete('/api/campaign-stats/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const statIndex = dashboardData.campaignStats.findIndex(stat => stat.id === id);
  
  if (statIndex === -1) {
    return res.status(404).json({ error: 'Campaign stat not found' });
  }
  
  dashboardData.campaignStats.splice(statIndex, 1);
  res.status(204).send();
});

// Influencer Data Routes
app.get('/api/influencers', (req, res) => {
  res.json(dashboardData.influencerData);
});

app.post('/api/influencers', (req, res) => {
  const newInfluencer = {
    id: dashboardData.influencerData.length + 1,
    ...req.body
  };
  dashboardData.influencerData.push(newInfluencer);
  res.status(201).json(newInfluencer);
});

app.put('/api/influencers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const influencerIndex = dashboardData.influencerData.findIndex(inf => inf.id === id);
  
  if (influencerIndex === -1) {
    return res.status(404).json({ error: 'Influencer not found' });
  }
  
  dashboardData.influencerData[influencerIndex] = { id, ...req.body };
  res.json(dashboardData.influencerData[influencerIndex]);
});

app.delete('/api/influencers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const influencerIndex = dashboardData.influencerData.findIndex(inf => inf.id === id);
  
  if (influencerIndex === -1) {
    return res.status(404).json({ error: 'Influencer not found' });
  }
  
  dashboardData.influencerData.splice(influencerIndex, 1);
  res.status(204).send();
});

// Demographics Data Routes
app.get('/api/demographics', (req, res) => {
  res.json(dashboardData.demographicsData);
});

app.put('/api/demographics/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const demoIndex = dashboardData.demographicsData.findIndex(demo => demo.id === id);
  
  if (demoIndex === -1) {
    return res.status(404).json({ error: 'Demographics data not found' });
  }
  
  dashboardData.demographicsData[demoIndex] = { id, ...req.body };
  res.json(dashboardData.demographicsData[demoIndex]);
});

// Interests Data Routes
app.get('/api/interests', (req, res) => {
  res.json(dashboardData.interestsData);
});

app.put('/api/interests/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const interestIndex = dashboardData.interestsData.findIndex(int => int.id === id);
  
  if (interestIndex === -1) {
    return res.status(404).json({ error: 'Interest data not found' });
  }
  
  dashboardData.interestsData[interestIndex] = { id, ...req.body };
  res.json(dashboardData.interestsData[interestIndex]);
});

// Reset data to default
app.post('/api/reset', (req, res) => {
  dashboardData = {
    campaignStats: [
      {
        id: 1,
        title: 'Total Likes',
        value: '350,809',
        icon: 'thumbs-up'
      },
      {
        id: 2,
        title: 'Total Comments',
        value: '186,072',
        icon: 'message-square'
      },
      {
        id: 3,
        title: 'Total Shares',
        value: '120,043',
        icon: 'share'
      },
      {
        id: 4,
        title: 'Engagement',
        value: '48.07%',
        icon: 'bar-chart-2'
      }
    ],
    influencerData: [
      { id: 1, name: 'Malik Wiwoho', projects: 23, followers: '1,620,201' },
      { id: 2, name: 'Nancy Aulia', projects: 34, followers: '1,224,820' },
      { id: 3, name: 'Natasha Vinessa', projects: 12, followers: '1,100,491' },
      { id: 4, name: 'Wilona Hamda', projects: 8, followers: '927,421' },
      { id: 5, name: 'Rava Hamda', projects: 10, followers: '827,810' }
    ],
    demographicsData: [
      { id: 1, label: '18-24', value: 28, color: 'rgb(59, 130, 246)' },
      { id: 2, label: '25-34', value: 35, color: 'rgb(16, 185, 129)' },
      { id: 3, label: '35-44', value: 22, color: 'rgb(245, 158, 11)' },
      { id: 4, label: '45-54', value: 12, color: 'rgb(239, 68, 68)' },
      { id: 5, label: '55+', value: 8, color: 'rgb(139, 92, 246)' }
    ],
    interestsData: [
      { id: 1, label: 'Technology', value: 85 },
      { id: 2, label: 'Business', value: 72 },
      { id: 3, label: 'Marketing', value: 90 },
      { id: 4, label: 'Design', value: 65 },
      { id: 5, label: 'Finance', value: 58 },
      { id: 6, label: 'Education', value: 78 }
    ]
  };
  res.json({ message: 'Data reset successfully', data: dashboardData });
});

// Test interface route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Test interface available at http://localhost:${PORT}`);
});
