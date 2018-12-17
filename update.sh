#!/bin/bash
cd "$(dirname "$0")"
version=$(grep -m2 "version" app/assets/distribution.json | tail -n1 | awk -F "\"*:\"*" '{print $2}' | sed 's/"//g' |sed 's/\,//g' | sed 's/ //g')
echo "Old Distribution Version: "$version
node mods.js;
jsonlint -i app/assets/distribution.json
echo "New Distribution Version: "$version
bash push.sh;
