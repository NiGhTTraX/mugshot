#!/usr/bin/env bash

set -e

cd "$( dirname "${BASH_SOURCE[0]}" )"

yarn run test:node
mv results/coverage-final.json results/coverage-node.json

BROWSERS=(chrome firefox)

for browser in "${BROWSERS[@]}"; do
  echo Running tests in ${browser}...

  BROWSER=${browser} yarn run test:gui
  mv results/coverage-final.json results/coverage-${browser}.json
done
