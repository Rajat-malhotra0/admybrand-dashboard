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

export const handler = async () => {
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
    
    return {
      statusCode: 200,
      body: JSON.stringify({ countries }),
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to fetch countries with data',
        details: error instanceof Error ? error.message : 'Unknown error',
        countries: []
      }),
    };
  }
};
