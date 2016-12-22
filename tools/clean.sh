#!/usr/bin/env bash
#Clears all of the JavaScript files out of the "Production" folder:
cd "`dirname $0`"/../production
find . -name "*.js" -type f -delete