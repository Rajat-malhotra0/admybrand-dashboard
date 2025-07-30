const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const { z } = require('zod');
const { getTursoClient } = require('../lib/database/turso');

const router = express.Router();

// Configure multer for different file types
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow CSV, JSON, and TXT files
    const allowedTypes = ['.csv', '.json', '.txt'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only CSV, JSON, and TXT files are allowed.'));
    }
  }
});

// Validation schemas
const influencerSchema = z.object({
  name: z.string().min(1),
  projects: z.number().int().min(0),
  followers: z.string(),
  platform: z.string().optional().default('General'),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  category: z.string().optional(),
  engagement_rate: z.number().optional().default(0),
  verified: z.boolean().optional().default(false)
});

const campaignSchema = z.object({
  name: z.string().min(1),
  platform: z.string().min(1),
  status: z.string().optional().default('active'),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  budget: z.number().optional(),
  reach: z.number().int().optional().default(0),
  impressions: z.number().int().optional().default(0),
  clicks: z.number().int().optional().default(0),
  conversions: z.number().int().optional().default(0)
});

const demographicSchema = z.object({
  platform: z.string().min(1),
  age_group: z.string().min(1),
  gender: z.string().min(1),
  location: z.string().min(1),
  percentage: z.number().min(0).max(100),
  total_users: z.number().int().optional().default(0)
});

