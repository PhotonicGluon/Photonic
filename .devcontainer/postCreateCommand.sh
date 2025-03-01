#!/bin/bash

# Install dependencies
echo "===> Installing dependencies"
npm install --lock-only

# Disable telemetry
npx astro telemetry disable

echo "===> Done!"
