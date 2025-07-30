// Local API handler for countries with data

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

export default async function handler(req, res) {
  try {
    const client = getTursoClient();
    
    const query = `
      SELECT DISTINCT country 
      FROM campaigns 
      WHERE country IS NOT NULL 
        AND country != '' 
        AND country != 'global'
      ORDER BY country
    `;
    
    const result = await client.execute(query);
    const countries = result.rows.map((row) => String(row.country));
    
    res.status(200).json({ countries });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      error: 'Failed to fetch countries with data',
      details: error instanceof Error ? error.message : 'Unknown error',
      countries: []
    });
  }
}
