#!/usr/bin/env bash

trap cleanup EXIT
cleanup() {
  ../../packages/gui-tests/src/stop.sh
}

set -e

cd "$( dirname "${BASH_SOURCE[0]}" )"

../../packages/gui-tests/src/start.sh

COVERAGE=1 BROWSER=chrome npm run _test:gui
COVERAGE=1 BROWSER=firefox npm run _test:gui
