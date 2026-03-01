#!/usr/bin/env node
'use strict';

const { execSync } = require('child_process');

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

console.log('Running next build...');
execSync('npx next build', { stdio: 'inherit' });
