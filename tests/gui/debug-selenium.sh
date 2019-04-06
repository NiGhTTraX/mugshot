#!/usr/bin/env bash

set -e

cd "$( dirname "${BASH_SOURCE[0]}" )"

# Check if the hub is already ready form a previous run.
set +e
./wait-for-nodes.sh 1 0 2>&1 > /dev/null
if [[ $? == 0 ]]; then
    echo Hub was already ready.
    exit 0
fi
set -e

docker-compose -f docker-compose.debug.yml build
docker-compose -f docker-compose.debug.yml up -d selenium

./wait-for-nodes.sh 1
