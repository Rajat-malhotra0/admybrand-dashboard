const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, "public")));

// Upload routes
app.use('/api/upload', uploadRoutes);

// In-memory data store (in production, you'd use a database)
let dashboardData = {
  // Platform-specific data
  platforms: {
    "LinkedIn": {
      campaignStats: [
        {
          id: 1,
          title: "Total Reach",
          value: "1.8M",
          icon: "TrendingUp",
          description: "+12% from last month",
        },
        {
          id: 2,
          title: "Engagement",
          value: "24,856",
          icon: "Users",
          description: "+8.3% from last week",
        },
        {
          id: 3,
          title: "Impressions",
          value: "950K",
          icon: "Eye",
          description: "+15.2% from last month",
        },
        {
          id: 4,
          title: "Conversions",
          value: "672",
          icon: "Target",
          description: "+18% from last month",
        },
      ],
      influencerData: [
        { id: 1, name: "Sarah Connor", projects: 15, followers: "2.1M" },
        { id: 2, name: "John Davis", projects: 22, followers: "1.8M" },
        { id: 3, name: "Emily Chen", projects: 18, followers: "1.4M" },
        { id: 4, name: "Michael Torres", projects: 12, followers: "980K" },
      ],
      demographicsData: [
        { label: "25-34", male: 42, female: 38 },
        { label: "35-44", male: 35, female: 32 },
        { label: "45-54", male: 28, female: 25 },
        { label: "55+", male: 20, female: 18 },
        { label: "18-24", male: 15, female: 12 },
      ],
      interestsData: [
        { label: "Business", value: 92 },
        { label: "Technology", value: 88 },
        { label: "Professional Development", value: 85 },
        { label: "Leadership", value: 78 },
        { label: "Marketing", value: 72 },
        { label: "Finance", value: 68 },
      ],
    },
    "Instagram": {
      campaignStats: [
        {
          id: 1,
          title: "Total Reach",
          value: "2.4M",
          icon: "TrendingUp",
          description: "+15% from last month",
        },
        {
          id: 2,
          title: "Engagement",
          value: "48,392",
          icon: "Users",
          description: "+12.7% from last week",
        },
        {
          id: 3,
          title: "Impressions",
          value: "1.6M",
          icon: "Eye",
          description: "+9.8% from last month",
        },
        {
          id: 4,
          title: "Conversions",
          value: "1,234",
          icon: "Target",
          description: "+22% from last month",
        },
      ],
      influencerData: [
        { id: 1, name: "Zara Milano", projects: 28, followers: "3.2M" },
        { id: 2, name: "Jake Thompson", projects: 19, followers: "2.8M" },
        { id: 3, name: "Luna Rodriguez", projects: 24, followers: "2.1M" },
        { id: 4, name: "Alex Kim", projects: 16, followers: "1.9M" },
      ],
      demographicsData: [
        { label: "18-24", male: 32, female: 45 },
        { label: "25-34", male: 28, female: 38 },
        { label: "35-44", male: 18, female: 22 },
        { label: "45-54", male: 12, female: 15 },
        { label: "55+", male: 8, female: 10 },
      ],
      interestsData: [
        { label: "Fashion", value: 95 },
        { label: "Beauty", value: 88 },
        { label: "Lifestyle", value: 82 },
        { label: "Travel", value: 75 },
        { label: "Food", value: 68 },
        { label: "Fitness", value: 62 },
      ],
    },
    "Facebook": {
      campaignStats: [
        {
          id: 1,
          title: "Total Reach",
          value: "1.9M",
          icon: "TrendingUp",
          description: "+7% from last month",
        },
        {
          id: 2,
          title: "Engagement",
          value: "32,186",
          icon: "Users",
          description: "+5.4% from last week",
        },
        {
          id: 3,
          title: "Impressions",
          value: "1.2M",
          icon: "Eye",
          description: "+6.1% from last month",
        },
        {
          id: 4,
          title: "Conversions",
          value: "892",
          icon: "Target",
          description: "+14% from last month",
        },
      ],
      influencerData: [
        { id: 1, name: "Maria Santos", projects: 21, followers: "1.8M" },
        { id: 2, name: "David Wilson", projects: 17, followers: "1.5M" },
        { id: 3, name: "Sophie Turner", projects: 14, followers: "1.2M" },
        { id: 4, name: "Carlos Rivera", projects: 19, followers: "1.1M" },
      ],
      demographicsData: [
        { label: "35-44", male: 28, female: 32 },
        { label: "45-54", male: 25, female: 28 },
        { label: "25-34", male: 22, female: 25 },
        { label: "55+", male: 18, female: 22 },
        { label: "18-24", male: 12, female: 15 },
      ],
      interestsData: [
        { label: "Family", value: 85 },
        { label: "News", value: 78 },
        { label: "Entertainment", value: 72 },
        { label: "Community", value: 68 },
        { label: "Local Events", value: 58 },
        { label: "Sports", value: 52 },
      ],
    },
  },
  // Legacy global stats (for backward compatibility)
  campaignStats: [
    {
      id: 1,
      title: "Total Reach",
      value: "2.0M",
      icon: "TrendingUp",
      description: "+11% from last month",
    },
    {
      id: 2,
      title: "Engagement",
      value: "35,144",
      icon: "Users",
      description: "+8.8% from last week",
    },
    {
      id: 3,
      title: "Impressions",
      value: "1.3M",
      icon: "Eye",
      description: "+10.4% from last month",
    },
    {
      id: 4,
      title: "Conversions",
      value: "933",
      icon: "Target",
      description: "+18% from last month",
    },
  ],
  influencerData: [
    { id: 1, name: "Alex Johnson", projects: 21, followers: "2.2M" },
    { id: 2, name: "Sam Chen", projects: 18, followers: "1.9M" },
    { id: 3, name: "Riley Martinez", projects: 24, followers: "1.6M" },
    { id: 4, name: "Jordan Kim", projects: 15, followers: "1.3M" },
  ],
  demographicsData: [
    { label: "18-24", male: 25, female: 30 },
    { label: "25-34", male: 35, female: 32 },
    { label: "35-44", male: 24, female: 26 },
    { label: "45-54", male: 18, female: 22 },
    { label: "55+", male: 15, female: 18 },
  ],
  interestsData: [
    { label: "Technology", value: 85 },
    { label: "Business", value: 78 },
    { label: "Lifestyle", value: 72 },
    { label: "Entertainment", value: 68 },
    { label: "Education", value: 62 },
    { label: "Sports", value: 55 },
  ],
};

