#!/bin/sh
geth --datadir ./ init ./work/genesis.json
geth --datadir ./ --networkid 88 --rpcport 8545 --rpc --rpcaddr 0.0.0.0 --rpcapi db,eth,net,web3,personal,admin,miner --mine --minerthreads 4 --etherbase 7df9a875a174b3bc565e6424a0050ebc1b2d1d82 --bootnodes enode://b2d4eab8033a590a49d4deff7ff1c6f502946db7c995a9da383e76588b16301a680ab5f802ad9a1c2c830856c0ee5a691800ea19dc3539842293744bf64588f0@172.19.0.254:30301
