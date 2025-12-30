const { createClient } = require('@libsql/client');

let client = null;

function getTursoClient() {
  if (!client) {
    // Use local SQLite database for development if no Turso credentials
    if (!process.env.TURSO_DATABASE_URL) {
      console.log('Using local SQLite database for development');
      client = createClient({
        url: 'file:local.db'
      });
    } else {
      if (!process.env.TURSO_AUTH_TOKEN) {
        throw new Error('TURSO_AUTH_TOKEN environment variable is not set');
      }

      console.log('🌐 Connecting to Turso cloud database:', process.env.TURSO_DATABASE_URL);
      client = createClient({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      });
      console.log('✅ Turso client created successfully');
    }
  }
  
  return client;
}

module.exports = { getTursoClient };
