import {
  BetokenFund
} from "../../generated/BetokenProxy/templates/BetokenFund/BetokenFund"
import {
  UpdatedFundAddress as UpdatedFundAddressEvent
} from "../../generated/BetokenProxy/BetokenProxy"
import {
  Fund
} from "../../generated/schema"
import {
  MiniMeToken as MiniMeTokenTemplate,
  BetokenFund as BetokenFundTemplate
} from '../../generated/BetokenProxy/templates'
import { MiniMeToken } from '../../generated/BetokenProxy/templates/MiniMeToken/MiniMeToken'
import { BigDecimal, Address } from '@graphprotocol/graph-ts'

import * as Utils from '../utils'
import { Manager } from "../../generated/schema";

// init fund handler

export function handleUpdatedFundAddress(event: UpdatedFundAddressEvent): void {
  // initialize fund entity
  let entity = Fund.load(Utils.FUND_ID)
  if (entity == null) {
    entity = new Fund(Utils.FUND_ID)
    let fund = BetokenFund.bind(event.params._newFundAddr)
    let kairo = MiniMeToken.bind(fund.controlTokenAddr())
    let shares = MiniMeToken.bind(fund.shareTokenAddr())
    entity.totalFundsInDAI = Utils.ZERO_DEC
    entity.kairoPrice = Utils.INITIAL_KRO_PRICE
    entity.kairoTotalSupply = Utils.normalize(kairo.totalSupplyAt(event.block.number))
    entity.sharesPrice = Utils.PRECISION
    entity.sharesTotalSupply = Utils.normalize(shares.totalSupplyAt(event.block.number))
    entity.sharesPriceHistory = new Array<string>()
    entity.aum = Utils.ZERO_DEC
    entity.totalFundsHistory = new Array<string>()
    entity.cycleTotalCommission = Utils.ZERO_DEC
    entity.managers = new Array<string>()
    entity.cycleNumber = Utils.ZERO_INT
    entity.cyclePhase = Utils.CyclePhase[1]

    for (let m = 0; m < Utils.INITIAL_MANAGERS.length; m++) {
      let managerAddress = Utils.INITIAL_MANAGERS[m];
      if (Manager.load(managerAddress) == null) {
        let manager = new Manager(managerAddress)
        manager.kairoBalance = Utils.normalize(kairo.balanceOfAt(Address.fromString(managerAddress), event.block.number))
        manager.kairoBalanceWithStake = manager.kairoBalance
        manager.baseStake = manager.kairoBalance
        manager.riskTaken = Utils.ZERO_DEC
        manager.riskThreshold = manager.baseStake.times(Utils.RISK_THRESHOLD_TIME)
        manager.lastCommissionRedemption = Utils.ZERO_INT
        manager.basicOrders = new Array<string>()
        manager.fulcrumOrders = new Array<string>()
        manager.compoundOrders = new Array<string>()
        manager.commissionHistory = new Array<string>()
        manager.votes = new Array<string>()
        manager.upgradeSignal = false
        manager.totalCommissionReceived = Utils.ZERO_DEC
        manager.save()

        let managers = entity.managers
        managers.push(manager.id)
        entity.managers = managers
        entity.save()
      }
    }

    MiniMeTokenTemplate.create(fund.shareTokenAddr())
  }
  entity.address = event.params._newFundAddr.toHex()
  entity.lastProcessedBlock = event.block.number
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