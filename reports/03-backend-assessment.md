# Backend Assessment Report

This report provides a comprehensive assessment of the backend architecture, focusing on Express routes, Turso schema, validation, error handling, and potential N+1 risks.

## 1. Express Routes and Code Structure

### Current State

- The main application logic is in `backend/server.js` and `backend/routes/upload.js`, with route handlers defined directly within these files.
- The code lacks a clear separation of concerns, with business logic, data access, and request/response handling mixed together.
- A significant amount of in-memory data is hardcoded in `server.js`, making the application stateful and difficult to scale or maintain.

### Recommendations

- **Introduce a Controller/Service Layer:** Refactor the route handlers into separate controller and service layers. Controllers should handle HTTP requests and responses, while services contain the core business logic.
- **Centralize Route Definitions:** Consolidate all route definitions into the `backend/routes` directory, organized by resource (e.g., `influencers.js`, `campaigns.js`).
- **Eliminate In-Memory Data:** Replace all in-memory data with database queries to ensure a single source of truth and improve data consistency.

## 2. Turso Schema and Database

### Current State

- The database schema is defined in `lib/database/schema.sql` and initialized using a script (`backend/scripts/init-db.js`).
- The schema includes tables for `influencers`, `campaigns`, and `demographics`, with basic indexing on some columns.
- There is no formal migration system in place, making it difficult to manage schema changes over time.

### Recommendations

- **Implement a Migration System:** Adopt a migration library like `node-pg-migrate` or `db-migrate` to manage schema evolution in a structured and version-controlled manner.
- **Use Parameterized Queries:** Consistently use parameterized queries to prevent SQL injection vulnerabilities. The current implementation uses them in some places but not all.
- **Optimize Indexing Strategy:** Review and optimize the indexing strategy based on common query patterns. For example, consider composite indexes for frequently filtered columns.

## 3. Validation and Error Handling

### Current State

- Zod is used for schema validation in `backend/routes/upload.js` and for some direct insertion endpoints in `server.js`, but it is not applied consistently across all routes.
- Error handling is managed within individual route handlers using `try...catch` blocks, leading to code duplication and inconsistent error responses.

### Recommendations

- **Centralize Validation with Middleware:** Create a validation middleware using Zod or `express-validator`. This will centralize validation logic, reduce boilerplate code in controllers, and ensure consistent validation across all endpoints.
- **Implement Centralized Error Handling:** Create a dedicated error-handling middleware to catch all errors and send standardized, user-friendly error responses. This will improve maintainability and provide a better developer experience.

## 4. N+1 Risks and Performance

### Current State

- The `/api/platform-data` endpoint in `server.js` fetches all campaigns for a given country and then processes them in memory, which can be inefficient for large datasets.
- The file upload process in `backend/routes/upload.js` reads the entire file into memory and inserts data row by row, which can lead to N+1 query issues and excessive memory consumption.

### Recommendations

- **Optimize Database Queries:**
  - For the `/api/platform-data` endpoint, perform data aggregation directly in the database using SQL `GROUP BY` and aggregate functions instead of processing it in the application.
  - For bulk data uploads, use a more efficient insertion strategy, such as `INSERT ... SELECT` from a temporary table or a bulk insert feature if the database driver supports it.
- **Implement Pagination:** Add pagination to all endpoints that return lists of data to prevent performance degradation as the dataset grows.

## 5. Detailed Implementation Recommendations

### A. Controller/Service Layer Structure

```javascript
// backend/controllers/influencerController.js
const influencerService = require('../services/influencerService');
const { validateInfluencer } = require('../middleware/validation');

class InfluencerController {
  async getAllInfluencers(req, res, next) {
    try {
      const { page = 1, limit = 10, platform } = req.query;
      const result = await influencerService.getInfluencers({ page, limit, platform });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async createInfluencer(req, res, next) {
    try {
      const influencer = await influencerService.createInfluencer(req.body);
      res.status(201).json(influencer);
    } catch (error) {
      next(error);
    }
  }
}
```

### B. Validation Middleware Implementation

```javascript
// backend/middleware/validation.js
const { z } = require('zod');

const influencerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  projects: z.number().int().min(0, 'Projects must be non-negative'),
  followers: z.string().min(1, 'Followers is required'),
  platform: z.string().optional().default('General'),
  email: z.string().email().optional(),
  engagement_rate: z.number().min(0).max(100).optional().default(0),
  verified: z.boolean().optional().default(false)
});

const validate = (schema) => {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }
  };
};

module.exports = {
  validateInfluencer: validate(influencerSchema),
  validate
};
```

