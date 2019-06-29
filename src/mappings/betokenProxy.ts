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
import { BigDecimal } from '@graphprotocol/graph-ts'

import * as Utils from '../utils'

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