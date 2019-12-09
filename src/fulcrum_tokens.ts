export class pTokenInfo {
   address: string
   leverage: number
   type: boolean
}

export class pToken {
   symbol: string
   tokenAddress: string
   pTokens: pTokenInfo[]
}

export let PTOKENS: Array<pToken> = [
   {
      "symbol": "ETH",
      "tokenAddress": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      "pTokens": [
         {
            "address": "0x29838a8f16ea5d23df476f1b1dab62fce7883a6b",
            "leverage": 1,
            "type": true
         },
         {
            "address": "0x840d872c6aced0dc5ccd72a7c7bf71496bbc6c40",
            "leverage": 2,
            "type": true
         },
         {
            "address": "0x4ef522f0de44946e3eea716fa071c12e89d30774",
            "leverage": 2,
            "type": false
         },
         {
            "address": "0x2c6b9bbb0b17cf86b687f418f1d34fa92d15f6fc",
            "leverage": 3,
            "type": true
         },
         {
            "address": "0x19a5c979e96823a79f05d3e7658ddbc2d50bd326",
            "leverage": 3,
            "type": false
         },
         {
            "address": "0xe650c2aa677935fb10c5e09ffa9ad97d1fbc4e9f",
            "leverage": 4,
            "type": true
         },
         {
            "address": "0x8efe972de7ee0441d1e01fb0c84ea900fd1770d0",
            "leverage": 4,
            "type": false
         }
      ]
   },
   {
      "symbol": "WBTC",
      "tokenAddress": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
      "pTokens": [
         {
            "address": "0x9fc208947d92b1588f7bde245620439568a8587a",
            "leverage": 1,
            "type": true
         },
         {
            "address": "0x671c7886c61a18fc6e94893a791eaa069d70eba7",
            "leverage": 2,
            "type": true
         },
         {
            "address": "0x9fe6854447bb39dc8b78960882831269f9e78408",
            "leverage": 2,
            "type": false
         },
         {
            "address": "0x849548f5d966017b6b49f6a3a740bbdb78176edb",
            "leverage": 3,
            "type": true
         },
         {
            "address": "0x6d08b86002221dc2fe4e27170ff90e1b92de3254",
            "leverage": 3,
            "type": false
         },
         {
            "address": "0x2fc9f52240f68ef0f178e1b896435d8f64a8dfaa",
            "leverage": 4,
            "type": true
         },
         {
            "address": "0x4f4d523c69a47c5c3ef06c53ec64801f11a884dd",
            "leverage": 4,
            "type": false
         }
      ]
   },
   {
      "symbol": "ZRX",
      "tokenAddress": "0xe41d2489571d322189246dafa5ebde1f4699f498",
      "pTokens": [
         {
            "address": "0xdf0d727742a8a9eacfc3305c687a0d21826dae7e",
            "leverage": 1,
            "type": true
         },
         {
            "address": "0xe18e1789b96fef7369095de1303c3acdcf03775a",
            "leverage": 2,
            "type": true
         },
         {
            "address": "0x1b7395d7d8b289a78920a87ce12160bacd304c51",
            "leverage": 2,
            "type": false
         },
         {
            "address": "0x48786d243897c581e88b598d4f786fb7169e08ac",
            "leverage": 3,
            "type": true
         },
         {
            "address": "0x2a93cbec0d134205c352d92d81bb7c4ec5ef4d4e",
            "leverage": 3,
            "type": false
         },
         {
            "address": "0xb70ae77ff9ecf13baea9807618ec7236acf44bd1",
            "leverage": 4,
            "type": true
         },
         {
            "address": "0xf85753fb0dc0a6c9b4f230eb861708677ac3c00f",
            "leverage": 4,
            "type": false
         }
      ]
   },
   {
      "symbol": "BAT",
      "tokenAddress": "0x0d8775f648430679a709e98d2b0cb6250d2887ef",
      "pTokens": [
         {
            "address": "0x2a40251ba733f10835447a8fcf0e0f1ce658f18a",
            "leverage": 1,
            "type": true
         },
         {
            "address": "0x143b591de9cff2baffb717ac0d109bc5c01e203e",
            "leverage": 2,
            "type": true
         },
         {
            "address": "0x6f3a5dcc36eeee5bd8b9b5db3b6431187a8f1e17",
            "leverage": 2,
            "type": false
         },
         {
            "address": "0x83a0dc31700af1772b7ea84fde7675ca6021b5da",
            "leverage": 3,
            "type": true
         },
         {
            "address": "0xe7bed2e5fca01f13e8230bf9b67963ad231b81a6",
            "leverage": 3,
            "type": false
         },
         {
            "address": "0xc37a0d81d9610514db1047de52e9a9093530d2e4",
            "leverage": 4,
            "type": true
         },
         {
            "address": "0x8880f71fe078aa1c5bbf8a5ff6fb93e475a9fce3",
            "leverage": 4,
            "type": false
         }
      ]
   },
   {
      "symbol": "KNC",
      "tokenAddress": "0xdd974d5c2e2928dea5f71b9825b8b646686bd200",
      "pTokens": [
         {
            "address": "0x692a2b8be7e166d6ee93b22a4b8b351e5d444339",
            "leverage": 1,
            "type": true
         },
         {
            "address": "0x30bb2d30b3a3a3f4943f81d460b45d2dac5735df",
            "leverage": 2,
            "type": true
         },
         {
            "address": "0x5c24f19f91f4ea8a3f95cb21ebbea053446d8632",
            "leverage": 2,
            "type": false
         },
         {
            "address": "0x5e9188280e1e35ae8f899b09c97558d0f195cc14",
            "leverage": 3,
            "type": true
         },
         {
            "address": "0x9b70e6aac469c75f4044c78d416ee3bc1a92ac22",
            "leverage": 3,
            "type": false
         },
         {
            "address": "0x4665a6f4f78bc13acecb328f5f22f0e4e66d2285",
            "leverage": 4,
            "type": true
         },
         {
            "address": "0x7fd75ac96ca1f0affa154fbc1ae08752d4880e83",
            "leverage": 4,
            "type": false
         }
      ]
   },
   {
      "symbol": "REP",
      "tokenAddress": "0x1985365e9f78359a9B6AD760e32412f4a445E862",
      "pTokens": [
         {
            "address": "0xe33297b993c89a55806932138804b0dbb8d7ca1c",
            "leverage": 1,
            "type": true
         },
         {
            "address": "0x44262a6a07256f0711f815451f2cd1a028a0a755",
            "leverage": 2,
            "type": true
         },
         {
            "address": "0xfd6c76546d93e6120eb6eaa266966f51330280c3",
            "leverage": 2,
            "type": false
         },
         {
            "address": "0xec3de33967898c47ec8fbb162b939c7014bd0601",
            "leverage": 3,
            "type": true
         },
         {
            "address": "0xaf16308808361b203d4ed521cdde6dd2e9b168f0",
            "leverage": 3,
            "type": false
         },
         {
            "address": "0x66564d3bcec69c7fbefea185bd6b9faa57faebb9",
            "leverage": 4,
            "type": true
         },
         {
            "address": "0x240fe85447a878f51a74a5dc0b644b4a72587839",
            "leverage": 4,
            "type": false
         }
      ]
   }
]

