#!/usr/bin/env bash

trap cleanup EXIT
cleanup() {
  ../../packages/selenium/scripts/index.sh stop
}

set -e

cd "$( dirname "${BASH_SOURCE[0]}" )"

../../packages/selenium/scripts/index.sh start

COVERAGE=1 BROWSER=chrome npm run _test:gui
COVERAGE=1 BROWSER=firefox npm run _test:gui
