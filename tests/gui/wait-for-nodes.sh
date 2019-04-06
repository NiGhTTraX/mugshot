#!/bin/bash

set -e

# How many browsers are we expecting to connect to the hub.
EXPECTED_BROWSERS=$1

# How many seconds should we wait for the browsers to connect?
WAIT=${2:-10}

# Selenium hub hostname.
HOST=${3:-localhost}

# Selenium hub port number.
PORT=${4:-4444}

nodes_connected() {
  set +e
  status=$(curl -X GET -s http://${1}:${2}/grid/api/hub/ \
    -d '{"configuration":["slotCounts"]}')

  if [ $? != 0 ]; then
    echo -1
    return
  fi
  set -e

  echo ${status} | python -c \
    'import json,sys;obj=json.load(sys.stdin);print obj["slotCounts"]["free"]'
}

echo Waiting for ${EXPECTED_BROWSERS} browsers to connect to the Selenium hub...

PINGS=0

while true; do
  if [ $(nodes_connected ${HOST} ${PORT}) -ge ${EXPECTED_BROWSERS} ]; then
    printf "\n"
    echo Hub is now ready.
    exit 0
  fi

  PINGS=$((PINGS+1))

  if [ ${PINGS} -gt ${WAIT} ] ; then
    printf "\n"
    echo Waited ${WAIT} seconds and the hub was still not ready. Exiting.
    exit 1
  fi

  printf "."
  sleep 1
done

