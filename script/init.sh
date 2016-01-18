#!/bin/bash
# Initialize dev environment.
set -e

npm install
sh ./script/db-init.sh
