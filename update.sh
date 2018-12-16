#!/bin/bash
cd "$(dirname "$0")"
node mods.js;
jsonlint -i app/assets/distribution.json
bash push.sh;
