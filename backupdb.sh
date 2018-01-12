#!/bin/bash
set -e

echo
echo GET BACKUPS 
echo
BACKUPS=$(heroku pg:backups -a driver-admin-live | grep '^a... ' | awk '/Completed/' | awk '{print $1}')
#LATEST_BACKUP=$(echo $BACKUPS | awk '{print $1}')
LATEST_BACKUP="b086"

BACKUP_URL=$(heroku pg:backups:url $LATEST_BACKUP -a driver-admin-live)
curl $BACKUP_URL > rawdata

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
#TODO check the result

#echo GZIP
#echo
#not needed... only 1% gain on a 4gb file with best compress....
#gzip -f rawdata 

echo 
echo  UPLOAD TO AWS 
echo 
aws s3 cp ./rawdata s3://yojee-db-backup/"$STR".dump
