#!/usr/bin/env bash

cd "$( dirname "${BASH_SOURCE[0]}" )"

docker-compose -f ./docker-compose.yml -p mugshot down
docker-compose -f ./docker-compose.debug.yml -p mugshot:debug down
