#!/bin/bash

trap cleanup EXIT
cleanup() {
  docker-compose down -v
}

set -e

cd "$( dirname "${BASH_SOURCE[0]}" )"

# Create this ourselves so that Docker doesn't fuck it up.
mkdir -p screenshots

docker-compose build

# --force-recreate and --remove-orphans in case we've run a debug instance
# before and it left things behind.
docker-compose up -d --force-recreate --remove-orphans selenium

./wait-for-nodes.sh 2

set +e
COVERAGE=1 BROWSER=chrome npm run _test:gui
CHROME_RESULT=$?
set -e

set +e
COVERAGE=1 BROWSER=firefox npm run _test:gui
FIREFOX_RESULT=$?
set -e

# This assuming that we won't get -1 + 1.
RESULT=$(($CHROME_RESULT + $FIREFOX_RESULT))

if [[ ${RESULT} != 0 ]]; then
  echo Selenium logs:
  docker-compose logs selenium
fi

exit ${RESULT}
