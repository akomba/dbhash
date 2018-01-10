# dbhash

## Setup
* Install truffle
* Install ganache
* Start ganache
* npm install
* truffle compile
* truffle migrate

## Note
The current truffle.js file uses port 7545, so you need to start ganache on that port.

## Basic usage
* start `truffle console`
* `Dbhash.deployed().then(function(i){dbh=i})`
* To push a new hash (12345 is just a random test value):
  * `dbh.pushHash(12345)`
* To see if a hash exists:
  * `dbh.lookup(12345)`
