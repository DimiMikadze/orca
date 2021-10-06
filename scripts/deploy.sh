#!/bin/bash

# CD into the repository directory.
cd /home/dimi/orca

# Pull the changes from the branch.
git pull origin main

# Install and build the packages.
yarn install
yarn build

# export PATH=~/.npm-global/bin:$PATH
# source ~/.profile

# Restart the apps.
pm2 restart pm2.config.json