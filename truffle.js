require('babel-register');
require('babel-polyfill');

var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "interest drip board change purity bulk tell surprise seek long across cube";

module.exports = {
  networks:{
    development:{
      //needs to run ganache
      host: 'localhost',
      port: 7545,
      network_id: '5777'
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/nxUHdwQCRve60oHdiTge")
      },
      network_id: 3,
      gas: 4600000
    }
  }
};
