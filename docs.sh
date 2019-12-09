#!/usr/bin/env bash

set -e

doctoc --title '**Table of content**' README.md

typedoc

# Replace all relative links with absolute links to gh-pages.
# We want the relative ones in README.md so we can get IDE analysis of
# broken links.
sed -i 's/\.\/docs/http:\/\/nighttrax.github.io\/mugshot/g' docs/index.html
