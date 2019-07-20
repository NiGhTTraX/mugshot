#!/usr/bin/env bash

set -e

cd "$( dirname "${BASH_SOURCE[0]}" )"

# nyc will create the report relative to cwd so we need to be in root.
cd ..

rm -rf .nyc_output tests/results tests/node/results tests/gui/results
mkdir .nyc_output

# --silent so we don't get the npm err epilogue.
npm run test:node --silent
npm run test:gui --silent

cp tests/node/results/coverage-final.json .nyc_output/node.json

npx nyc report
npx nyc check-coverage