// Routes

// Get all dashboard data
app.get("/api/dashboard", (req, res) => {
  res.json(dashboardData);
});

// Platform-specific data routes
app.get("/api/platforms/:platform", (req, res) => {
  const platform = req.params.platform;
  if (dashboardData.platforms[platform]) {
    res.json(dashboardData.platforms[platform]);
  } else {
    res.status(404).json({ error: "Platform not found" });
  }
});

// Get platform-specific campaign stats
app.get("/api/platforms/:platform/campaign-stats", (req, res) => {
  const platform = req.params.platform;
  if (dashboardData.platforms[platform]) {
    res.json(dashboardData.platforms[platform].campaignStats);
  } else {
    res.status(404).json({ error: "Platform not found" });
  }
});

// Get platform-specific influencers
app.get("/api/platforms/:platform/influencers", (req, res) => {
  const platform = req.params.platform;
  if (dashboardData.platforms[platform]) {
    res.json(dashboardData.platforms[platform].influencerData);
  } else {
    res.status(404).json({ error: "Platform not found" });
  }
});

// Get platform-specific demographics
app.get("/api/platforms/:platform/demographics", (req, res) => {
  const platform = req.params.platform;
  if (dashboardData.platforms[platform]) {
    res.json(dashboardData.platforms[platform].demographicsData);
  } else {
    res.status(404).json({ error: "Platform not found" });
  }
});

// Get platform-specific interests
app.get("/api/platforms/:platform/interests", (req, res) => {
  const platform = req.params.platform;
  if (dashboardData.platforms[platform]) {
    res.json(dashboardData.platforms[platform].interestsData);
  } else {
    res.status(404).json({ error: "Platform not found" });
  }
});

// Update platform-specific data
app.put("/api/platforms/:platform", (req, res) => {
  const platform = req.params.platform;
  if (dashboardData.platforms[platform]) {
    dashboardData.platforms[platform] = { ...dashboardData.platforms[platform], ...req.body };
    res.json(dashboardData.platforms[platform]);
  } else {
    res.status(404).json({ error: "Platform not found" });
  }
});

// Campaign Stats Routes
app.get("/api/campaign-stats", (req, res) => {
  res.json(dashboardData.campaignStats);
});

app.post("/api/campaign-stats", (req, res) => {
  const newStat = {
    id: dashboardData.campaignStats.length + 1,
    ...req.body,
  };
  dashboardData.campaignStats.push(newStat);
  res.status(201).json(newStat);
});

app.put("/api/campaign-stats/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const statIndex = dashboardData.campaignStats.findIndex(
    (stat) => stat.id === id,
  );

  if (statIndex === -1) {
    return res.status(404).json({ error: "Campaign stat not found" });
  }

  dashboardData.campaignStats[statIndex] = { id, ...req.body };
  res.json(dashboardData.campaignStats[statIndex]);
});

