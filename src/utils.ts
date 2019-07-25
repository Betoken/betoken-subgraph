import { BigInt, Address, EthereumEvent, BigDecimal } from '@graphprotocol/graph-ts'
import {
  BetokenFund,
} from "../generated/BetokenProxy/templates/BetokenFund/BetokenFund"

import {
  Fund,
  DataPoint
} from "../generated/schema"

import { MiniMeToken } from '../generated/BetokenProxy/templates/BetokenFund/MiniMeToken'
import { KyberNetwork } from "../generated/BetokenProxy/templates/BetokenFund/KyberNetwork"
import { PositionToken } from '../generated/BetokenProxy/templates/BetokenFund/PositionToken'

// Constants

export let CyclePhase = new Array<string>()
CyclePhase.push('INTERMISSION')
CyclePhase.push('MANAGE')

export let VoteDirection = new Array<string>()
VoteDirection.push('EMPTY')
VoteDirection.push('FOR')
VoteDirection.push('AGAINST')

import { PTOKENS, pTokenInfo, pToken } from './fulcrum_tokens'
export let ZERO_INT = BigInt.fromI32(0)
export let ZERO_DEC = BigDecimal.fromString('0')
export let PRECISION = new BigDecimal(tenPow(18))
export let KYBER_ADDR = Address.fromString("0x818E6FECD516Ecc3849DAf6845e3EC868087B755")
export let DAI_ADDR = Address.fromString("0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359")
export let FUND_ID = 'BetokenFund'
export let CALLER_REWARD = BigDecimal.fromString('1')
export let RISK_THRESHOLD_TIME = BigInt.fromI32(3 * 24 * 60 * 60).toBigDecimal()
export let ETH_ADDR = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
export let RECORD_INTERVAL = BigInt.fromI32(24 * 60 * 60 / 15) // 24 hours if avg block time is 15 seconds
export let PRICE_INTERVAL = BigInt.fromI32(5 * 60 / 15) // 5 minutes if avg block time is 15 seconds
export let LATEST_BLOCK = BigInt.fromI32(8220501)

// Helpers

export function assetPTokenAddressToPTokenIndex(_addr: string): i32 {
  let idx = -1
  for (let j = 0; j < PTOKENS.length; j++) {
    let x: pToken = PTOKENS[j]
    for (let k = 0; k < x.pTokens.length; k++) {
      let y: pTokenInfo = x.pTokens[k]
      if (y.address.includes(_addr)) {
        idx = j
        break
      }
    }
    if (idx > -1) {
      break
    }
  }
  return idx
}

export function isFulcrumTokenAddress(_tokenAddress: string): boolean {
  return assetPTokenAddressToPTokenIndex(_tokenAddress) != -1
}

// precondition: _addr is the address of a pToken
export function assetPTokenAddressToInfo(_addr: string): pTokenInfo {
  let pTokens = PTOKENS[assetPTokenAddressToPTokenIndex(_addr)].pTokens
  for (let i = 0; i < pTokens.length; i++) {
    let info: pTokenInfo = pTokens[i]
    if (info.address.includes(_addr)) {
      return info
    }
  }
  return null
}

export function pTokenPrice(_addr: Address): BigDecimal {
  let token = PositionToken.bind(_addr)
  let priceInUnderlying = normalize(token.tokenPrice())
  let tokenInfo = assetPTokenAddressToInfo(_addr.toHex())
  if (!tokenInfo.type) {
    // long token, underlying is DAI
    return priceInUnderlying
  } else {
    // short token, underlying is token
    let underlying = token.loanTokenAddress()
    let underlyingPrice = getPriceOfToken(underlying)
    return priceInUnderlying.times(underlyingPrice)
  }
}

export function pTokenLiquidationPrice(_addr: Address): BigDecimal {
  let token = PositionToken.bind(_addr)
  let priceInUnderlying = normalize(token.liquidationPrice())
  let tokenInfo = assetPTokenAddressToInfo(_addr.toHex())
  if (!tokenInfo.type) {
    // long token, underlying is DAI
    return priceInUnderlying
  } else {
    // short token, underlying is token
    let underlying = token.loanTokenAddress()
    let underlyingPrice = getPriceOfToken(underlying)
    return priceInUnderlying.times(underlyingPrice)
  }
}

