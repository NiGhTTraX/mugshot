#!/usr/bin/env bash

set -e

cd "$( dirname "${BASH_SOURCE[0]}" )"

# --silent so we don't get the npm err epilogue.
npm run test:node:coverage --silent
npm run test:gui --silent

cp ./gui/results/coverage/*.json ../.nyc_output/
../node_modules/.bin/ts-node ./coverage.ts

# nyc will create the report relative to cwd so we need to be in root.
cd ..

node_modules/.bin/nyc report
node_modules/.bin/nyc check-coverage
