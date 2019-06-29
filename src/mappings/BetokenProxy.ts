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
import { 
  MiniMeToken as MiniMeTokenTemplate,
  BetokenFund as BetokenFundTemplate
} from '../../generated/BetokenProxy/templates'
import { PositionToken } from '../../generated/BetokenProxy/templates/PositionToken/PositionToken'
import { CompoundOrder as CompoundOrderContract } from '../../generated/BetokenProxy/templates/CompoundOrder/CompoundOrder'
import { MiniMeToken } from '../../generated/BetokenProxy/templates/MiniMeToken/MiniMeToken'
import { EthereumBlock, BigDecimal } from '@graphprotocol/graph-ts'
import { BigInt, Address } from '@graphprotocol/graph-ts'

import * as Utils from '../utils'

// block handler

export function handleBlock(block: EthereumBlock): void {
  let fund = Fund.load(Utils.FUND_ID)
  if (fund != null) {
    for (let m = 0; m < fund.managers.length; m++) {
      let manager = Manager.load(Utils.getArrItem<string>(fund.managers, m))
      let riskTaken = Utils.ZERO_DEC
      let totalStakeValue = Utils.ZERO_DEC
      // basic orders
      for (let o = 0; o < manager.basicOrders.length; o++) {
        let order = BasicOrder.load(Utils.getArrItem<string>(manager.basicOrders, o))
        if (order.cycleNumber.equals(fund.cycleNumber)) {
          // update price
          if (!order.isSold) {
            order.sellPrice = Utils.getPriceOfToken(Address.fromString(order.tokenAddress))
            order.save()
            // record stake value
            if (order.buyPrice.equals(Utils.ZERO_DEC)) {
              totalStakeValue = totalStakeValue.plus(order.stake)
            } else {
              totalStakeValue = totalStakeValue.plus(order.stake.times(order.sellPrice).div(order.buyPrice))
            }
          }
          // record risk
          let time: BigDecimal
          if (order.isSold) {
            time = order.sellTime.minus(order.buyTime).toBigDecimal()
          } else {
            time = block.timestamp.minus(order.buyTime).toBigDecimal()
          }
          riskTaken = riskTaken.plus(manager.baseStake.times(time))
        }
      }

      // Fulcrum orders
      for (let o = 0; o < manager.fulcrumOrders.length; o++) {
        let order = FulcrumOrder.load(Utils.getArrItem<string>(manager.fulcrumOrders, o))
        if (order.cycleNumber.equals(fund.cycleNumber)) {
          // update price
          if (!order.isSold) {
            let pToken = PositionToken.bind(Address.fromString(order.tokenAddress))
            order.sellPrice = Utils.normalize(pToken.tokenPrice())
            order.liquidationPrice = Utils.normalize(pToken.liquidationPrice())
            order.save()
            // record stake value
            if (order.buyPrice.equals(Utils.ZERO_DEC)) {
              totalStakeValue = totalStakeValue.plus(order.stake)
            } else {
              totalStakeValue = totalStakeValue.plus(order.stake.times(order.sellPrice).div(order.buyPrice))
            }
          }
          // record risk
          let time: BigDecimal
          if (order.isSold) {
            time = order.sellTime.minus(order.buyTime).toBigDecimal()
          } else {
            time = block.timestamp.minus(order.buyTime).toBigDecimal()
          }
          riskTaken = riskTaken.plus(manager.baseStake.times(time))
        }
      }

      // Compound orders
      for (let o = 0; o < manager.compoundOrders.length; o++) {
        let order = CompoundOrder.load(Utils.getArrItem<string>(manager.compoundOrders, o))
        if (order.cycleNumber.equals(fund.cycleNumber) && !order.isSold) {
          let contract = CompoundOrderContract.bind(Address.fromString(order.orderAddress))
          order.collateralRatio = Utils.normalize(contract.getCurrentCollateralRatioInDAI())

          let currProfitObj = contract.getCurrentProfitInDAI() // value0: isNegative, value1: value
          order.currProfit = Utils.normalize(currProfitObj.value1.times(currProfitObj.value0 ? BigInt.fromI32(-1) : BigInt.fromI32(1)))

          order.currCollateral = Utils.normalize(contract.getCurrentCollateralInDAI())
          order.currBorrow = Utils.normalize(contract.getCurrentBorrowInDAI())
          order.currCash = Utils.normalize(contract.getCurrentCashInDAI())
          order.save()

          // record stake value
          if (order.collateralAmountInDAI.equals(Utils.ZERO_DEC)) {
            totalStakeValue = totalStakeValue.plus(order.stake)
          } else {
            totalStakeValue = totalStakeValue.plus(order.stake.times(order.currProfit).div(order.collateralAmountInDAI).plus(order.stake))
          }
        }

        // record risk
        if (order.cycleNumber.equals(fund.cycleNumber)) {
          let time: BigDecimal
          if (order.isSold) {
            time = order.sellTime.minus(order.buyTime).toBigDecimal()
          } else {
            time = block.timestamp.minus(order.buyTime).toBigDecimal()
          }
          riskTaken = riskTaken.plus(manager.baseStake.times(time))
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
  let entity = Fund.load(Utils.FUND_ID)
  if (entity == null) {
    entity = new Fund(Utils.FUND_ID)
    let fund = BetokenFund.bind(event.params._newFundAddr)
    let kairo = MiniMeToken.bind(fund.controlTokenAddr())
    let shares = MiniMeToken.bind(fund.shareTokenAddr())
    entity.totalFundsInDAI = Utils.normalize(fund.totalFundsInDAI())
    entity.kairoPrice = Utils.normalize(fund.kairoPrice())
    entity.kairoTotalSupply = Utils.normalize(kairo.totalSupply())
    if (shares.totalSupply().equals(Utils.ZERO_INT)) {
      entity.sharesPrice = Utils.PRECISION
    } else {
      entity.sharesPrice = entity.totalFundsInDAI.div(Utils.normalize(shares.totalSupply()))
    }
    entity.sharesTotalSupply = Utils.normalize(shares.totalSupply())
    entity.sharesPriceHistory = new Array<string>()
    entity.cycleTotalCommission = Utils.ZERO_DEC
    entity.managers = new Array<string>()

    MiniMeTokenTemplate.create(fund.shareTokenAddr())
  }
  entity.address = event.params._newFundAddr.toHex()
  entity.hasFinalizedNextVersion = false
  entity.upgradeVotingActive = false
  entity.nextVersion = ""
  entity.proposers = new Array<string>()
  entity.candidates = new Array<string>()
  entity.forVotes = new Array<BigDecimal>()
  entity.againstVotes = new Array<BigDecimal>()
  entity.upgradeSignalStrength = Utils.ZERO_DEC
  entity.save()

  BetokenFundTemplate.create(event.params._newFundAddr)
}