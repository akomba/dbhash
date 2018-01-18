require('babel-register');
require('babel-polyfill');
var priv=require('./pkey');

var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = priv.mnemonic;

module.exports = {
  networks:{
    development:{
      //needs to run ganache
      host: '127.0.0.1',
      port: 7545,
      network_id: '5777'
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/nxUHdwQCRve60oHdiTge")
      },
      network_id: 3
    },
    live: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://mainnet.infura.io/nxUHdwQCRve60oHdiTge")
      },
      network_id: 1
    },
  }
};
