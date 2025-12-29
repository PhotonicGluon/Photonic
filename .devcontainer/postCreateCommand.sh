#!/bin/bash

# Install dependencies
echo "===> Installing dependencies"
pnpm install

# Disable telemetry
pnpm exec astro telemetry disable

echo "===> Done!"
