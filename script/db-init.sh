#!/bin/bash

# initialize dev database. Assumes that there's a postgres database on localhost at the default port, and
# that we have superuser access to that database. Tested on a mac with postgres from homebrew.

set -e

createuser -s podqueue
createdb -E UTF8 -O podqueue podqueue-dev
createdb -E UTF8 -O podqueue podqueue-test
