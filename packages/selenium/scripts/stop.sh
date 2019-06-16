#!/usr/bin/env bash

cd "$( dirname "${BASH_SOURCE[0]}" )"

COMPOSE_PROJECT_NAME=mugshot docker-compose -f ./docker-compose.yml down
COMPOSE_PROJECT_NAME=mugshot:debug docker-compose -f ./docker-compose.debug.yml down
