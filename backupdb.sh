#!/bin/bash
set -e

if [ ! -f rawdata ]; then

echo
echo GET BACKUPS 
echo
BACKUPS=$(heroku pg:backups -a driver-admin-live | grep '^a... ' | awk '/Completed/' | awk '{print $1}')
LATEST_BACKUP=$(echo $BACKUPS | awk '{print $1}')
#LATEST_BACKUP="b086"

BACKUP_URL=$(heroku pg:backups:url $LATEST_BACKUP -a driver-admin-live)
curl $BACKUP_URL > rawdata

fi

echo 
echo  CREATE DIGEST 
echo 
HASH=$(shasum -a 256 -p ./rawdata)
echo $HASH

echo 
echo  STORE TO BLOCKCHAIN
echo 
STR=$(node storeToBC.js $HASH)

if [[ "$STR" == 'error' ]] || [[ "$STR" == "" ]]; then
   echo ERROR
   exit 1
fi

echo $STR

echo 
echo  UPLOAD TO AWS 
echo 
aws s3 cp ./rawdata s3://yojee-db-backup/"$STR".dump
rm -rf ./rawdata