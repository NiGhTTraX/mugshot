#!/usr/bin/env bash

set -e

doctoc --title '**Table of content**' README.md DOCS.md

typedoc

# Fix basepath of links: the READMEs reference ./docs from the root
# but the READMEs get copied to ./docs and that gets deployed.
# ./docs/foo => ./foo
sed -i 's/\.\/docs/\./g' docs/index.html
