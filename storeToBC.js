var Web3=require('web3');
var Tx=require('ethereumjs-tx');
var priv=require('./pkey');
var myAbi=[
    {
      "constant": true,
      "inputs": [
        {
          "name": "h",
          "type": "uint256"
        }
      ],
      "name": "lookup",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "hashes",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "h",
          "type": "uint256"
        }
      ],
      "name": "pushHash",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "timestamps",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "ts",
          "type": "uint256"
        }
      ],
      "name": "lookupByDate",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "_timestamp",
          "type": "uint256"
        },
        {
          "indexed": true,
          "name": "_hash",
          "type": "uint256"
        }
      ],
      "name": "HashStored",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    }
  ];

var web3=new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/nxUHdwQCRve60oHdiTge'));
var owner='0x3C9e71a9b2A07009BD2400746dA9a1e1080Ba293';
var pk=new Buffer(priv.key,'hex');
web3.eth.defaultAccount = owner;
var contractAddress='0x6ff7761a12ad0c2967c34cf5306ad5b48166865d';
var coder = require('web3/lib/solidity/coder');

if(process.argv.length<3) return;

var hash=process.argv[2];
if(hash.indexOf('0x')!=0)hash='0x'+hash;

var contract= web3.eth.contract(myAbi).at(contractAddress);
var fnSignature=web3.sha3('pushHash(uint256)').slice(0, 10); //0x
var nonce = web3.toHex(web3.eth.getTransactionCount(owner));
var gasPrice = web3.toHex(web3.eth.gasPrice); 
var gasLimitHex = web3.toHex(4600000);
var dataHex = fnSignature + coder.encodeParams(['uint256'], [hash]);

var rawTx={ 'nonce': nonce, 'gasPrice': gasPrice, 'gasLimit': gasLimitHex, 'from': owner, 'to': contractAddress, 'data': dataHex};
var tx= new Tx(rawTx);
tx.sign(pk);
var serializedTx = '0x'+tx.serialize().toString('hex');

web3.eth.sendRawTransaction(serializedTx, function(err, txHash){ 
  if(!err){
    var count=0;
    const handle = setInterval(() => {
      web3.eth.getTransactionReceipt(txHash,function(e, r){
              if(e || r){
                if(!e){
                  if(r.status=='0x1'){
                    var evtSig=web3.sha3('HashStored(uint256,uint256)');
                    if(r.logs[0].topics.length==3 && evtSig==r.logs[0].topics[0]){
                      var timestamp=r.logs[0].topics[1];
                      var hash=r.logs[0].topics[2];
                      var d=new Date(Number(timestamp)*1000);
                      console.log(hash+'_'+d);
                    }
                  }else{
                    console.log("error"); //status was 0x0
                  }
                }else{
                  console.log("error"); //tx receipt error
                }
                clearInterval(handle);
              }
            })
            count++; // TODO: cancel polling after xxx usuccesful tries
    },3000);
  }else{
    console.log("error"); //tx error
  }
});