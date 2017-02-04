#!/usr/bin/env bash
# Copies the bundled front-end into the "src" directory of the project
# for testing.
cd "`dirname $0`"/../src
rm -rf client && mkdir client

# This is to ensure the script works in Cloud9:
if [ -d "~/Repositories" ]; then
    cd ~/Repositories
else 
    cd ~/workspace
fi

cp -r square1-web/client square1-api/src
