#!/usr/bin/env bash

set -e

cd "$( dirname "${BASH_SOURCE[0]}" )"

BROWSERS=(chrome firefox)

for browser in "${BROWSERS[@]}"; do
  echo Running tests in ${browser}...

  BROWSER=${browser} yarn run _test
  mv results/coverage-final.json results/coverage-${browser}.json
done
