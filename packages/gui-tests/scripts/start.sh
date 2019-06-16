#!/usr/bin/env bash

set -e

cd "$( dirname "${BASH_SOURCE[0]}" )"

# Clean up first.
./stop.sh

COMPOSE_PROJECT_NAME=mugshot docker-compose up -d selenium

./wait-for-nodes.sh 2
