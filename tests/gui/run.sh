#!/usr/bin/env bash

trap cleanup EXIT
cleanup() {
  ../../packages/selenium/scripts/index.sh stop
}

set -e

cd "$( dirname "${BASH_SOURCE[0]}" )"

../../packages/selenium/scripts/index.sh start 4

BROWSERS=(chrome firefox)

for browser in "${BROWSERS[@]}"; do
  BROWSER=${browser} npm run _test:gui
  cp results/coverage-final.json ../../.nyc_output/${browser}.json
done
