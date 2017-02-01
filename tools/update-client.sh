#!/usr/bin/env bash
# Copies the bundled front-end into the "src" directory of the project
# for testing.
cd "`dirname $0`"/../
rm -rf client && mkdir client
cd ~/Repositories
cp -r square1-web/client square1-api/src
