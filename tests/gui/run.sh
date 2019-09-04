#!/usr/bin/env bash

trap cleanup EXIT
cleanup() {
  npx @tdd-buffet/selenium stop
}

set -e

cd "$( dirname "${BASH_SOURCE[0]}" )"

NODES=4
if npx is-ci ; then
  NODES=1
fi

npx @tdd-buffet/selenium start ${NODES} --html fixtures

BROWSERS=(chrome firefox)

for browser in "${BROWSERS[@]}"; do
  if npx is-ci ; then
    BROWSER=${browser} yarn run _test:gui --runInBand
  else
    BROWSER=${browser} yarn run _test:gui --maxWorkers=${NODES}
  fi

  cp results/coverage-final.json ../../.nyc_output/${browser}.json
done