app.delete("/api/campaign-stats/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const statIndex = dashboardData.campaignStats.findIndex(
    (stat) => stat.id === id,
  );

  if (statIndex === -1) {
    return res.status(404).json({ error: "Campaign stat not found" });
  }

  dashboardData.campaignStats.splice(statIndex, 1);
  res.status(204).send();
});

// Influencer Data Routes
app.get("/api/influencers", (req, res) => {
  res.json(dashboardData.influencerData);
});

app.post("/api/influencers", (req, res) => {
  const newInfluencer = {
    id: dashboardData.influencerData.length + 1,
    ...req.body,
  };
  dashboardData.influencerData.push(newInfluencer);
  res.status(201).json(newInfluencer);
});

app.put("/api/influencers/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const influencerIndex = dashboardData.influencerData.findIndex(
    (inf) => inf.id === id,
  );

  if (influencerIndex === -1) {
    return res.status(404).json({ error: "Influencer not found" });
  }

  dashboardData.influencerData[influencerIndex] = { id, ...req.body };
  res.json(dashboardData.influencerData[influencerIndex]);
});

app.delete("/api/influencers/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const influencerIndex = dashboardData.influencerData.findIndex(
    (inf) => inf.id === id,
  );

  if (influencerIndex === -1) {
    return res.status(404).json({ error: "Influencer not found" });
  }

  dashboardData.influencerData.splice(influencerIndex, 1);
  res.status(204).send();
});

// Demographics Data Routes
app.get("/api/demographics", (req, res) => {
  res.json(dashboardData.demographicsData);
});

app.put("/api/demographics/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const demoIndex = dashboardData.demographicsData.findIndex(
    (demo) => demo.id === id,
  );

  if (demoIndex === -1) {
    return res.status(404).json({ error: "Demographics data not found" });
  }

  dashboardData.demographicsData[demoIndex] = { id, ...req.body };
  res.json(dashboardData.demographicsData[demoIndex]);
});

// Interests Data Routes
app.get("/api/interests", (req, res) => {
  res.json(dashboardData.interestsData);
});

app.put("/api/interests/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const interestIndex = dashboardData.interestsData.findIndex(
    (int) => int.id === id,
  );

  if (interestIndex === -1) {
    return res.status(404).json({ error: "Interest data not found" });
  }

  dashboardData.interestsData[interestIndex] = { id, ...req.body };
  res.json(dashboardData.interestsData[interestIndex]);
});

// Reset data to default
app.post("/api/reset", (req, res) => {
  dashboardData = {
    campaignStats: [
      {
        id: 1,
        title: "Total Likes",
        value: "350,809",
        icon: "thumbs-up",
      },
      {
        id: 2,
        title: "Total Comments",
        value: "186,072",
        icon: "message-square",
      },
      {
        id: 3,
        title: "Total Shares",
        value: "120,043",
        icon: "share",
      },
      {
        id: 4,
        title: "Engagement",
        value: "48.07%",
        icon: "bar-chart-2",
      },
    ],
    influencerData: [
      { id: 1, name: "Malik Wiwoho", projects: 23, followers: "1,620,201" },
      { id: 2, name: "Nancy Aulia", projects: 34, followers: "1,224,820" },
      { id: 3, name: "Natasha Vinessa", projects: 12, followers: "1,100,491" },
      { id: 4, name: "Wilona Hamda", projects: 8, followers: "927,421" },
      { id: 5, name: "Rava Hamda", projects: 10, followers: "827,810" },
    ],
    demographicsData: [
      { id: 1, label: "18-24", value: 28, color: "rgb(59, 130, 246)" },
      { id: 2, label: "25-34", value: 35, color: "rgb(16, 185, 129)" },
      { id: 3, label: "35-44", value: 22, color: "rgb(245, 158, 11)" },
      { id: 4, label: "45-54", value: 12, color: "rgb(239, 68, 68)" },
      { id: 5, label: "55+", value: 8, color: "rgb(139, 92, 246)" },
    ],
    interestsData: [
      { id: 1, label: "Technology", value: 85 },
      { id: 2, label: "Business", value: 72 },
      { id: 3, label: "Marketing", value: 90 },
      { id: 4, label: "Design", value: 65 },
      { id: 5, label: "Finance", value: 58 },
      { id: 6, label: "Education", value: 78 },
    ],
  };
  res.json({ message: "Data reset successfully", data: dashboardData });
});


// Test interface route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Test interface available at http://localhost:${PORT}`);
});
