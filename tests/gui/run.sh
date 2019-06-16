#!/usr/bin/env bash

trap cleanup EXIT
cleanup() {
  ../../packages/selenium/scripts/stop.sh
}

set -e

cd "$( dirname "${BASH_SOURCE[0]}" )"

../../packages/selenium/scripts/start.sh

COVERAGE=1 BROWSER=chrome npm run _test:gui
COVERAGE=1 BROWSER=firefox npm run _test:gui
