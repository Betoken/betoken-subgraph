import {
  BetokenFund
} from "../../generated/BetokenProxy/templates/BetokenFund/BetokenFund"
import {
  UpdatedFundAddress as UpdatedFundAddressEvent
} from "../../generated/BetokenProxy/BetokenProxy"
import {
  Manager,
  BasicOrder,
  CompoundOrder,
  FulcrumOrder,
  Fund,
  DataPoint
} from "../../generated/schema"
import { KyberNetwork } from "../../generated/BetokenProxy/templates/KyberNetwork/KyberNetwork"
import { 
  MiniMeToken as MiniMeTokenTemplate,
  BetokenFund as BetokenFundTemplate
} from '../../generated/BetokenProxy/templates'
import { PositionToken } from '../../generated/BetokenProxy/templates/PositionToken/PositionToken'
import { CompoundOrderContract } from '../../generated/BetokenProxy/templates/CompoundOrderContract/CompoundOrderContract'
import { MiniMeToken } from '../../generated/BetokenProxy/templates/MiniMeToken/MiniMeToken'
import { EthereumBlock } from '@graphprotocol/graph-ts'
import { BigInt, Address } from '@graphprotocol/graph-ts'

let FUND_ID = 'BetokenFund'
let ZERO = BigInt.fromI32(0)
let KYBER_ADDR = Address.fromString("0x818E6FECD516Ecc3849DAf6845e3EC868087B755")
let DAI_ADDR = Address.fromString("0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359")
let PRECISION = tenPow(18)

function getArrItem<T>(arr: Array<T>, idx: i32): T {
  let a = new Array<T>()
  a = a.concat(arr)
  return a[idx]
}

function getPriceOfToken(tokenAddress: Address): BigInt {
  let kyber = KyberNetwork.bind(KYBER_ADDR)
  let result = kyber.getExpectedRate(tokenAddress, DAI_ADDR, tenPow(15))
  return result.value1
}

function tenPow(exponent: number): BigInt {
  let result = BigInt.fromI32(1)
  for (let i = 0; i < exponent; i++) {
    result = result.times(BigInt.fromI32(10))
  }
  return result
}

// block handler

