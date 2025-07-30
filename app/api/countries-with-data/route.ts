import { NextResponse } from 'next/server';
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

export async function GET() {
  try {
    const client = getTursoClient();
    
    // Get unique countries that have data
    const query = `
      SELECT DISTINCT country 
      FROM campaigns 
      WHERE country IS NOT NULL 
        AND country != '' 
        AND country != 'global'
      ORDER BY country
    `;
    
    const result = await client.execute(query);
    const countries = result.rows.map((row: any) => String(row.country));
    
    return NextResponse.json({ countries });
  } catch (error) {
    console.error('API Error fetching countries with data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch countries with data', 
        details: error instanceof Error ? error.message : 'Unknown error',
        countries: [] // Return empty array as fallback
      },
      { status: 500 }
    );
  }
}