export function updateTotalFunds(event: EthereumEvent): void {
  let fund = Fund.load(FUND_ID)
  let fundAddress = Address.fromString(fund.address)
  let fundContract = BetokenFund.bind(fundAddress)
  let kairo = kairoContract(fundAddress)
  let shares = sharesContract(fundAddress)
  fund.totalFundsInDAI = normalize(fundContract.totalFundsInDAI())
  fund.kairoPrice = normalize(fundContract.kairoPrice())
  fund.kairoTotalSupply = normalize(kairo.totalSupply())
  fund.sharesTotalSupply = normalize(shares.totalSupply())
  fund.save()
}

export function tenPow(exponent: number): BigInt {
  let result = BigInt.fromI32(1)
  for (let i = 0; i < exponent; i++) {
    result = result.times(BigInt.fromI32(10))
  }
  return result
}

export function kairoContract(fundAddress: Address): MiniMeToken {
  let fund = BetokenFund.bind(fundAddress)
  return MiniMeToken.bind(fund.controlTokenAddr())
}

export function sharesContract(fundAddress: Address): MiniMeToken {
  let fund = BetokenFund.bind(fundAddress)
  return MiniMeToken.bind(fund.shareTokenAddr())
}

export function getArrItem<T>(arr: Array<T>, idx: i32): T {
  let a = new Array<T>()
  a = a.concat(arr)
  return a[idx]
}

export function getPriceOfToken(tokenAddress: Address): BigDecimal {
  let kyber = KyberNetwork.bind(KYBER_ADDR)
  let token = MiniMeToken.bind(tokenAddress)
  let decimals: i32
  if (ETH_ADDR.includes(tokenAddress.toHex())) {
    decimals = 18
  } else {
    decimals = token.decimals()
  }
  let result = kyber.getExpectedRate(tokenAddress, DAI_ADDR, tenPow(decimals))
  return normalize(result.value1)
}

export function normalize(i: BigInt): BigDecimal {
  return i.toBigDecimal().div(PRECISION)
}

