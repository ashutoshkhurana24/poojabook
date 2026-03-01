#!/usr/bin/env node
'use strict';

// Prisma generate requires DATABASE_URL in the schema; use a dummy during build if unset (e.g. on Vercel).
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://dummy:dummy@localhost:5432/dummy';
}

const { execSync } = require('child_process');

execSync('npx prisma generate', { stdio: 'inherit' });
execSync('npx next build', { stdio: 'inherit' });
