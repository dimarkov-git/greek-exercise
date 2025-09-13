#!/usr/bin/env bash
set -euo pipefail

PUBLISH_DIR=/Users/dmarkov/Projects/greek
HASH="$(git rev-parse --short HEAD)"

find "$PUBLISH_DIR" -name '*.html' -print0 | while IFS= read -r -d '' file; do
  perl -0 -i -pe "s{(href|src)=[\"'](?!https?:|//)([^\"']+\.(?:css|js))(?:\\?[^\"']*)?[\"']}{\1=\"\2?v=$HASH\"}g" "$file"
done
