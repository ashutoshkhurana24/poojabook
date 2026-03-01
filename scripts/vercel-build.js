#!/usr/bin/env node
'use strict';

const { execSync } = require('child_process');

console.log('Running prisma generate...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
} catch (e) {
  console.log('Prisma generate failed, continuing...');
}

console.log('Running next build...');
execSync('npx next build', { stdio: 'inherit' });
