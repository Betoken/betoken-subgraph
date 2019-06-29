import {
  ChangedPhase as ChangedPhaseEvent,
  Deposit as DepositEvent,
  Withdraw as WithdrawEvent,
  CreatedInvestment as CreatedInvestmentEvent,
  SoldInvestment as SoldInvestmentEvent,
  CreatedCompoundOrder as CreatedCompoundOrderEvent,
  SoldCompoundOrder as SoldCompoundOrderEvent,
  CommissionPaid as CommissionPaidEvent,
  TotalCommissionPaid as TotalCommissionPaidEvent,
  Register as RegisterEvent,
  SignaledUpgrade as SignaledUpgradeEvent,
  DeveloperInitiatedUpgrade as DeveloperInitiatedUpgradeEvent,
  InitiatedUpgrade as InitiatedUpgradeEvent,
  ProposedCandidate as ProposedCandidateEvent,
  Voted as VotedEvent,
  FinalizedNextVersion as FinalizedNextVersionEvent,
  BetokenFund,
} from "../../generated/BetokenProxy/templates/BetokenFund/BetokenFund"

import { Transfer as TransferEvent } from "../../generated/BetokenProxy/templates/MiniMeToken/MiniMeToken"

import {
  Manager,
  BasicOrder,
  CompoundOrder,
  FulcrumOrder,
  CommissionRedemption,
  Investor,
  DepositWithdraw,
  Fund
} from "../../generated/schema"

import { CompoundOrder as CompoundOrderContract } from '../../generated/BetokenProxy/templates/CompoundOrder/CompoundOrder'
import { PositionToken } from '../../generated/BetokenProxy/templates/PositionToken/PositionToken'
import { MiniMeToken } from '../../generated/BetokenProxy/templates/MiniMeToken/MiniMeToken'

import { BigInt, Address, BigDecimal } from '@graphprotocol/graph-ts'

import * as Utils from '../utils'

// Handlers

export function handleChangedPhase(event: ChangedPhaseEvent): void {
  let entity = Fund.load(Utils.FUND_ID);
  let fund = BetokenFund.bind(event.address)

  entity.cycleNumber = event.params._cycleNumber
  entity.cyclePhase = Utils.CyclePhase[event.params._newPhase.toI32()]
  entity.startTimeOfCyclePhase = event.block.timestamp
  if (!fund.hasFinalizedNextVersion()) {
    entity.candidates.length = 0
    entity.proposers.length = 0
    entity.forVotes.length = 0
    entity.againstVotes.length = 0
    entity.upgradeVotingActive = false
    entity.upgradeSignalStrength = Utils.ZERO_DEC
    entity.nextVersion = ""
  }
  entity.save()

  let caller = Manager.load(event.transaction.from.toHex())
  if (caller != null) {
    caller.kairoBalance = caller.kairoBalance.plus(Utils.CALLER_REWARD)
  }
  caller.save()

  for (let m: i32 = 0; m < entity.managers.length; m++) {
    let manager = Manager.load(Utils.getArrItem<string>(entity.managers, m))
    manager.baseStake = manager.kairoBalance
    manager.riskTaken = Utils.ZERO_DEC
    manager.riskThreshold = manager.baseStake.times(Utils.RISK_THRESHOLD_TIME)
    manager.save()
  }
}

