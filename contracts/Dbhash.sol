pragma solidity ^0.4.18;

import './modifiers/Ownable.sol';


contract Dbhash is Ownable {

    mapping(uint => uint) public hashes;
    mapping(uint => uint) public timestamps;

    event HashStored(uint indexed _timestamp, uint indexed _hash);

    function Dbhash() public {}

    function pushHash(uint256 h) onlyOwner public {
        require(h>0);
        require(hashes[h]==0);
        
        uint timestamp = now;

        timestamps[timestamp] = h;
        hashes[h] = timestamp;
        HashStored(timestamp,h);
    } 

    function lookup (uint256 h) public view returns(uint) {
        require(h>0);
        require(hashes[h]>0);
        return hashes[h];
    }

    function lookupByDate (uint256 ts) public view returns(uint) {
        require(ts>0);
        return timestamps[ts];
    }
}