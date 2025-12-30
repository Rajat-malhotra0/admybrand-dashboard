#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting deployment process...\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: package.json not found. Make sure you\'re in the project root directory.');
  process.exit(1);
}

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully\n');
  } catch (error) {
    console.error('❌ Error installing dependencies:', error.message);
    process.exit(1);
  }
}

// Run linting (optional, continue on error)
console.log('🔍 Running linter...');
try {
  execSync('npm run lint', { stdio: 'inherit' });
  console.log('✅ Linting passed\n');
} catch (error) {
  console.warn('⚠️ Linting warnings detected, continuing with build...\n');
}

// Build the project
console.log('🏗️ Building the project...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully\n');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Check if out directory was created
if (!fs.existsSync('out')) {
  console.error('❌ Error: Build output directory "out" not found.');
  process.exit(1);
}

// Get build stats
const outDir = path.join(process.cwd(), 'out');
const files = fs.readdirSync(outDir);
const totalSize = files.reduce((acc, file) => {
  const filePath = path.join(outDir, file);
  if (fs.statSync(filePath).isFile()) {
    return acc + fs.statSync(filePath).size;
  }
  return acc;
}, 0);

console.log('📊 Build Statistics:');
console.log(`   📁 Output directory: ${outDir}`);
console.log(`   📄 Files generated: ${files.length}`);
console.log(`   💾 Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB\n`);

console.log('🎉 Deployment preparation complete!\n');
console.log('Next steps:');
console.log('1. Push your code to GitHub/GitLab/Bitbucket');
console.log('2. Connect your repository to Netlify');
console.log('3. Or manually upload the "out" folder to Netlify\n');
console.log('📖 See DEPLOYMENT.md for detailed instructions');