export function handleDeposit(event: DepositEvent): void {
  let investor = Investor.load(event.transaction.from.toHex())
  if (investor == null) {
    investor = new Investor(event.transaction.from.toHex())
    let fund = BetokenFund.bind(event.address)
    let shares = MiniMeToken.bind(fund.shareTokenAddr())
    investor.sharesBalance = Utils.normalize(shares.balanceOf(Address.fromString(investor.id)))
    investor.depositWithdrawHistory = new Array<string>()
    investor.save()
  }

  let entity = new DepositWithdraw(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.amountInDAI = Utils.normalize(event.params._daiAmount)
  entity.timestamp = event.params._timestamp
  entity.isDeposit = true
  entity.txHash = event.transaction.hash.toHex()
  entity.save()

  investor.depositWithdrawHistory.push(entity.id)
  investor.save()

  Utils.updateTotalFunds(event)
}

export function handleWithdraw(event: WithdrawEvent): void {
  let investor = Investor.load(event.transaction.from.toHex())
  if (investor == null) {
    investor = new Investor(event.transaction.from.toHex())
    let fund = BetokenFund.bind(event.address)
    let shares = MiniMeToken.bind(fund.shareTokenAddr())
    investor.sharesBalance = Utils.normalize(shares.balanceOf(Address.fromString(investor.id)))
    investor.depositWithdrawHistory = new Array<string>()
    investor.save()
  }

  let entity = new DepositWithdraw(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.amountInDAI = Utils.normalize(event.params._daiAmount)
  entity.timestamp = event.params._timestamp
  entity.isDeposit = false
  entity.txHash = event.transaction.hash.toHex()
  entity.save()

  investor.depositWithdrawHistory.push(entity.id)
  investor.save()

  Utils.updateTotalFunds(event)
}

export function handleCreatedInvestment(event: CreatedInvestmentEvent): void {
  let id = event.params._id.toString() + '-' + event.params._cycleNumber.toString()
  let tokenContract = MiniMeToken.bind(event.params._tokenAddress)
  let decimals: i32 = tokenContract.decimals()
  if (Utils.isFulcrumTokenAddress(event.params._tokenAddress.toHex())) {
    let entity = new FulcrumOrder(id);
    entity.isShort = Utils.assetPTokenAddressToInfo(event.params._tokenAddress.toHex()).type;
    entity.idx = event.params._id
    entity.cycleNumber = event.params._cycleNumber
    entity.tokenAddress = event.params._tokenAddress.toHex()
    entity.tokenAmount = event.params._tokenAmount.toBigDecimal().div(Utils.tenPow(decimals).toBigDecimal())
    entity.stake = Utils.normalize(event.params._stakeInWeis)
    entity.buyPrice = Utils.normalize(event.params._buyPrice)
    entity.buyTime = event.block.timestamp
    entity.sellTime = Utils.ZERO_INT
    entity.isSold = false
    let pToken = PositionToken.bind(event.params._tokenAddress)
    entity.sellPrice = Utils.normalize(pToken.tokenPrice())
    entity.liquidationPrice = Utils.normalize(pToken.liquidationPrice())
    entity.save()
  } else {
    let entity = new BasicOrder(id);
    entity.idx = event.params._id
    entity.cycleNumber = event.params._cycleNumber
    entity.tokenAddress = event.params._tokenAddress.toHex()
    entity.tokenAmount = event.params._tokenAmount.toBigDecimal().div(Utils.tenPow(decimals).toBigDecimal())
    entity.stake = Utils.normalize(event.params._stakeInWeis)
    entity.buyPrice = Utils.normalize(event.params._buyPrice)
    entity.sellPrice = Utils.getPriceOfToken(event.params._tokenAddress)
    entity.buyTime = event.block.timestamp
    entity.sellTime = Utils.ZERO_INT
    entity.isSold = false
    entity.save()
  }

  let manager = Manager.load(event.params._sender.toHex())
  if (Utils.isFulcrumTokenAddress(event.params._tokenAddress.toHex())) {
    manager.fulcrumOrders.push(id)
  } else {
    manager.basicOrders.push(id)
  }
  manager.kairoBalance = manager.kairoBalance.minus(Utils.normalize(event.params._stakeInWeis))
  manager.save()
}

export function handleSoldInvestment(event: SoldInvestmentEvent): void {
  let id = event.params._id.toString() + '-' + event.params._cycleNumber.toString()
  if (Utils.isFulcrumTokenAddress(event.params._tokenAddress.toHex())) {
    let entity = FulcrumOrder.load(id);
    entity.isSold = true
    entity.sellTime = event.block.timestamp
    entity.sellPrice = Utils.normalize(event.params._sellPrice)
    entity.save()
  } else {
    let entity = BasicOrder.load(id);
    entity.isSold = true
    entity.sellTime = event.block.timestamp
    entity.sellPrice = Utils.normalize(event.params._sellPrice)
    entity.save()
  }
  
  Utils.updateTotalFunds(event)

  let manager = Manager.load(event.params._sender.toHex())
  manager.kairoBalance = manager.kairoBalance.plus(Utils.normalize(event.params._receivedKairo))
  manager.save()
}

export function handleCreatedCompoundOrder(
  event: CreatedCompoundOrderEvent
): void {
  let id = event.params._id.toString() + '-' + event.params._cycleNumber.toString()
  let entity = new CompoundOrder(id)
  entity.idx = event.params._id
  entity.cycleNumber = event.params._cycleNumber
  entity.tokenAddress = event.params._tokenAddress.toHex()
  entity.stake = Utils.normalize(event.params._stakeInWeis)
  entity.collateralAmountInDAI = Utils.normalize(event.params._costDAIAmount)
  entity.buyTime = event.block.timestamp
  entity.sellTime = Utils.ZERO_INT
  entity.isShort = event.params._orderType
  entity.orderAddress = event.params._order.toHex()
  entity.outputAmount = Utils.ZERO_DEC

  let contract = CompoundOrderContract.bind(event.params._order)
  entity.marketCollateralFactor = Utils.normalize(contract.getMarketCollateralFactor())
  entity.collateralRatio = Utils.normalize(contract.getCurrentCollateralRatioInDAI())
  let currProfitObj = contract.getCurrentProfitInDAI() // value0: isNegative, value1: value
  entity.currProfit = Utils.normalize(currProfitObj.value1.times(currProfitObj.value0 ? BigInt.fromI32(-1) : BigInt.fromI32(1)))
  entity.currCollateral = Utils.normalize(contract.getCurrentCollateralInDAI())
  entity.currBorrow = Utils.normalize(contract.getCurrentBorrowInDAI())
  entity.currCash = Utils.normalize(contract.getCurrentCashInDAI())
  entity.save()

  let manager = Manager.load(event.params._sender.toHex())
  manager.compoundOrders.push(entity.id)
  manager.kairoBalance = manager.kairoBalance.minus(entity.stake)
  manager.save()
}

export function handleSoldCompoundOrder(event: SoldCompoundOrderEvent): void {
  let id = event.params._id.toString() + '-' + event.params._cycleNumber.toString()
  let entity = CompoundOrder.load(id)
  entity.isSold = true
  entity.sellTime = event.block.timestamp
  entity.outputAmount = Utils.normalize(event.params._earnedDAIAmount)
  entity.save()

  Utils.updateTotalFunds(event)

  let manager = Manager.load(event.params._sender.toHex())
  manager.kairoBalance = manager.kairoBalance.plus(Utils.normalize(event.params._receivedKairo))
  manager.save()
}

export function handleCommissionPaid(event: CommissionPaidEvent): void {
  let entity = new CommissionRedemption(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.timestamp = event.block.timestamp
  entity.cycleNumber = event.params._cycleNumber
  entity.amountInDAI = Utils.normalize(event.params._commission)
  entity.txHash = event.transaction.hash.toHex()
  entity.save()

  let manager = Manager.load(event.params._sender.toHex())
  manager.commissionHistory.push(entity.id)
  manager.lastCommissionRedemption = entity.cycleNumber
  manager.save()
}

export function handleTotalCommissionPaid(event: TotalCommissionPaidEvent): void {
  let entity = Fund.load(Utils.FUND_ID)
  entity.cycleTotalCommission = Utils.normalize(event.params._totalCommissionInDAI)
  entity.save()
}

export function handleRegister(event: RegisterEvent): void {
  let entity = new Manager(event.params._manager.toHex())
  entity.kairoBalance = Utils.normalize(event.params._kairoReceived)
  entity.kairoBalanceWithStake = entity.kairoBalance
  entity.kairoBalanceWithStakeHistory = new Array<string>()
  entity.baseStake = entity.kairoBalance
  entity.riskTaken = Utils.ZERO_DEC
  entity.riskThreshold = entity.baseStake.times(Utils.RISK_THRESHOLD_TIME)
  entity.lastCommissionRedemption = Utils.ZERO_INT
  entity.basicOrders = new Array<string>()
  entity.fulcrumOrders = new Array<string>()
  entity.compoundOrders = new Array<string>()
  entity.commissionHistory = new Array<string>()
  entity.votes = new Array<string>()
  entity.upgradeSignal = false
  entity.save()

  Utils.updateTotalFunds(event)
}

export function handleSignaledUpgrade(event: SignaledUpgradeEvent): void {
  let manager = Manager.load(event.params._sender.toHex())
  manager.upgradeSignal = event.params._inSupport
  manager.save()
}

export function handleDeveloperInitiatedUpgrade(
  event: DeveloperInitiatedUpgradeEvent
): void {
  let entity = Fund.load(Utils.FUND_ID)
  entity.upgradeVotingActive = true
  entity.nextVersion = event.params._candidate.toHex()
  entity.save()
}

export function handleInitiatedUpgrade(event: InitiatedUpgradeEvent): void {
  let entity = Fund.load(Utils.FUND_ID)
  entity.upgradeVotingActive = true
  entity.save()
}

export function handleProposedCandidate(event: ProposedCandidateEvent): void {
  let entity = Fund.load(Utils.FUND_ID)
  let fund = BetokenFund.bind(event.address)
  let candidates = new Array<string>()
  let proposers = new Array<string>()
  for (let i = 0; i < 5; i++) {
    candidates.push(fund.candidates(BigInt.fromI32(i)).toHex())
    proposers.push(fund.proposers(BigInt.fromI32(i)).toHex())
  }
  entity.candidates = candidates
  entity.proposers = proposers 
  entity.save()
}

export function handleVoted(event: VotedEvent): void {
  let entity = Fund.load(Utils.FUND_ID)
  let fund = BetokenFund.bind(event.address)
  let forVotes = new Array<BigDecimal>()
  let againstVotes = new Array<BigDecimal>()
  for (let i = 0; i < 5; i++) {
    forVotes.push(Utils.normalize(fund.forVotes(BigInt.fromI32(i))))
    againstVotes.push(Utils.normalize(fund.againstVotes(BigInt.fromI32(i))))
  }
  entity.forVotes = forVotes
  entity.againstVotes = againstVotes
  entity.save()

  let manager = Manager.load(event.params._sender.toHex())
  let votes = new Array<string>()
  for (let i = 0; i < 5; i++) {
    votes.push(Utils.VoteDirection[fund.managerVotes(fund.cycleNumber(), event.params._sender, BigInt.fromI32(i))])
  }
  manager.votes = votes
}

export function handleFinalizedNextVersion(
  event: FinalizedNextVersionEvent
): void {
  let entity = Fund.load(Utils.FUND_ID)
  entity.hasFinalizedNextVersion = true
  entity.nextVersion = event.params._nextVersion.toString()
  entity.save()
}

// token transfer handler

export function handleTokenTransfer(event: TransferEvent): void {
  let contract = MiniMeToken.bind(event.address)
  if (contract.symbol() === "BTKS") {
    let to = event.params._to
    let investor = Investor.load(to.toHex())
    if (investor == null) {
      // create new investor entity
      investor = new Investor(to.toHex())
      investor.depositWithdrawHistory = new Array<string>()
    }
    // update balances
    let from = Investor.load(event.params._from.toHex())
    from.sharesBalance = Utils.normalize(contract.balanceOf(event.params._from))
    from.save()
    investor.sharesBalance = Utils.normalize(contract.balanceOf(to))
    investor.save()
  }
}