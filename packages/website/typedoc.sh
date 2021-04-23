#!/usr/bin/env bash

set -e

typedoc --plugin typedoc-plugin-markdown --out docs/api/mugshot \
  --tsconfig ../mugshot/tsconfig.json --name Mugshot \
  ../mugshot/src
