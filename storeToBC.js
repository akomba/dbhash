var Web3=require('web3');
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

var web3=new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
var owner=web3.eth.accounts[0];
web3.eth.defaultAccount = owner;

var contract= web3.eth.contract(myAbi).at("0x345ca3e014aaf5dca488057592ee47305d9b3e10");
if(process.argv.length<3) return;

var hash=process.argv[2];
if(hash.indexOf("0x")!=0)hash="0x"+hash;
var tx=contract.pushHash(hash,{from:owner});

var filter=web3.eth.filter('latest', function(error, result){
  //console.log("f-err",error);
  //console.log("f-res",result);
  if(error || result){
    if (!error) {
      web3.eth.getTransactionReceipt(tx,function(e,r){
        if(e || r){
          if(!e){
           // console.log("rec",r);
            if(r.status){
              //console.log("success!",r.logs[0].topics.length);
              var evtSig=web3.sha3('HashStored(uint256,uint256)');
              if(r.logs[0].topics.length==3 && evtSig==r.logs[0].topics[0]){
                var timestamp=r.logs[0].topics[1];
                var hash=r.logs[0].topics[2];
                var d=new Date(Number(timestamp)*1000);
                console.log(hash+'_'+d);
              }
            }else{
              console.log("error");
            }
          }else{
            console.log("error");
          }
          filter.stopWatching();
        }
      })
    } else {
      console.error("error");
    }
    
  }
});
