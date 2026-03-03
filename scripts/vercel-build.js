#!/usr/bin/env node
'use strict';

const { execSync } = require('child_process');

// Check if running on Vercel (VERCEL env var is always set during Vercel builds)
const isVercel = !!process.env.VERCEL;

// Skip db operations on Vercel to avoid connection pool exhaustion on Supabase
// The database is already seeded from the first deployment
if (isVercel) {
  console.log('Running on Vercel - skipping db push and seed');
  
  // Still run prisma generate
  try {
    console.log('Running prisma generate...');
    execSync('npx prisma generate', { stdio: 'inherit' });
  } catch (e) {
    console.log('Prisma generate warning, continuing...');
  }
  
  console.log('Running next build...');
  try {
    execSync('npx next build', { stdio: 'pipe', encoding: 'utf8' });
  } catch (error) {
    console.log('=== BUILD ERROR ===');
    console.log('stdout:', error.stdout);
    console.log('stderr:', error.stderr);
    console.log('message:', error.message);
    throw error;
  }
  process.exit(0);
}

// Add connection_limit=5 to DATABASE_URL to prevent connection pool exhaustion
if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('connection_limit')) {
  const separator = process.env.DATABASE_URL.includes('?') ? '&' : '?';
  process.env.DATABASE_URL = process.env.DATABASE_URL + separator + 'connection_limit=5';
  console.log('Added connection_limit=5 to DATABASE_URL');
}

// Set dummy DATABASE_URL if not set (required for prisma generate)
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://dummy:dummy@localhost:5432/dummy';
  console.log('Using dummy DATABASE_URL for build');
}

try {
  console.log('Running prisma generate...');
  execSync('npx prisma generate', { stdio: 'inherit' });
} catch (e) {
  console.log('Prisma generate warning, continuing...');
}

if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('dummy')) {
  try {
    console.log('Running prisma db push...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    
    console.log('Running database seed...');
    execSync('npx ts-node -O \'{"module":"CommonJS"}\' prisma/seed.ts', { 
      stdio: 'inherit',
      timeout: 120000 
    });
  } catch (e) {
    console.log('Database seed warning, continuing...');
  }
} else {
  console.log('Skipping db push and seed (using dummy DATABASE_URL)');
}

console.log('Running next build...');
try {
  execSync('npx next build', { stdio: 'pipe', encoding: 'utf8' });
} catch (error) {
  console.log('=== BUILD ERROR ===');
  console.log('stdout:', error.stdout);
  console.log('stderr:', error.stderr);
  console.log('message:', error.message);
  throw error;
}
