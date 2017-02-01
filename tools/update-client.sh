#!/usr/bin/env bash
cd "`dirname $0`"/../
rm -rf client && mkdir client
cd ~/Repositories
cp -r square1-web/client square1-api
