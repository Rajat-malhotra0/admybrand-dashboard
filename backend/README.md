# Dashboard Backend API

A simple Express.js backend API for managing dashboard data with a test interface.

## Features

- RESTful API endpoints for dashboard data
- In-memory data storage (easily replaceable with a database)
- Interactive web interface for testing
- CORS enabled for frontend integration
- Full CRUD operations for most data types

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

4. The server will start on port 5000 by default
   - API Base URL: `http://localhost:5000`
   - Test Interface: `http://localhost:5000`

## API Endpoints

### Dashboard Data
- `GET /api/dashboard` - Get all dashboard data

### Campaign Statistics
- `GET /api/campaign-stats` - Get all campaign stats
- `POST /api/campaign-stats` - Add new campaign stat
- `PUT /api/campaign-stats/:id` - Update campaign stat
- `DELETE /api/campaign-stats/:id` - Delete campaign stat

### Influencers
- `GET /api/influencers` - Get all influencers
- `POST /api/influencers` - Add new influencer
- `PUT /api/influencers/:id` - Update influencer
- `DELETE /api/influencers/:id` - Delete influencer

### Demographics
- `GET /api/demographics` - Get demographics data
- `PUT /api/demographics/:id` - Update demographic entry

### Interests
- `GET /api/interests` - Get interests data
- `PUT /api/interests/:id` - Update interest entry

### System
- `POST /api/reset` - Reset all data to default values

## Data Structure

### Campaign Stat
```json
{
  "id": 1,
  "title": "Total Likes",
  "value": "350,809",
  "icon": "thumbs-up"
}
```

### Influencer
```json
{
  "id": 1,
  "name": "Malik Wiwoho",
  "projects": 23,
  "followers": "1,620,201"
}
```

### Demographics
```json
{
  "id": 1,
  "label": "18-24",
  "value": 28,
  "color": "rgb(59, 130, 246)"
}
```

### Interest
```json
{
  "id": 1,
  "label": "Technology",
  "value": 85
}
```

## Test Interface

The backend includes a built-in web interface for testing all endpoints:
- Visit `http://localhost:5000` after starting the server
- Interactive forms for adding/editing data
- Real-time data viewing
- Reset functionality for testing

## Integration with Frontend

To connect your Next.js frontend:

1. Update your frontend components to fetch data from the API
2. Replace hardcoded data with API calls
3. Handle loading states and errors appropriately

Example fetch call:
```javascript
const response = await fetch('http://localhost:5000/api/campaign-stats');
const data = await response.json();
```

## Environment Variables

- `PORT` - Server port (default: 5000)

## Future Enhancements

- Database integration (MongoDB, PostgreSQL, etc.)
- Authentication and authorization
- Data validation with Joi or Yup
- Rate limiting
- Logging with Winston
- Unit and integration tests
