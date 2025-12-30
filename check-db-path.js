const path = require('path');
const { getTursoClient } = require('./backend/src/database/lib/database/turso');

// Create a simple test to see which database file is being used
console.log('Current working directory:', process.cwd());
console.log('Absolute path to local.db:', path.resolve('local.db'));
console.log('File exists:', require('fs').existsSync(path.resolve('local.db')));

// Initialize the database client to see which file it uses
const client = getTursoClient();
console.log('Database client initialized');