export function handleBlock(block: EthereumBlock): void {
  let fund = Fund.load(FUND_ID)
  if (fund != null) {
    for (let m = 0; m < fund.managers.length; m++) {
      let manager = Manager.load(getArrItem<string>(fund.managers, m))
      let riskTaken = ZERO
      let totalStakeValue = ZERO
      // basic orders
      for (let o = 0; o < manager.basicOrders.length; o++) {
        let order = BasicOrder.load(getArrItem<string>(manager.basicOrders, o))
        if (order.cycleNumber.equals(fund.cycleNumber)) {
          // update price
          if (!order.isSold) {
            order.sellPrice = getPriceOfToken(Address.fromString(order.tokenAddress))
            order.save()
            // record stake value
            totalStakeValue = totalStakeValue.plus(order.stake.times(order.sellPrice).div(order.buyPrice))
          }
          // record risk
          if (order.isSold) {
            riskTaken = riskTaken.plus(order.sellTime.minus(order.buyTime).times(manager.baseStake))
          } else {
            riskTaken = riskTaken.plus(block.timestamp.minus(order.buyTime).times(manager.baseStake))
          }
        }
      }

      // Fulcrum orders
      for (let o = 0; o < manager.fulcrumOrders.length; o++) {
        let order = FulcrumOrder.load(getArrItem<string>(manager.fulcrumOrders, o))
        if (order.cycleNumber.equals(fund.cycleNumber)) {
          // update price
          if (!order.isSold) {
            let pToken = PositionToken.bind(Address.fromString(order.tokenAddress))
            order.sellPrice = pToken.tokenPrice()
            order.liquidationPrice = pToken.liquidationPrice()
            order.save()
            // record stake value
            totalStakeValue = totalStakeValue.plus(order.stake.times(order.sellPrice).div(order.buyPrice))
          }
          // record risk
          if (order.isSold) {
            riskTaken = riskTaken.plus(order.sellTime.minus(order.buyTime).times(manager.baseStake))
          } else {
            riskTaken = riskTaken.plus(block.timestamp.minus(order.buyTime).times(manager.baseStake))
          }
        }
      }

      // Compound orders
      for (let o = 0; o < manager.compoundOrders.length; o++) {
        let order = CompoundOrder.load(getArrItem<string>(manager.compoundOrders, o))
        if (order.cycleNumber.equals(fund.cycleNumber) && !order.isSold) {
          let contract = CompoundOrderContract.bind(Address.fromString(order.orderAddress))
          order.collateralRatio = contract.getCurrentCollateralRatioInDAI()

          let currProfitObj = contract.getCurrentProfitInDAI() // value0: isNegative, value1: value
          order.currProfit = currProfitObj.value1.times(currProfitObj.value0 ? BigInt.fromI32(-1) : BigInt.fromI32(1))

          order.currCollateral = contract.getCurrentCollateralInDAI()
          order.currBorrow = contract.getCurrentBorrowInDAI()
          order.currCash = contract.getCurrentCashInDAI()
          order.save()

          // record stake value
          totalStakeValue = totalStakeValue.plus(order.stake.times(order.currProfit).div(order.collateralAmountInDAI).plus(order.stake))
        }

        // record risk
        if (order.cycleNumber.equals(fund.cycleNumber)) {
          if (order.isSold) {
            riskTaken = riskTaken.plus(order.sellTime.minus(order.buyTime).times(manager.baseStake))
          } else {
            riskTaken = riskTaken.plus(block.timestamp.minus(order.buyTime).times(manager.baseStake))
          }
        }
      }

      // risk taken
      manager.riskTaken = riskTaken

      // total stake value
      manager.kairoBalanceWithStake = totalStakeValue.plus(manager.kairoBalance)
      let dp = new DataPoint('kairoBalanceWithStakeHistory-' + manager.id + '-' + block.number.toString())
      dp.timestamp = block.timestamp
      dp.value = manager.kairoBalanceWithStake
      dp.save()
      manager.kairoBalanceWithStakeHistory.push(dp.id)

      manager.save()
    }
  }
}


// init fund handler

export function handleUpdatedFundAddress(event: UpdatedFundAddressEvent): void {
  // initialize fund entity
  let entity = Fund.load(FUND_ID)
  if (entity == null) {
    entity = new Fund(FUND_ID)
    let fund = BetokenFund.bind(event.params._newFundAddr)
    let kairo = MiniMeToken.bind(fund.controlTokenAddr())
    let shares = MiniMeToken.bind(fund.shareTokenAddr())
    entity.totalFundsInDAI = fund.totalFundsInDAI()
    entity.kairoPrice = fund.kairoPrice()
    entity.kairoTotalSupply = kairo.totalSupply()
    entity.sharesPrice = entity.totalFundsInDAI.times(PRECISION).div(shares.totalSupply())
    entity.sharesTotalSupply = shares.totalSupply()
    entity.sharesPriceHistory = new Array<string>()
    entity.cycleTotalCommission = ZERO
    entity.managers = new Array<string>()

    MiniMeTokenTemplate.create(fund.shareTokenAddr())
  }
  entity.address = event.params._newFundAddr.toHex()
  entity.hasFinalizedNextVersion = false
  entity.upgradeVotingActive = false
  entity.nextVersion = ""
  entity.proposers = new Array<string>()
  entity.candidates = new Array<string>()
  entity.forVotes = new Array<BigInt>()
  entity.againstVotes = new Array<BigInt>()
  entity.upgradeSignalStrength = ZERO
  entity.save()

  BetokenFundTemplate.create(event.params._newFundAddr)
}