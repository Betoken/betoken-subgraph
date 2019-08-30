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
    "symbol" : "ETH",
    "name" : "Ethereum",
    "address" : "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    "decimals" : 18,
    "id" : "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    "reserves_src" : [],
    "reserves_dest" : []
  }
]