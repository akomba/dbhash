'use strict';

import ether from './helpers/ether'
import expectThrow from './helpers/expectThrow';

var Dbhash = artifacts.require("Dbhash");

contract('Dbhash', function (accounts) {
  let owner=accounts[0];
  let notOwner=accounts[1];

  it('should store value of 1', async function() {
    let dbh  = await Dbhash.deployed();
    await dbh.pushHash(1);
  });

  it('should throw if not the owner calls it', async function() {
    let dbh  = await Dbhash.deployed();
    await expectThrow(dbh.pushHash(2,{from:notOwner}));
  });

  it('should throw if we want to store same value twice', async function() {
    let dbh  = await Dbhash.deployed();
    await expectThrow(dbh.pushHash(1));
  });

  it('should read value of 1', async function() {
    let dbh  = await Dbhash.deployed();
    let res = await dbh.lookup(1);
    assert(res>0);
  });

  it('should read value of 2', async function() {
    let dbh  = await Dbhash.deployed();
    await expectThrow( dbh.lookup(2))
  });

  it('should everybody can read values', async function() {
    let dbh  = await Dbhash.deployed();
    let res = await dbh.lookup(1,{from:notOwner});
    assert(res>0);
  });
});
