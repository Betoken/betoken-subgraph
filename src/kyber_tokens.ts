export class TokenInfo {
  symbol: string
  name: string
  address: string
  decimals: number
  id: string
  reserves_src: Array<string>
  reserves_dest: Array<string>
}

export let KYBER_TOKENS: Array<TokenInfo> = [
  {
    "symbol" : "ETH",
    "name" : "Ethereum",
    "address" : "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    "decimals" : 18,
    "id" : "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    "reserves_src" : [],
    "reserves_dest" : []
  },
  {
    "symbol" : "KNC",
    "name" : "KyberNetwork",
    "address" : "0xdd974d5c2e2928dea5f71b9825b8b646686bd200",
    "decimals" : 18,
    "id" : "0xdd974d5c2e2928dea5f71b9825b8b646686bd200",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F",
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18",
      "0xD6000fda0b38f4Bff4CfAb188E0bd18e8725a5e7",
      "0xA467b88BBF9706622be2784aF724C4B44a9d26F4"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F",
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18",
      "0xD6000fda0b38f4Bff4CfAb188E0bd18e8725a5e7",
      "0xA467b88BBF9706622be2784aF724C4B44a9d26F4"
    ]
  },
  {
    "symbol" : "DAI",
    "name" : "DAI",
    "address" : "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359",
    "decimals" : 18,
    "id" : "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359",
    "reserves_src" : [
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18",
      "0xD6000fda0b38f4Bff4CfAb188E0bd18e8725a5e7",
      "0x04A487aFd662c4F9DEAcC07A7B10cFb686B682A4",
      "0x5D154c145Db2ca90B8aB5e8Fe3E716AfA4AB7Ff0",
      "0x7a3370075a54B187d7bD5DceBf0ff2B5552d4F7D"
    ],
    "reserves_dest" : [
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18",
      "0xD6000fda0b38f4Bff4CfAb188E0bd18e8725a5e7",
      "0x04A487aFd662c4F9DEAcC07A7B10cFb686B682A4",
      "0x5D154c145Db2ca90B8aB5e8Fe3E716AfA4AB7Ff0",
      "0x7a3370075a54B187d7bD5DceBf0ff2B5552d4F7D"
    ]
  },
  {
    "symbol" : "OMG",
    "name" : "OmiseGO",
    "address" : "0xd26114cd6ee289accf82350c8d8487fedb8a0c07",
    "decimals" : 18,
    "id" : "0xd26114cd6ee289accf82350c8d8487fedb8a0c07",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F",
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18",
      "0xD6000fda0b38f4Bff4CfAb188E0bd18e8725a5e7"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F",
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18",
      "0xD6000fda0b38f4Bff4CfAb188E0bd18e8725a5e7"
    ]
  },
  {
    "symbol" : "SNT",
    "name" : "Status",
    "address" : "0x744d70fdbe2ba4cf95131626614a1763df805b9e",
    "decimals" : 18,
    "id" : "0x744d70fdbe2ba4cf95131626614a1763df805b9e",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ]
  },
  {
    "symbol" : "ELF",
    "name" : "Aelf",
    "address" : "0xbf2179859fc6d5bee9bf9158632dc51678a4100e",
    "decimals" : 18,
    "id" : "0xbf2179859fc6d5bee9bf9158632dc51678a4100e",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ]
  },
  {
    "symbol" : "POWR",
    "name" : "Power Ledger",
    "address" : "0x595832f8fc6bf59c85c527fec3740a1b7a361269",
    "decimals" : 6,
    "id" : "0x595832f8fc6bf59c85c527fec3740a1b7a361269",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ]
  },
  {
    "symbol" : "MANA",
    "name" : "Mana",
    "address" : "0x0f5d2fb29fb7d3cfee444a200298f468908cc942",
    "decimals" : 18,
    "id" : "0x0f5d2fb29fb7d3cfee444a200298f468908cc942",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ]
  },
  {
    "symbol" : "BAT",
    "name" : "Basic Attention Token",
    "address" : "0x0d8775f648430679a709e98d2b0cb6250d2887ef",
    "decimals" : 18,
    "id" : "0x0d8775f648430679a709e98d2b0cb6250d2887ef",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F",
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18",
      "0x5D154c145Db2ca90B8aB5e8Fe3E716AfA4AB7Ff0"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F",
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18",
      "0x5D154c145Db2ca90B8aB5e8Fe3E716AfA4AB7Ff0"
    ]
  },
  {
    "symbol" : "REQ",
    "name" : "Request",
    "address" : "0x8f8221afbb33998d8584a2b05749ba73c37a938a",
    "decimals" : 18,
    "id" : "0x8f8221afbb33998d8584a2b05749ba73c37a938a",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F",
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F",
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18"
    ]
  },
  {
    "symbol" : "RDN",
    "name" : "Raiden",
    "address" : "0x255aa6df07540cb5d3d297f0d0d4d84cb52bc8e6",
    "decimals" : 18,
    "id" : "0x255aa6df07540cb5d3d297f0d0d4d84cb52bc8e6",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F",
      "0xD6000fda0b38f4Bff4CfAb188E0bd18e8725a5e7"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F",
      "0xD6000fda0b38f4Bff4CfAb188E0bd18e8725a5e7"
    ]
  },
  {
    "symbol" : "APPC",
    "name" : "AppCoins",
    "address" : "0x1a7a8bd9106f2b8d977e08582dc7d24c723ab0db",
    "decimals" : 18,
    "id" : "0x1a7a8bd9106f2b8d977e08582dc7d24c723ab0db",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ]
  },
  {
    "symbol" : "ENG",
    "name" : "Enigma",
    "address" : "0xf0ee6b27b759c9893ce4f094b49ad28fd15a23e4",
    "decimals" : 8,
    "id" : "0xf0ee6b27b759c9893ce4f094b49ad28fd15a23e4",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F",
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F",
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18"
    ]
  },
  {
    "symbol" : "BQX",
    "name" : "Ethos",
    "address" : "0x5af2be193a6abca9c8817001f45744777db30756",
    "decimals" : 8,
    "id" : "0x5af2be193a6abca9c8817001f45744777db30756",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ]
  },
  {
    "symbol" : "ADX",
    "name" : "AdEx",
    "address" : "0x4470bb87d77b963a013db939be332f927f2b992e",
    "decimals" : 4,
    "id" : "0x4470bb87d77b963a013db939be332f927f2b992e",
    "reserves_src" : [
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18"
    ],
    "reserves_dest" : [
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18"
    ]
  },
  {
    "symbol" : "AST",
    "name" : "AirSwap",
    "address" : "0x27054b13b1b798b345b591a4d22e6562d47ea75a",
    "decimals" : 4,
    "id" : "0x27054b13b1b798b345b591a4d22e6562d47ea75a",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F",
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F",
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18"
    ]
  },
  {
    "symbol" : "RCN",
    "name" : "Ripio Credit Network",
    "address" : "0xf970b8e36e23f7fc3fd752eea86f8be8d83375a6",
    "decimals" : 18,
    "id" : "0xf970b8e36e23f7fc3fd752eea86f8be8d83375a6",
    "reserves_src" : [
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18"
    ],
    "reserves_dest" : [
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18"
    ]
  },
  {
    "symbol" : "LINK",
    "name" : "Chain Link",
    "address" : "0x514910771af9ca656af840dff83e8264ecf986ca",
    "decimals" : 18,
    "id" : "0x514910771af9ca656af840dff83e8264ecf986ca",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ]
  },
  {
    "symbol" : "DGX",
    "name" : "Digix Gold Token",
    "address" : "0x4f3afec4e5a3f2a6a1a411def7d7dfe50ee057bf",
    "decimals" : 9,
    "id" : "0x4f3afec4e5a3f2a6a1a411def7d7dfe50ee057bf",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ]
  },
  {
    "symbol" : "STORM",
    "name" : "Storm",
    "address" : "0xd0a4b8946cb52f0661273bfbc6fd0e0c75fc6433",
    "decimals" : 18,
    "id" : "0xd0a4b8946cb52f0661273bfbc6fd0e0c75fc6433",
    "reserves_src" : [
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18"
    ],
    "reserves_dest" : [
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18"
    ]
  },
  {
    "symbol" : "IOST",
    "name" : "IOStoken",
    "address" : "0xfa1a856cfa3409cfa145fa4e20eb270df3eb21ab",
    "decimals" : 18,
    "id" : "0xfa1a856cfa3409cfa145fa4e20eb270df3eb21ab",
    "reserves_src" : [
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18"
    ],
    "reserves_dest" : [
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18"
    ]
  },
  {
    "symbol" : "MOT",
    "name" : "Olympus Labs",
    "address" : "0x263c618480dbe35c300d8d5ecda19bbb986acaed",
    "decimals" : 18,
    "id" : "0x263c618480dbe35c300d8d5ecda19bbb986acaed",
    "reserves_src" : [
      "0x6f50E41885Fdc44DBdf7797Df0393779A9c0A3A6"
    ],
    "reserves_dest" : [
      "0x6f50E41885Fdc44DBdf7797Df0393779A9c0A3A6"
    ]
  },
  {
    "symbol" : "ABT",
    "name" : "ArcBlock",
    "address" : "0xb98d4c97425d9908e66e53a6fdf673acca0be986",
    "decimals" : 18,
    "id" : "0xb98d4c97425d9908e66e53a6fdf673acca0be986",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ]
  },
  {
    "symbol" : "ENJ",
    "name" : "Enjin Coin",
    "address" : "0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c",
    "decimals" : 18,
    "id" : "0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ]
  },
  {
    "symbol" : "BLZ",
    "name" : "Bluezelle",
    "address" : "0x5732046a883704404f284ce41ffadd5b007fd668",
    "decimals" : 18,
    "id" : "0x5732046a883704404f284ce41ffadd5b007fd668",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ]
  },
  {
    "symbol" : "ELEC",
    "name" : "ElectrifyAsia",
    "address" : "0xd49ff13661451313ca1553fd6954bd1d9b6e02b9",
    "decimals" : 18,
    "id" : "0xd49ff13661451313ca1553fd6954bd1d9b6e02b9",
    "reserves_src" : [],
    "reserves_dest" : []
  },
  {
    "symbol" : "BBO",
    "name" : "Bigbom",
    "address" : "0x84f7c44b6fed1080f647e354d552595be2cc602f",
    "decimals" : 18,
    "id" : "0x84f7c44b6fed1080f647e354d552595be2cc602f",
    "reserves_src" : [
      "0x91Be8fA21dc21Cff073E07Bae365669E154d6Ee1"
    ],
    "reserves_dest" : [
      "0x91Be8fA21dc21Cff073E07Bae365669E154d6Ee1"
    ]
  },
  {
    "symbol" : "POLY",
    "name" : "Polymath",
    "address" : "0x9992ec3cf6a55b00978cddf2b27bc6882d88d1ec",
    "decimals" : 18,
    "id" : "0x9992ec3cf6a55b00978cddf2b27bc6882d88d1ec",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ]
  },
  {
    "symbol" : "LBA",
    "name" : "Cred",
    "address" : "0xfe5f141bf94fe84bc28ded0ab966c16b17490657",
    "decimals" : 18,
    "id" : "0xfe5f141bf94fe84bc28ded0ab966c16b17490657",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ]
  },
  {
    "symbol" : "CVC",
    "name" : "Civic",
    "address" : "0x41e5560054824ea6b0732e656e3ad64e20e94e45",
    "decimals" : 8,
    "id" : "0x41e5560054824ea6b0732e656e3ad64e20e94e45",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ]
  },
  {
    "symbol" : "WAX",
    "name" : "Wax",
    "address" : "0x39bb259f66e1c59d5abef88375979b4d20d98022",
    "decimals" : 8,
    "id" : "0x39bb259f66e1c59d5abef88375979b4d20d98022",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F",
      "0x75fF6BeC6Ed398FA80EA1596cef422D64681F057"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F",
      "0x75fF6BeC6Ed398FA80EA1596cef422D64681F057"
    ]
  },
  {
    "symbol" : "POE",
    "name" : "Po.et",
    "address" : "0x0e0989b1f9b8a38983c2ba8053269ca62ec9b195",
    "decimals" : 8,
    "id" : "0x0e0989b1f9b8a38983c2ba8053269ca62ec9b195",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ]
  },
  {
    "symbol" : "PAY",
    "name" : "TenX",
    "address" : "0xb97048628db6b661d4c2aa833e95dbe1a905b280",
    "decimals" : 18,
    "id" : "0xb97048628db6b661d4c2aa833e95dbe1a905b280",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ]
  },
  {
    "symbol" : "DTA",
    "name" : "Data",
    "address" : "0x69b148395ce0015c13e36bffbad63f49ef874e03",
    "decimals" : 18,
    "id" : "0x69b148395ce0015c13e36bffbad63f49ef874e03",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ]
  },
  {
    "symbol" : "BNT",
    "name" : "Bancor",
    "address" : "0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c",
    "decimals" : 18,
    "id" : "0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ]
  },
  {
    "symbol" : "TUSD",
    "name" : "TrueUSD",
    "address" : "0x8dd5fbce2f6a956c3022ba3663759011dd51e73e",
    "decimals" : 18,
    "id" : "0x8dd5fbce2f6a956c3022ba3663759011dd51e73e",
    "reserves_src" : [
      "0x5D154c145Db2ca90B8aB5e8Fe3E716AfA4AB7Ff0",
      "0x7a3370075a54B187d7bD5DceBf0ff2B5552d4F7D"
    ],
    "reserves_dest" : [
      "0x5D154c145Db2ca90B8aB5e8Fe3E716AfA4AB7Ff0",
      "0x7a3370075a54B187d7bD5DceBf0ff2B5552d4F7D"
    ]
  },
  {
    "symbol" : "LEND",
    "name" : "EthLend",
    "address" : "0x80fb784b7ed66730e8b1dbd9820afd29931aab03",
    "decimals" : 18,
    "id" : "0x80fb784b7ed66730e8b1dbd9820afd29931aab03",
    "reserves_src" : [
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18"
    ],
    "reserves_dest" : [
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18"
    ]
  },
  {
    "symbol" : "WINGS",
    "name" : "WINGS",
    "address" : "0x667088b212ce3d06a1b553a7221e1fd19000d9af",
    "decimals" : 18,
    "id" : "0x667088b212ce3d06a1b553a7221e1fd19000d9af",
    "reserves_src" : [
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18"
    ],
    "reserves_dest" : [
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18"
    ]
  },
  {
    "symbol" : "MTL",
    "name" : "Metal",
    "address" : "0xf433089366899d83a9f26a773d59ec7ecf30355e",
    "decimals" : 8,
    "id" : "0xf433089366899d83a9f26a773d59ec7ecf30355e",
    "reserves_src" : [
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18"
    ],
    "reserves_dest" : [
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18"
    ]
  },
  {
    "symbol" : "WABI",
    "name" : "WaBi",
    "address" : "0x286bda1413a2df81731d4930ce2f862a35a609fe",
    "decimals" : 18,
    "id" : "0x286bda1413a2df81731d4930ce2f862a35a609fe",
    "reserves_src" : [
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18"
    ],
    "reserves_dest" : [
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18"
    ]
  },
  {
    "symbol" : "COFI",
    "name" : "CoinFi",
    "address" : "0x3136ef851592acf49ca4c825131e364170fa32b3",
    "decimals" : 18,
    "id" : "0x3136ef851592acf49ca4c825131e364170fa32b3",
    "reserves_src" : [],
    "reserves_dest" : []
  },
  {
    "symbol" : "MOC",
    "name" : "Moss Land",
    "address" : "0x865ec58b06bf6305b886793aa20a2da31d034e68",
    "decimals" : 18,
    "id" : "0x865ec58b06bf6305b886793aa20a2da31d034e68",
    "reserves_src" : [
      "0x742e8BB8e6bDE9CB2DF5449f8de7510798727fB1"
    ],
    "reserves_dest" : [
      "0x742e8BB8e6bDE9CB2DF5449f8de7510798727fB1"
    ]
  },
  {
    "symbol" : "REP",
    "name" : "Augur",
    "address" : "0x1985365e9f78359a9b6ad760e32412f4a445e862",
    "decimals" : 18,
    "id" : "0x1985365e9f78359a9b6ad760e32412f4a445e862",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F",
      "0x5D154c145Db2ca90B8aB5e8Fe3E716AfA4AB7Ff0"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F",
      "0x5D154c145Db2ca90B8aB5e8Fe3E716AfA4AB7Ff0"
    ]
  },
  {
    "symbol" : "ZRX",
    "name" : "0x Protocol",
    "address" : "0xe41d2489571d322189246dafa5ebde1f4699f498",
    "decimals" : 18,
    "id" : "0xe41d2489571d322189246dafa5ebde1f4699f498",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ]
  },
  {
    "symbol" : "MAS",
    "name" : "MidasProtocol",
    "address" : "0x23ccc43365d9dd3882eab88f43d515208f832430",
    "decimals" : 18,
    "id" : "0x23ccc43365d9dd3882eab88f43d515208f832430",
    "reserves_src" : [
      "0x56e37b6b79d4E895618B8Bb287748702848Ae8c0"
    ],
    "reserves_dest" : [
      "0x56e37b6b79d4E895618B8Bb287748702848Ae8c0"
    ]
  },
  {
    "symbol" : "DAT",
    "name" : "Datum",
    "address" : "0x81c9151de0c8bafcd325a57e3db5a5df1cebf79c",
    "decimals" : 18,
    "id" : "0x81c9151de0c8bafcd325a57e3db5a5df1cebf79c",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ]
  },
  {
    "symbol" : "REN",
    "name" : "Republic",
    "address" : "0x408e41876cccdc0f92210600ef50372656052a38",
    "decimals" : 18,
    "id" : "0x408e41876cccdc0f92210600ef50372656052a38",
    "reserves_src" : [
      "0x45eb33D008801d547990cAF3b63B4F8aE596EA57"
    ],
    "reserves_dest" : [
      "0x45eb33D008801d547990cAF3b63B4F8aE596EA57"
    ]
  },
  {
    "symbol" : "QKC",
    "name" : "QuarkChain",
    "address" : "0xea26c4ac16d4a5a106820bc8aee85fd0b7b2b664",
    "decimals" : 18,
    "id" : "0xea26c4ac16d4a5a106820bc8aee85fd0b7b2b664",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ]
  },
  {
    "symbol" : "MKR",
    "name" : "Maker",
    "address" : "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
    "decimals" : 18,
    "id" : "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
    "reserves_src" : [
      "0x04A487aFd662c4F9DEAcC07A7B10cFb686B682A4",
      "0x5D154c145Db2ca90B8aB5e8Fe3E716AfA4AB7Ff0"
    ],
    "reserves_dest" : [
      "0x04A487aFd662c4F9DEAcC07A7B10cFb686B682A4",
      "0x5D154c145Db2ca90B8aB5e8Fe3E716AfA4AB7Ff0"
    ]
  },
  {
    "symbol" : "DCC",
    "name" : "Distributed Credit Chain",
    "address" : "0xffa93aacf49297d51e211817452839052fdfb961",
    "decimals" : 18,
    "id" : "0xffa93aacf49297d51e211817452839052fdfb961",
    "reserves_src" : [],
    "reserves_dest" : []
  },
  {
    "symbol" : "SSP",
    "name" : "Smartshare Token",
    "address" : "0x624d520bab2e4ad83935fa503fb130614374e850",
    "decimals" : 4,
    "id" : "0x624d520bab2e4ad83935fa503fb130614374e850",
    "reserves_src" : [
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18"
    ],
    "reserves_dest" : [
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18"
    ]
  },
  {
    "symbol" : "PRO",
    "name" : "Propy",
    "address" : "0x226bb599a12c826476e3a771454697ea52e9e220",
    "decimals" : 8,
    "id" : "0x226bb599a12c826476e3a771454697ea52e9e220",
    "reserves_src" : [
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18"
    ],
    "reserves_dest" : [
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18"
    ]
  },
  {
    "symbol" : "OCN",
    "name" : "OCoin",
    "address" : "0x4092678e4e78230f46a1534c0fbc8fa39780892b",
    "decimals" : 18,
    "id" : "0x4092678e4e78230f46a1534c0fbc8fa39780892b",
    "reserves_src" : [
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18"
    ],
    "reserves_dest" : [
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18"
    ]
  },
  {
    "symbol" : "EKO",
    "name" : "EchoLink",
    "address" : "0xa6a840e50bcaa50da017b91a0d86b8b2d41156ee",
    "decimals" : 18,
    "id" : "0xa6a840e50bcaa50da017b91a0d86b8b2d41156ee",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ]
  },
  {
    "symbol" : "OST",
    "name" : "Open Simple Token",
    "address" : "0x2c4e8f2d746113d0696ce89b35f0d8bf88e0aeca",
    "decimals" : 18,
    "id" : "0x2c4e8f2d746113d0696ce89b35f0d8bf88e0aeca",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ]
  },
  {
    "symbol" : "DTH",
    "name" : "Dether",
    "address" : "0x5adc961d6ac3f7062d2ea45fefb8d8167d44b190",
    "decimals" : 18,
    "id" : "0x5adc961d6ac3f7062d2ea45fefb8d8167d44b190",
    "reserves_src" : [
      "0x2631a5222522156DfafaA5Ca8480223D6465782d"
    ],
    "reserves_dest" : [
      "0x2631a5222522156DfafaA5Ca8480223D6465782d"
    ]
  },
  {
    "symbol" : "PT",
    "name" : "Promotion Token",
    "address" : "0x094c875704c14783049ddf8136e298b3a099c446",
    "decimals" : 18,
    "id" : "0x094c875704c14783049ddf8136e298b3a099c446",
    "reserves_src" : [
      "0x2295fc6BC32cD12fdBb852cFf4014cEAc6d79C10"
    ],
    "reserves_dest" : [
      "0x2295fc6BC32cD12fdBb852cFf4014cEAc6d79C10"
    ]
  },
  {
    "symbol" : "INF",
    "name" : "InfinitusTokens",
    "address" : "0x00e150d741eda1d49d341189cae4c08a73a49c95",
    "decimals" : 18,
    "id" : "0x00e150d741eda1d49d341189cae4c08a73a49c95",
    "reserves_src" : [
      "0x4D864B5b4F866f65F53cbAAd32Eb9574760865e6"
    ],
    "reserves_dest" : [
      "0x4D864B5b4F866f65F53cbAAd32Eb9574760865e6"
    ]
  },
  {
    "symbol" : "TTC",
    "name" : "TTC Protocol",
    "address" : "0x9389434852b94bbad4c8afed5b7bdbc5ff0c2275",
    "decimals" : 18,
    "id" : "0x9389434852b94bbad4c8afed5b7bdbc5ff0c2275",
    "reserves_src" : [
      "0xa9312cb86d1E532B7c21881Ce03a1a9d52F6ADb1"
    ],
    "reserves_dest" : [
      "0xa9312cb86d1E532B7c21881Ce03a1a9d52F6ADb1"
    ]
  },
  {
    "symbol" : "ABYSS",
    "name" : "ABYSS",
    "address" : "0x0e8d6b471e332f140e7d9dbb99e5e3822f728da6",
    "decimals" : 18,
    "id" : "0x0e8d6b471e332f140e7d9dbb99e5e3822f728da6",
    "reserves_src" : [
      "0x3e9FFBA3C3eB91f501817b031031a71de2d3163B",
      "0x1C802020Eea688E2B05936CDb98b8E6894ACC1c2"
    ],
    "reserves_dest" : [
      "0x3e9FFBA3C3eB91f501817b031031a71de2d3163B",
      "0x1C802020Eea688E2B05936CDb98b8E6894ACC1c2"
    ]
  },
  {
    "symbol" : "WBTC",
    "name" : "Wrapped BTC",
    "address" : "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    "decimals" : 8,
    "id" : "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F",
      "0x7a3370075a54B187d7bD5DceBf0ff2B5552d4F7D"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F",
      "0x7a3370075a54B187d7bD5DceBf0ff2B5552d4F7D"
    ]
  },
  {
    "symbol" : "MLN",
    "name" : "Melon Token",
    "address" : "0xec67005c4e498ec7f55e092bd1d35cbc47c91892",
    "decimals" : 18,
    "id" : "0xec67005c4e498ec7f55e092bd1d35cbc47c91892",
    "reserves_src" : [
      "0xa33c7c22d0BB673c2aEa2C048BB883b679fa1BE9"
    ],
    "reserves_dest" : [
      "0xa33c7c22d0BB673c2aEa2C048BB883b679fa1BE9"
    ]
  },
  {
    "symbol" : "USDC",
    "name" : "USD Coin",
    "address" : "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    "decimals" : 6,
    "id" : "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    "reserves_src" : [
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18",
      "0x5D154c145Db2ca90B8aB5e8Fe3E716AfA4AB7Ff0",
      "0x1670DFb52806DE7789D5cF7D5c005cf7083f9A5D",
      "0x7a3370075a54B187d7bD5DceBf0ff2B5552d4F7D"
    ],
    "reserves_dest" : [
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18",
      "0x5D154c145Db2ca90B8aB5e8Fe3E716AfA4AB7Ff0",
      "0x1670DFb52806DE7789D5cF7D5c005cf7083f9A5D",
      "0x7a3370075a54B187d7bD5DceBf0ff2B5552d4F7D"
    ]
  },
  {
    "symbol" : "EURS",
    "name" : "STASIS EURS",
    "address" : "0xdb25f211ab05b1c97d595516f45794528a807ad8",
    "decimals" : 2,
    "id" : "0xdb25f211ab05b1c97d595516f45794528a807ad8",
    "reserves_src" : [
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18"
    ],
    "reserves_dest" : [
      "0x21433Dec9Cb634A23c6A4BbcCe08c83f5aC2EC18"
    ]
  },
  {
    "symbol" : "BIX",
    "name" : "BIX Token",
    "address" : "0xb3104b4b9da82025e8b9f8fb28b3553ce2f67069",
    "decimals" : 18,
    "id" : "0xb3104b4b9da82025e8b9f8fb28b3553ce2f67069",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ]
  },
  {
    "symbol" : "CDT",
    "name" : "CoinDash",
    "address" : "0x177d39ac676ed1c67a2b268ad7f1e58826e5b0af",
    "decimals" : 18,
    "id" : "0x177d39ac676ed1c67a2b268ad7f1e58826e5b0af",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ]
  },
  {
    "symbol" : "MCO",
    "name" : "Monaco",
    "address" : "0xb63b606ac810a52cca15e44bb630fd42d8d1d83d",
    "decimals" : 8,
    "id" : "0xb63b606ac810a52cca15e44bb630fd42d8d1d83d",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ]
  },
  {
    "symbol" : "GEN",
    "name" : "DAOStack",
    "address" : "0x543ff227f64aa17ea132bf9886cab5db55dcaddf",
    "decimals" : 18,
    "id" : "0x543ff227f64aa17ea132bf9886cab5db55dcaddf",
    "reserves_src" : [
      "0xAA14DCAA0AdbE79cBF00edC6cC4ED17ed39240AC"
    ],
    "reserves_dest" : [
      "0xAA14DCAA0AdbE79cBF00edC6cC4ED17ed39240AC"
    ]
  },
  {
    "symbol" : "LRC",
    "name" : "Loopring",
    "address" : "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
    "decimals" : 18,
    "id" : "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ]
  },
  {
    "symbol" : "RLC",
    "name" : "iExec RLC",
    "address" : "0x607f4c5bb672230e8672085532f7e901544a7375",
    "decimals" : 9,
    "id" : "0x607f4c5bb672230e8672085532f7e901544a7375",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ]
  },
  {
    "symbol" : "NPXS",
    "name" : "Pundi X",
    "address" : "0xa15c7ebe1f07caf6bff097d8a589fb8ac49ae5b3",
    "decimals" : 18,
    "id" : "0xa15c7ebe1f07caf6bff097d8a589fb8ac49ae5b3",
    "reserves_src" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ],
    "reserves_dest" : [
      "0x63825c174ab367968EC60f061753D3bbD36A0D8F"
    ]
  },
  {
    "symbol" : "GNO",
    "name" : "Gnosis",
    "address" : "0x6810e776880c02933d47db1b9fc05908e5386b96",
    "decimals" : 18,
    "id" : "0x6810e776880c02933d47db1b9fc05908e5386b96",
    "reserves_src" : [
      "0x05461124C86C0AD7C5d8E012e1499fd9109fFb7d",
      "0xD6000fda0b38f4Bff4CfAb188E0bd18e8725a5e7"
    ],
    "reserves_dest" : [
      "0x05461124C86C0AD7C5d8E012e1499fd9109fFb7d",
      "0xD6000fda0b38f4Bff4CfAb188E0bd18e8725a5e7"
    ]
  },
  {
    "symbol" : "MYB",
    "name" : "MyBit",
    "address" : "0x5d60d8d7ef6d37e16ebabc324de3be57f135e0bc",
    "decimals" : 18,
    "id" : "0x5d60d8d7ef6d37e16ebabc324de3be57f135e0bc",
    "reserves_src" : [
      "0x1833AD67362249823515B59A8aA8b4f6B4358d1B"
    ],
    "reserves_dest" : [
      "0x1833AD67362249823515B59A8aA8b4f6B4358d1B"
    ]
  },
  {
    "symbol" : "BAM",
    "name" : "Bamboo",
    "address" : "0x22b3faaa8df978f6bafe18aade18dc2e3dfa0e0c",
    "decimals" : 18,
    "id" : "0x22b3faaa8df978f6bafe18aade18dc2e3dfa0e0c",
    "reserves_src" : [
      "0x302B35bd0B01312ec2652783c04955D7200C3D9b"
    ],
    "reserves_dest" : [
      "0x302B35bd0B01312ec2652783c04955D7200C3D9b"
    ]
  },
  {
    "symbol" : "SPN",
    "name" : "Sapien Network",
    "address" : "0x20f7a3ddf244dc9299975b4da1c39f8d5d75f05a",
    "decimals" : 6,
    "id" : "0x20f7a3ddf244dc9299975b4da1c39f8d5d75f05a",
    "reserves_src" : [
      "0x6b84DBd29643294703dBabf8Ed97cDef74EDD227"
    ],
    "reserves_dest" : [
      "0x6b84DBd29643294703dBabf8Ed97cDef74EDD227"
    ]
  }
]