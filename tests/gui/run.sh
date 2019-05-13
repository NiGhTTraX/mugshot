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
# TODO: also run in firefox
COVERAGE=1 BROWSER=chrome npm run _test:gui
RESULT=$?
set -e

if [[ ${RESULT} != 0 ]]; then
  echo Selenium logs:
  docker-compose logs selenium
fi

exit ${RESULT}
