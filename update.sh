#!/bin/bash
cd "$(dirname "$0")"
node mods.js;
cat app/assets/distribution.json;
bash push.sh;