### C. Centralized Error Handling

```javascript
// backend/middleware/errorHandler.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (error, req, res, next) => {
  let { statusCode = 500, message } = error;

  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
  }

  if (process.env.NODE_ENV === 'development') {
    console.error(error);
  }

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

module.exports = { AppError, errorHandler };
```

### D. Optimized Database Queries

```javascript
// backend/services/campaignService.js
const { getTursoClient } = require('../lib/database/turso');

class CampaignService {
  async getAggregatedStats(country, platform) {
    const client = getTursoClient();
    
    let query = `
      SELECT 
        SUM(reach) as total_reach,
        SUM(impressions) as total_impressions,
        SUM(clicks) as total_clicks,
        SUM(conversions) as total_conversions,
        COUNT(*) as active_campaigns,
        AVG(CASE WHEN impressions > 0 THEN (clicks * 100.0 / impressions) END) as avg_ctr,
        AVG(CASE WHEN clicks > 0 THEN (conversions * 100.0 / clicks) END) as avg_cvr
      FROM campaigns 
      WHERE status = 'active'
    `;
    
    const params = [];
    
    if (country) {
      query += ' AND country = ?';
      params.push(country);
    }
    
    if (platform) {
      query += ' AND platform = ?';
      params.push(platform);
    }
    
    const result = await client.execute(query, params);
    return result.rows[0];
  }
}
```

### E. Migration System Implementation

```javascript
// backend/migrations/001_create_influencers.js
module.exports = {
  up: async (client) => {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS influencers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        projects INTEGER NOT NULL DEFAULT 0,
        followers TEXT NOT NULL DEFAULT '0',
        platform TEXT NOT NULL DEFAULT 'General',
        email TEXT,
        engagement_rate REAL DEFAULT 0.0,
        verified BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.execute(`
      CREATE INDEX IF NOT EXISTS idx_influencers_platform ON influencers(platform)
    `);
  },
  
  down: async (client) => {
    await client.execute('DROP TABLE IF EXISTS influencers');
  }
};
```

### F. Bulk Insert Optimization

```javascript
// backend/services/bulkImportService.js
class BulkImportService {
  async bulkInsertInfluencers(data) {
    const client = getTursoClient();
    
    // Begin transaction
    await client.execute('BEGIN TRANSACTION');
    
    try {
      // Create temporary table
      await client.execute(`
        CREATE TEMPORARY TABLE temp_influencers (
          name TEXT,
          projects INTEGER,
          followers TEXT,
          platform TEXT
        )
      `);
      
      // Batch insert into temporary table
      const batchSize = 100;
      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        const placeholders = batch.map(() => '(?, ?, ?, ?)').join(', ');
        const values = batch.flatMap(item => [item.name, item.projects, item.followers, item.platform]);
        
        await client.execute(
          `INSERT INTO temp_influencers VALUES ${placeholders}`,
          values
        );
      }
      
      // Insert from temporary table to main table
      await client.execute(`
        INSERT INTO influencers (name, projects, followers, platform)
        SELECT name, projects, followers, platform
        FROM temp_influencers
      `);
      
      await client.execute('COMMIT');
    } catch (error) {
      await client.execute('ROLLBACK');
      throw error;
    }
  }
}
```

## 6. Security Improvements

### Current Risks
- No authentication or authorization mechanisms
- File uploads without proper sanitization
- Potential for SQL injection in some queries
- Missing rate limiting

### Recommendations
- Implement JWT-based authentication
- Add role-based access control (RBAC)
- Implement file upload sanitization and virus scanning
- Add rate limiting middleware
- Use HTTPS in production
- Implement CORS properly with specific origins

## 7. Testing Strategy

### Recommendations
- Unit tests for services and utilities
- Integration tests for API endpoints
- Database migration tests
- Load testing for bulk operations

```javascript
// Example test structure
// backend/tests/services/influencerService.test.js
const { InfluencerService } = require('../../services/influencerService');

describe('InfluencerService', () => {
  describe('createInfluencer', () => {
    it('should create an influencer with valid data', async () => {
      // Test implementation
    });
    
    it('should throw validation error for invalid data', async () => {
      // Test implementation
    });
  });
});
```

By implementing these recommendations, the backend will be more maintainable, secure, and scalable, following industry best practices for Node.js/Express applications.

