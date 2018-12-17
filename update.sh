#!/bin/bash
cd "$(dirname "$0")"
oldAllParts=$(grep -m2 "version" app/assets/distribution.json | tail -n1 | awk -F "\"*:\"*" '{print $2}' | sed 's/"//g' |sed 's/\,//g' | sed 's/ //g')
oldFirstPart=$(grep -m2 "version" app/assets/distribution.json | tail -n1 | awk -F "\"*:\"*" '{print $2}' | sed 's/"//g' |sed 's/\,//g' | sed 's/ //g' | awk -F "\." '{print $1}')
oldSecondPart=$(grep -m2 "version" app/assets/distribution.json | tail -n1 | awk -F "\"*:\"*" '{print $2}' | sed 's/"//g' |sed 's/\,//g' | sed 's/ //g' | awk -F "\." '{print $2}')
oldThirdPart=$(grep -m2 "version" app/assets/distribution.json | tail -n1 | awk -F "\"*:\"*" '{print $2}' | sed 's/"//g' |sed 's/\,//g' | sed 's/ //g' | awk -F "\." '{print $3}')
newThirdPart=$((oldThirdPart + 1))
newAllParts="$oldFirstPart.$oldSecondPart.$newThirdPart"
echo "Old Minor Distribution Version: "$oldAllParts
node mods.js;
jsonlint -i app/assets/distribution.json
sed -i "s/$oldAllParts/$newAllParts/g" app/assets/distribution.json
echo "New Major Distribution Version: "$newAllParts
bash push.sh;