export let INITIAL_MANAGERS: Array<string> = [
  "0x24dd242c3c4061b1fcaa5119af608b56afbaea95",
  "0xa1998b821c37519889af52f95d1b9dd0d5167d6a",
  "0x52b7840b735d518d3898de30a5ffd8550e62b660",
  "0x2b46411608c9891c192c700ff823efa4efe3c8cb",
  "0xe37b160031c2cbc7f9ee24585fe7f5f5c10de05d",
  "0x684c71211226caa7f83dc7547d106405496f10e0",
  "0x1bae2e7cb57d699d3362d86964c6e268b19d05ca",
  "0xa5cd3bc3f3d34b3a716111643e19db88bfa649c7",
  "0x6d03b52c2c5c8bf9d57adcbd0bcb1703058342c8",
  "0xd534401fbb7926a03225cb98bb511418b223116a",
  "0x6d8311be9b2fd060552f08145a303cdf6c28d8e9",
  "0x7306f5f51ae1d7c9066968ea79340132756a8070",
  "0x07005c9b5f948918111322126b1db739d43b1d7c",
  "0x6de754c0816aa1ec98d2ff55ad6ea7d00ab6e131",
  "0xafd5f60aa8eb4f488eaa0ef98c1c5b0645d9a0a0",
  "0x4ada1b9d9fe28abd9585f58cfeed2169a39e1c6b",
  "0x6447ff790634d530a7db94d124d25aa6a1172105",
  "0xcaadfaadd73fddede6338a30dcaaa6b09714c96e",
  "0x5d27f70bdf90ce9b73d303187bd0bf1a65528ebd",
  "0xcf11101c3118eac1f43f0d83d7cb3ca7aefe0524",
  "0x11763f0cb608516e768358c2a3890bdf8a158b35",
  "0x4261346be8a7c7fc7f75fa3f96061e7799232ea2",
  "0xe4bf41cfc43dc5361d3ec6219fcb10b6a283b40d",
  "0x98de24d25c87d183a393427714d660b628631c3a",
  "0x7344d21a46749d6513fa9a53fa53fd407c86f614",
  "0xe68fc89a36ecfc592ee7f4aef299877ffacaeaec",
  "0x50f124eb8e8d42c7a05666e7908b28878779c8e4",
  "0xd53046601e88ea3d7ec29f723ee855ac1ae7ab60",
  "0x617096ec92315d6a23a5ebdcf4f1fc3a8c59e5d5",
  "0x512eae31031ca9dfa8d9c6f0b3694c0b853b3bab",
  "0x49335ba21fb78920119c9e4eba65e2097e2698e2",
  "0xa611397ed7553336b1715560a7937bfb318d1f9a",
  "0x5eee4041a681ba83ea95a255a71186a3a1f6fb8e",
  "0x6cf16cb622a1dcf4b2acdd195e404a9095b83da7",
  "0xac0d7885dce1df0ebdc3cc8540cbb9fe6141186e",
  "0x4dd6694d055a82846bda9717720dce3f2906f9b7",
  "0x71a4ffc09dd5a7697c3e1026e704e2db1a149dfe",
  "0x5f350bf5fee8e254d6077f8661e9c7b83a30364e",
  "0x751d92cd6ec03a7d8148fcaf63532d8f8f9ec09b",
  "0xb6b16bb740b299fdbf71db47c51b11030895b067",
  "0x6dbe901d689f5481522663989f84b1416019815f",
  "0xd7ce18835f371cf04a9ad8b61e61226875bcc2d8",
  "0x913b793a4ac1fb8b645a0165dd5b98b55c54b5fa",
  "0xa040a28cedf4846d2e8ce6fcf03cbb8627c444c3",
  "0xe13ccb8c29e1a921cbd70e1dd5cfe802f9f9d415",
  "0xa289364347bfc1912ab672425abe593ec01ca56e",
  "0x107af532e6f828da6fe79699123c9a5ea0123d16",
  "0x87bf1fccf3a0771584c6846ec7442ea0789ffa6b",
  "0x94234cfd63e20f280111daf8627c95c0ab2c3ac7",
  "0x349bd094209d50280dfaca12779576c748395c15",
  "0xb3addac63a7298161c66edd4993c588d820f693a",
  "0xa8ee48eaab6bd037cb992e29f12a7b9da31ea222",
  "0x81659ecf1ef9755e9477bb892e0b1ac6d1dfbf32",
  "0xfc6963d9441bb7a971d3b0261d42b32dbaf75b29",
  "0x954957c811facfe062ce05b5b3a39264e153962a",
  "0x9ca4e34ad23a3b177bd0d6e48149efd0852a7752",
  "0x2ed986620cf0cb7da16fe6b7326ae8c6a5d835e9",
  "0x38609b6b6883e58c76ec681eaedd8d1c5c6fd6a4",
  "0xe373ab2f10e5a2d60e40ebc929ec38cfc49043d2",
  "0xc1670ff09ccfbc950389914ede5157250d98dee8",
  "0xd5d30cf0b6755db0c1b414bb288e0ac55bbc983b",
  "0xad8d540e81a820b582b7f7bcfe344878a78f0692",
  "0xd047b65f54f4aa8eae6bb9f3d9d5d126fe722b9f",
  "0x258c19d5e104d19e1f68c9ee22ad28b4c1a36fee",
  "0xcef6c9449c378544f713a57f00455ce9b4936a84",
  "0x0bd785d8ab76de1595e595dbc12ef337cc49ed72",
  "0xae3d4cdd027c8148913dd2b2a096f0dcf97ed3cf",
  "0x3fb22974f6878655dbc9c20ccfb0a942cded9cec",
  "0x11e059d9ac6bde6718cc9c86555f40bdb05e44f9",
  "0xebd20448db60014a2839ec4c55aff42e4f2fa2cb",
  "0xee80db4997098b2b517223636f15d51a61f3549b",
  "0xfd4c361d285e32786569f92322a5ab748bbcaba0",
  "0x82c69f887d8c4752181bf9a956d1aeb2551fe14c",
  "0x463783cab26b2e20bd118e4b27a0c455597878a5",
  "0xf89a6d4140816f3f43947b01dec701d7ea73ba4f",
  "0x198a123599e65140bfefa096648d968a67c3b807",
  "0xca4ef9e3c4e3878e000af1830aab48846f42236f",
  "0xd16aa39e2812fa1c9dae6ca4eee0a11dee262a9a",
  "0xc624a8e892cd0b675c03b695e43518bc95faba00",
  "0x14a4ca34ee34643791ddd841fafe3c774336b306",
  "0xe238a963be7ca1fecd595c489fb2e4fa96a94df4",
  "0x8e9818e75ea25d0162f4998e033eae28cddc231e",
  "0x0972375c086a669fcd7ba3274689027ac844e1c5"
];