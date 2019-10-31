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
  let fund_entity = Fund.load(Utils.FUND_ID)
  if (fund_entity == null) {
    fund_entity = new Fund(Utils.FUND_ID)
    let fund = BetokenFund.bind(event.params._newFundAddr)
    let kairo = MiniMeToken.bind(fund.controlTokenAddr())
    let shares = MiniMeToken.bind(fund.shareTokenAddr())
    fund_entity.totalFundsInDAI = Utils.normalize(fund.totalFundsInDAI())
    fund_entity.totalFundsAtPhaseStart = fund_entity.totalFundsInDAI
    fund_entity.kairoPrice = Utils.normalize(fund.kairoPrice())
    fund_entity.kairoTotalSupply = Utils.normalize(kairo.totalSupply())
    if (shares.totalSupply().equals(Utils.ZERO_INT)) {
      fund_entity.sharesPrice = BigDecimal.fromString('1')
    } else {
      fund_entity.sharesPrice = fund_entity.totalFundsInDAI.div(Utils.normalize(shares.totalSupply()))
    }
    fund_entity.sharesTotalSupply = Utils.normalize(shares.totalSupply())
    fund_entity.sharesPriceHistory = new Array<string>()
    fund_entity.aum = fund_entity.totalFundsInDAI
    fund_entity.aumHistory = new Array<string>()
    fund_entity.cycleTotalCommission = Utils.ZERO_DEC
    fund_entity.managers = new Array<string>()
    fund_entity.cycleNumber = fund.cycleNumber()
    fund_entity.cyclePhase = Utils.CyclePhase[fund.cyclePhase()]
    fund_entity.startTimeOfCyclePhase = Utils.ZERO_INT

    for (let m = 0; m < Utils.INITIAL_MANAGERS.length; m++) {
      let managerAddress = Utils.INITIAL_MANAGERS[m];
      if (Manager.load(managerAddress) == null) {
        let manager = new Manager(managerAddress)
        manager.kairoBalance = Utils.normalize(kairo.balanceOf(Address.fromString(managerAddress)))
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

        let managers = fund_entity.managers
        managers.push(manager.id)
        fund_entity.managers = managers
      }
    }
    MiniMeTokenTemplate.create(fund.shareTokenAddr())
  }

  fund_entity.address = event.params._newFundAddr.toHex()
  fund_entity.lastProcessedBlock = event.block.number
  fund_entity.hasFinalizedNextVersion = false
  fund_entity.upgradeVotingActive = false
  fund_entity.nextVersion = ""
  fund_entity.proposers = new Array<string>()
  fund_entity.candidates = new Array<string>()
  fund_entity.forVotes = new Array<BigDecimal>()
  fund_entity.againstVotes = new Array<BigDecimal>()
  fund_entity.upgradeSignalStrength = Utils.ZERO_DEC
  fund_entity.save()

  BetokenFundTemplate.create(event.params._newFundAddr)
}
