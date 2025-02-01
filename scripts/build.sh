#!/bin/bash

echo "===> Running Astro build"
astro build || exit 1

echo "===> Removing \`info.json\` files"
find dist -wholename **/info.json -delete

echo "===> Done!"
