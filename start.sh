#!/bin/bash
set -e

echo "=== Installing server dependencies ==="
cd server
npm install

echo "=== Installing client dependencies ==="
cd ../client
npm install

echo "=== Building client ==="
npm run build

echo "=== Starting server ==="
cd ../server
node index.js
