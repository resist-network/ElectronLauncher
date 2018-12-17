#!/bin/bash
cd "$(dirname "$0")"
oldVersion=$(grep -m2 "version" app/assets/distribution.json | tail -n1 | awk -F "\"*:\"*" '{print $2}' | sed 's/"//g' |sed 's/\,//g' | sed 's/ //g' | awk -F "\." '{print $3}')
newVersion=$((oldVersion + 1))
echo "Old Distribution Version: "$oldVersion
node mods.js;
jsonlint -i app/assets/distribution.json
echo "New Distribution Version: "$newVersion
bash push.sh;
