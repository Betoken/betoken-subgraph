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
    entity.aum = entity.totalFundsInDAI
    entity.aumHistory = new Array<string>()
    entity.cycleTotalCommission = Utils.ZERO_DEC
    entity.managers = new Array<string>()
    entity.cycleNumber = fund.cycleNumber()
    entity.cyclePhase = Utils.CyclePhase[fund.cyclePhase()]

    for (let m = 0; m < Utils.INITIAL_MANAGERS.length; m++) {
      let managerAddress = Utils.INITIAL_MANAGERS[m];
      if (Manager.load(managerAddress) == null) {
        let manager = new Manager(managerAddress)
        manager.kairoBalance = Utils.normalize(kairo.balanceOf(Address.fromString(managerAddress)))
        manager.kairoBalanceWithStake = manager.kairoBalance
        manager.kairoBalanceWithStakeHistory = new Array<string>()
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