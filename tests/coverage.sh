#!/usr/bin/env bash

set -e

cd "$( dirname "${BASH_SOURCE[0]}" )"
cd ..

rm -rf .nyc_output tests/results
mkdir .nyc_output

k=0
for i in packages/**/tests/results/coverage-*.json; do
  cp $i .nyc_output/$k
  k=$((k+1))
done

nyc report
nyc check-coverage
