#!/usr/bin/env bash

trap cleanup EXIT
cleanup() {
  ../../packages/selenium/scripts/index.sh stop
}

set -e

cd "$( dirname "${BASH_SOURCE[0]}" )"

NODES=4
if npx is-ci ; then
  NODES=1
fi
../../packages/selenium/scripts/index.sh start ${NODES}

BROWSERS=(chrome firefox)

for browser in "${BROWSERS[@]}"; do
  if npx is-ci ; then
    BROWSER=${browser} npm run _test:gui -- --runInBand
  else
    BROWSER=${browser} npm run _test:gui -- --maxWorkers=${NODES}
  fi

  cp results/coverage-final.json ../../.nyc_output/${browser}.json
done
