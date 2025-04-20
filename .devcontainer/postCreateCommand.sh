#!/bin/bash

# Install dependencies
echo "===> Installing dependencies"
npm install --loglevel info

# Disable telemetry
npx astro telemetry disable

echo "===> Done!"
