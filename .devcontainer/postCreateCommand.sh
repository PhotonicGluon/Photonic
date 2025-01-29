#!/bin/bash

# Install dependencies
echo "===> Installing dependencies"
npm install

# Disable telemetry
npx astro telemetry disable

echo "===> Done!"
