#!/usr/bin/env bash

set -e

cd "$( dirname "${BASH_SOURCE[0]}" )"

./"$1".sh "${@:2}"
