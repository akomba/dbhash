require('babel-register');
require('babel-polyfill');
module.exports = {
  networks:{
    development:{
      //needs to run ganache
      host: 'localhost',
      port: 7545,
      network_id: '5777'
    }
  }
};
