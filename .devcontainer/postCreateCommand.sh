#!/bin/bash

# Bump npm version
echo "===> Upgrading npm to 11.0.0"
npm install -g npm@11.0.0

# Install dependencies
echo "===> Installing dependencies"
npm install

echo "===> Done!"
