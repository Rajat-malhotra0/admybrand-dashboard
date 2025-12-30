#!/usr/bin/env node

// Script to toggle between development and production mode
const fs = require('fs');
const path = require('path');

const isDev = process.argv.includes('--dev');
const isProd = process.argv.includes('--prod');

if (!isDev && !isProd) {
  console.log('Usage:');
  console.log('  node dev-mode.js --dev   # Enable development mode');
  console.log('  node dev-mode.js --prod  # Enable production mode');
  process.exit(1);
}

// Update next.config.js
const nextConfigPath = path.join(__dirname, 'next.config.js');
let nextConfig = fs.readFileSync(nextConfigPath, 'utf8');

if (isDev) {
  console.log('🔧 Enabling development mode...');
  nextConfig = nextConfig.replace(
    'output: "export", // Re-enabled for production',
    '// output: "export", // Disabled for local development'
  );
} else {
  console.log('🚀 Enabling production mode...');
  nextConfig = nextConfig.replace(
    '// output: "export", // Disabled for local development',
    'output: "export", // Re-enabled for production'
  );
}

fs.writeFileSync(nextConfigPath, nextConfig);

// Update .env.local
const envPath = path.join(__dirname, '.env.local');
let envContent = fs.readFileSync(envPath, 'utf8');

if (isDev) {
  envContent = envContent.replace(
    'NEXT_PUBLIC_API_BASE_URL=https://advmybrand.netlify.app/api',
    'NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api'
  );
  console.log('✅ Development mode enabled!');
  console.log('   - Static export disabled');
  console.log('   - API base URL set to localhost:3000');
  console.log('   - Run: npm run dev');
} else {
  envContent = envContent.replace(
    'NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api',
    'NEXT_PUBLIC_API_BASE_URL=https://advmybrand.netlify.app/api'
  );
  console.log('✅ Production mode enabled!');
  console.log('   - Static export enabled');
  console.log('   - API base URL set to Netlify functions');
  console.log('   - Run: npm run build');
}

fs.writeFileSync(envPath, envContent);
