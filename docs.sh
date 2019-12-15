#!/usr/bin/env bash

set -e

doctoc --title '**Table of content**' README.md DOCS.md

typedoc

sed -i 's/\.\/docs/\./g' docs/index.html
