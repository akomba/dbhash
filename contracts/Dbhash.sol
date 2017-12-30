pragma solidity ^0.4.18;

import './modifiers/Ownable.sol';


contract Dbhash is Ownable {

    mapping(uint256 => bool) public hashes;

    function Dbhash() public {}

    function pushHash(uint256 h) onlyOwner public {
        require(!lookup(h));
        hashes[h] = true;
    } 

    function lookup (uint256 h) public view returns(bool) {
        return hashes[h];
    }
}