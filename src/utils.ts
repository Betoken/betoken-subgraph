import { BigInt, Address, EthereumEvent, BigDecimal } from '@graphprotocol/graph-ts'
import {
  BetokenFund,
} from "../generated/BetokenProxy/templates/BetokenFund/BetokenFund"

import {
  Fund,
  DataPoint
} from "../generated/schema"

import { MiniMeToken } from '../generated/BetokenProxy/templates/MiniMeToken/MiniMeToken'
import { KyberNetwork } from "../generated/BetokenProxy/templates/KyberNetwork/KyberNetwork"

// Constants

export let CyclePhase = new Array<string>()
CyclePhase.push('INTERMISSION')
CyclePhase.push('MANAGE')

export let VoteDirection = new Array<string>()
VoteDirection.push('EMPTY')
VoteDirection.push('FOR')
VoteDirection.push('AGAINST')

import { PTOKENS, pTokenInfo } from './fulcrum_tokens'
export let ZERO_INT = BigInt.fromI32(0)
export let ZERO_DEC = BigDecimal.fromString('0')
export let PRECISION = new BigDecimal(tenPow(18))
export let KYBER_ADDR = Address.fromString("0x818E6FECD516Ecc3849DAf6845e3EC868087B755")
export let DAI_ADDR = Address.fromString("0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359")
export let FUND_ID = 'BetokenFund'
export let CALLER_REWARD = BigDecimal.fromString('1')
export let RISK_THRESHOLD_TIME = BigInt.fromI32(3 * 24 * 60 * 60).toBigDecimal()

// Helpers

export function isFulcrumTokenAddress(_tokenAddress: string): boolean {
  let result = PTOKENS.findIndex((x) => x.pTokens.findIndex((y) => y.address === _tokenAddress) != -1);
  return result != -1;
}

export function assetPTokenAddressToInfo(_addr: string): pTokenInfo {
  let pTokens = PTOKENS[PTOKENS.findIndex((x) => x.pTokens.findIndex((y) => y.address === _addr) != -1)].pTokens;
  return pTokens[pTokens.findIndex((y) => y.address === _addr)]
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
  if (shares.totalSupply().equals(ZERO_INT)) {
    fund.sharesPrice = PRECISION
  } else {
    fund.sharesPrice = fund.totalFundsInDAI.div(normalize(shares.totalSupply()))
  }
  fund.sharesTotalSupply = normalize(shares.totalSupply())

  let dp = new DataPoint('sharesPriceHistory-' + event.transaction.hash.toHex() + "-" + event.logIndex.toString())
  dp.timestamp = event.block.timestamp
  dp.value = fund.sharesPrice
  dp.save()

  fund.sharesPriceHistory.push(dp.id)
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
  let result = kyber.getExpectedRate(tokenAddress, DAI_ADDR, tenPow(15))
  return normalize(result.value1)
}

export function normalize(i: BigInt): BigDecimal {
  return i.toBigDecimal().div(PRECISION)
}