export let PTOKENS_V2: Array<pToken> = [
   {
      "symbol": "ETH",
      "tokenAddress": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      "pTokens": [
         {
            "address": "0xd2a1d068baac0b06a8e2b1dc924a43d81a6da325",
            "leverage": 1,
            "type": true
         },
         {
            "address": "0x8fa1a491f55d93bd40ff023956261f2fb5047297",
            "leverage": 2,
            "type": true
         },
         {
            "address": "0xd80e558027ee753a0b95757dc3521d0326f13da2",
            "leverage": 2,
            "type": false
         },
         {
            "address": "0x0428488582472a47d7a20be969fdfdfb3ba1f7cb",
            "leverage": 3,
            "type": true
         },
         {
            "address": "0x1370b716575bd7d5aee14128e231a779198e5397",
            "leverage": 3,
            "type": false
         },
         {
            "address": "0x46bb4576993f50302bb0d5f7440aeffbabfdbb78",
            "leverage": 4,
            "type": true
         },
         {
            "address": "0xf2ad1ee9671f63df7c8f8daa822da1e6fc08b80d",
            "leverage": 4,
            "type": false
         }
      ]
   },
   {
      "symbol": "WBTC",
      "tokenAddress": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
      "pTokens": [
         {
            "address": "0x5590b05495bad72365d4afaa3ed5fba5d8d67af2",
            "leverage": 1,
            "type": true
         },
         {
            "address": "0xe63d611b76ee1ad92df5153f3e573f7453ca0901",
            "leverage": 2,
            "type": true
         },
         {
            "address": "0xe5bd12178910c928b69cd090b18d4b981f1150dc",
            "leverage": 2,
            "type": false
         },
         {
            "address": "0x7dd474dce035debf073dcb9c188584d761b1d024",
            "leverage": 3,
            "type": true
         },
         {
            "address": "0x038e1b56b615ff3dd20e0bd4c7e91c7ee07d3508",
            "leverage": 3,
            "type": false
         },
         {
            "address": "0x11babe4a1dee350ba5b5ad902f1d2c9822a0a98b",
            "leverage": 4,
            "type": true
         },
         {
            "address": "0xdbc54c60a4dde6f95de3c78af59f9ff77e26afd2",
            "leverage": 4,
            "type": false
         }
      ]
   },
   {
      "symbol": "LINK",
      "tokenAddress": "0x514910771af9ca656af840dff83e8264ecf986ca",
      "pTokens": [
         {
            "address": "0x3bf13d76a5d625fc85486f73328926a64f226acc",
            "leverage": 1,
            "type": true
         },
         {
            "address": "0x7d7ab1db2c8766d98465a392f374eb97361289ef",
            "leverage": 2,
            "type": true
         },
         {
            "address": "0x91f46dd6ee5f3f8ce83287897938f7858f5761e4",
            "leverage": 2,
            "type": false
         },
         {
            "address": "0x4a1db1005cbc5684aa51e7a4eee06db0298e70f6",
            "leverage": 3,
            "type": true
         },
         {
            "address": "0xc0f2ad96e2e946b507f903bb5ef69a08b1bdc766",
            "leverage": 3,
            "type": false
         },
         {
            "address": "0x1f8bdad5f30effdf14c8da175349c7207bb370f8",
            "leverage": 4,
            "type": true
         },
         {
            "address": "0xcc16745a1773dd95ab9ed98599b8d9b835e42e25",
            "leverage": 4,
            "type": false
         }
      ]
   }
]