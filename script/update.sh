#!/bin/bash
# should be run after pulling upstream changes to update local dev environment

set -e

npm install
npm prune

npm run migrate
npm run migrate -- -e 'test'

psql podqueue-dev -U podqueue -f script/seed.sql