// Generic file upload handler
router.post('/file', upload.single('file'), async (req, res) => {
  console.log('=== FILE UPLOAD REQUEST RECEIVED ===');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('File info:', req.file ? {
    fieldname: req.file.fieldname,
    originalname: req.file.originalname,
    encoding: req.file.encoding,
    mimetype: req.file.mimetype,
    size: req.file.size,
    path: req.file.path
  } : 'No file');
  
  try {
    if (!req.file) {
      console.log('ERROR: No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { dataType, platform } = req.body;
    console.log('Data type:', dataType, 'Platform:', platform);
    
    if (!dataType) {
      console.log('ERROR: Data type not specified');
      return res.status(400).json({ error: 'Data type must be specified' });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    console.log('File path:', filePath, 'Extension:', fileExtension);
    
    let processedCount = 0;
    let errors = [];

    console.log('Processing file...');
    if (fileExtension === '.csv') {
      processedCount = await processCSVFile(filePath, dataType, errors);
    } else if (fileExtension === '.json') {
      processedCount = await processJSONFile(filePath, dataType, errors);
    } else {
      console.log('ERROR: Unsupported file format:', fileExtension);
      return res.status(400).json({ error: 'Unsupported file format' });
    }

    console.log('Processing complete. Processed:', processedCount, 'Errors:', errors.length);

    // Clean up uploaded file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('Cleaned up uploaded file');
    }

    if (errors.length > 0) {
      console.log('Partial success response sent');
      return res.status(207).json({
        message: `Partial success: ${processedCount} records processed`,
        processed: processedCount,
        errors: errors.slice(0, 10) // Limit errors shown
      });
    }

    console.log('Success response sent');
    res.status(201).json({
      message: `Successfully processed ${processedCount} records`,
      processed: processedCount
    });

  } catch (error) {
    console.error('=== UPLOAD ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
      console.log('Cleaned up file after error');
    }
    
    res.status(500).json({ 
      error: 'Failed to process upload',
      details: error.message 
    });
  }
});

// Process CSV files
async function processCSVFile(filePath, dataType, errors) {
  const client = getTursoClient();
  let processedCount = 0;
  
  return new Promise((resolve, reject) => {
    const results = [];
    
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        results.push(row);
      })
      .on('end', async () => {
        try {
          for (const row of results) {
            try {
              await insertDataByType(client, dataType, row);
              processedCount++;
            } catch (error) {
              errors.push({
                row: processedCount + 1,
                data: row,
                error: error.message
              });
            }
          }
          resolve(processedCount);
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// Process JSON files
async function processJSONFile(filePath, dataType, errors) {
  const client = getTursoClient();
  let processedCount = 0;

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(fileContent);
    
    const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
    
    for (const item of dataArray) {
      try {
        await insertDataByType(client, dataType, item);
        processedCount++;
      } catch (error) {
        errors.push({
          row: processedCount + 1,
          data: item,
          error: error.message
        });
      }
    }
    
    return processedCount;
  } catch (error) {
    throw new Error(`Failed to process JSON file: ${error.message}`);
  }
}

// Insert data based on type with validation
async function insertDataByType(client, dataType, data) {
  console.log('=== INSERTING DATA ===');
  console.log('Data type:', dataType);
  console.log('Raw data:', data);
  
  let validatedData;
  let sql;
  let params;

  switch (dataType.toLowerCase()) {
    case 'influencers':
      console.log('Processing influencer data...');
      validatedData = influencerSchema.parse({
        ...data,
        projects: parseInt(data.projects) || 0,
        engagement_rate: parseFloat(data.engagement_rate) || 0,
        verified: data.verified === 'true' || data.verified === true
      });
      
      console.log('Validated data:', validatedData);
      
      sql = `INSERT OR REPLACE INTO influencers 
             (name, projects, followers, platform, email, phone, location, category, engagement_rate, verified)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      params = [
        validatedData.name,
        validatedData.projects,
        validatedData.followers,
        validatedData.platform,
        validatedData.email,
        validatedData.phone,
        validatedData.location,
        validatedData.category,
        validatedData.engagement_rate,
        validatedData.verified
      ];
      break;

    case 'campaigns':
      console.log('Processing campaign data...');
      validatedData = campaignSchema.parse({
        ...data,
        budget: parseFloat(data.budget) || null,
        reach: parseInt(data.reach) || 0,
        impressions: parseInt(data.impressions) || 0,
        clicks: parseInt(data.clicks) || 0,
        conversions: parseInt(data.conversions) || 0
      });
      
      console.log('Validated data:', validatedData);
      
      sql = `INSERT OR REPLACE INTO campaigns 
             (name, platform, status, start_date, end_date, budget, reach, impressions, clicks, conversions)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      params = [
        validatedData.name,
        validatedData.platform,
        validatedData.status,
        validatedData.start_date,
        validatedData.end_date,
        validatedData.budget,
        validatedData.reach,
        validatedData.impressions,
        validatedData.clicks,
        validatedData.conversions
      ];
      break;

    case 'demographics':
      console.log('Processing demographics data...');
      validatedData = demographicSchema.parse({
        ...data,
        percentage: parseFloat(data.percentage) || 0,
        total_users: parseInt(data.total_users) || 0
      });
      
      console.log('Validated data:', validatedData);
      
      sql = `INSERT OR REPLACE INTO demographics 
             (platform, age_group, gender, location, percentage, total_users)
             VALUES (?, ?, ?, ?, ?, ?)`;
      params = [
        validatedData.platform,
        validatedData.age_group,
        validatedData.gender,
        validatedData.location,
        validatedData.percentage,
        validatedData.total_users
      ];
      break;

    default:
      throw new Error(`Unsupported data type: ${dataType}`);
  }

  console.log('SQL query:', sql);
  console.log('Parameters:', params);
  
  try {
    const result = await client.execute(sql, params);
    console.log('Database execute result:', result);
    console.log('Rows affected:', result.rowsAffected);
    console.log('Last insert ID:', result.lastInsertRowid);
    return result;
  } catch (dbError) {
    console.error('DATABASE ERROR:', dbError);
    throw dbError;
  }
}

// Bulk data upload endpoint
router.post('/bulk', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const client = getTursoClient();
    const filePath = req.file.path;
    
    // Begin transaction for bulk operation
    await client.execute('BEGIN TRANSACTION');
    
    try {
      const { dataType, platform, clearExisting } = req.body;
      
      // Clear existing data if requested
      if (clearExisting === 'true') {
        await clearExistingData(client, dataType, platform);
      }
      
      let processedCount = 0;
      let errors = [];
      
      if (path.extname(req.file.originalname).toLowerCase() === '.csv') {
        processedCount = await processCSVFile(filePath, dataType, errors);
      } else if (path.extname(req.file.originalname).toLowerCase() === '.json') {
        processedCount = await processJSONFile(filePath, dataType, errors);
      }
      
      await client.execute('COMMIT');
      
      // Clean up file
      fs.unlinkSync(filePath);
      
      res.status(201).json({
        message: `Bulk upload completed: ${processedCount} records processed`,
        processed: processedCount,
        errors: errors.length > 0 ? errors.slice(0, 5) : []
      });
      
    } catch (error) {
      await client.execute('ROLLBACK');
      throw error;
    }
    
  } catch (error) {
    console.error('Bulk upload error:', error);
    
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      error: 'Bulk upload failed',
      details: error.message 
    });
  }
});

// Clear existing data helper
async function clearExistingData(client, dataType, platform) {
  let sql;
  
  switch (dataType.toLowerCase()) {
    case 'influencers':
      sql = platform ? 
        `DELETE FROM influencers WHERE platform = ?` : 
        `DELETE FROM influencers`;
      break;
    case 'campaigns':
      sql = platform ? 
        `DELETE FROM campaigns WHERE platform = ?` : 
        `DELETE FROM campaigns`;
      break;
    case 'demographics':
      sql = platform ? 
        `DELETE FROM demographics WHERE platform = ?` : 
        `DELETE FROM demographics`;
      break;
    default:
      throw new Error(`Cannot clear data for type: ${dataType}`);
  }
  
  if (platform) {
    await client.execute(sql, [platform]);
  } else {
    await client.execute(sql);
  }
}

// Get upload templates
router.get('/template/:dataType', (req, res) => {
  const { dataType } = req.params;
  
  const templates = {
    influencers: {
      csv: 'name,projects,followers,platform,email,phone,location,category,engagement_rate,verified\n"John Doe",5,"100K","Instagram","john@example.com","+1234567890","New York","Fashion",5.2,true',
      headers: ['name', 'projects', 'followers', 'platform', 'email', 'phone', 'location', 'category', 'engagement_rate', 'verified']
    },
    campaigns: {
      csv: 'name,platform,status,start_date,end_date,budget,reach,impressions,clicks,conversions\n"Summer Campaign","Instagram","active","2024-06-01","2024-08-31",10000,50000,100000,5000,500',
      headers: ['name', 'platform', 'status', 'start_date', 'end_date', 'budget', 'reach', 'impressions', 'clicks', 'conversions']
    },
    demographics: {
      csv: 'platform,age_group,gender,location,percentage,total_users\n"Instagram","18-24","Female","US",25.5,1000',
      headers: ['platform', 'age_group', 'gender', 'location', 'percentage', 'total_users']
    }
  };
  
  const template = templates[dataType.toLowerCase()];
  if (!template) {
    return res.status(404).json({ error: 'Template not found for data type' });
  }
  
  res.json(template);
});

module.exports = router;
