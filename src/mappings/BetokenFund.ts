import {
  ChangedPhase as ChangedPhaseEvent,
  Deposit as DepositEvent,
  Withdraw as WithdrawEvent,
  CreatedInvestment as CreatedInvestmentEvent,
  SoldInvestment as SoldInvestmentEvent,
  CreatedCompoundOrder as CreatedCompoundOrderEvent,
  SoldCompoundOrder as SoldCompoundOrderEvent,
  RepaidCompoundOrder as RepaidCompoundOrderEvent,
  CommissionPaid as CommissionPaidEvent,
  TotalCommissionPaid as TotalCommissionPaidEvent,
  Register as RegisterEvent,
  SignaledUpgrade as SignaledUpgradeEvent,
  DeveloperInitiatedUpgrade as DeveloperInitiatedUpgradeEvent,
  InitiatedUpgrade as InitiatedUpgradeEvent,
  ProposedCandidate as ProposedCandidateEvent,
  Voted as VotedEvent,
  FinalizedNextVersion as FinalizedNextVersionEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  BetokenFund
} from "../../generated/BetokenFund/BetokenFund"

import {
  Manager,
  BasicOrder,
  CompoundOrder,
  FulcrumOrder,
  CommissionRedemption,
  Investor,
  DepositWithdraw,
  Fund,
  DataPoint
} from "../../generated/schema"

import { CompoundOrderContract } from '../../generated/BetokenFund/templates/CompoundOrderContract/CompoundOrderContract'

import { BigInt, Address } from '@graphprotocol/graph-ts'

enum CyclePhase {
  INTERMISSION,
  MANAGE
}

enum VoteDirection {
  EMPTY,
  FOR,
  AGAINST
}

// Constants

import {PTOKENS} from '../fulcrum_tokens'
let RISK_THRESHOLD_TIME = BigInt.fromI32(3 * 24 * 60 * 60) // 3 days, in seconds
let ZERO = BigInt.fromI32(0)
let CALLER_REWARD = BigInt.fromI32(1e18)

// Helpers

function isUndefined(x: any): boolean { return x == null }

function isFulcrumTokenAddress(_tokenAddress: string): boolean {
  const result = PTOKENS.find((x) => !isUndefined(x.pTokens.find((y) => y.address === _tokenAddress)));
  return !isUndefined(result);
}

function assetPTokenAddressToInfo(_addr: string): object {
  return PTOKENS.find((x) => !isUndefined(x.pTokens.find((y) => y.address === _addr))).pTokens.find((y) => y.address === _addr);
}

function updateTotalFunds(fundAddress: Address): void {
  let fund = Fund.load("")
  let contract = BetokenFund.bind(fundAddress)
  fund.totalFundsInDAI = contract.totalFundsInDAI()
  fund.kairoPrice = contract.kairoPrice()
  fund.save()
}

// Handlers

export function handleChangedPhase(event: ChangedPhaseEvent): void {
  let entity = Fund.load("");
  let fund = BetokenFund.bind(event.address)
  entity.cycleNumber = event.params._cycleNumber
  entity.cyclePhase = CyclePhase[event.params._newPhase.toI32()]
  entity.startTimeOfCyclePhase = event.block.timestamp
  if (!fund.hasFinalizedNextVersion()) {
    entity.candidates.length = 0
    entity.proposers.length = 0
    entity.forVotes.length = 0
    entity.againstVotes.length = 0
    entity.upgradeVotingActive = false
    entity.upgradeSignalStrength = ZERO
    entity.nextVersion = ""
  }
  entity.save()

  let manager = Manager.load(event.transaction.from.toHex())
  if (manager != null) {
    manager.kairoBalance = manager.kairoBalance.plus(CALLER_REWARD)
  }
}

export function handleDeposit(event: DepositEvent): void {
  let entity = new DepositWithdraw(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.amountInDAI = event.params._daiAmount
  entity.timestamp = event.params._timestamp
  entity.isDeposit = true
  entity.txHash = event.transaction.hash.toHex()
  entity.save()

  updateTotalFunds(event.address)
}

export function handleWithdraw(event: WithdrawEvent): void {
  let entity = new DepositWithdraw(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.amountInDAI = event.params._daiAmount
  entity.timestamp = event.params._timestamp
  entity.isDeposit = false
  entity.txHash = event.transaction.hash.toHex()
  entity.save()

  updateTotalFunds(event.address)
}

export function handleCreatedInvestment(event: CreatedInvestmentEvent): void {
  let id = event.params._id.toString() + '-' + event.params._cycleNumber.toString()
  let entity: BasicOrder | FulcrumOrder
  if (isFulcrumTokenAddress(event.params._tokenAddress.toHex())) {
    entity = new FulcrumOrder(id);
    entity['isShort'] = assetPTokenAddressToInfo(event.params._tokenAddress.toHex())['type'];
  } else {
    entity = new BasicOrder(id);
  }
  entity.idx = event.params._id
  entity.cycleNumber = event.params._cycleNumber
  entity.tokenAddress = event.params._tokenAddress.toHex()
  entity.stake = event.params._stakeInWeis
  entity.buyPrice = event.params._buyPrice
  entity.buyTime = event.block.timestamp
  entity.save()

  let manager = Manager.load(event.params._sender.toHex())
  if (isFulcrumTokenAddress(event.params._tokenAddress.toHex())) {
    manager.fulcrumOrders.push(entity.id)
  } else {
    manager.basicOrders.push(entity.id)
  }
  manager.kairoBalance = manager.kairoBalance.minus(entity.stake)
  manager.save()
}

export function handleSoldInvestment(event: SoldInvestmentEvent): void {
  let id = event.params._id.toString() + '-' + event.params._cycleNumber.toString()
  let entity : any
  if (isFulcrumTokenAddress(event.params._tokenAddress.toHex())) {
    entity = FulcrumOrder.load(id);
  } else {
    entity = BasicOrder.load(id);
  }
  entity.isSold = true
  entity.save()

  updateTotalFunds(event.address)

  let manager = Manager.load(event.params._sender.toHex())
  manager.kairoBalance = manager.kairoBalance.plus(event.params._receivedKairo)
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
  entity.stake = event.params._stakeInWeis
  entity.collateralAmountInDAI = event.params._costDAIAmount
  entity.buyTime = event.block.timestamp
  entity.isShort = event.params._orderType
  entity.orderAddress = event.params._order.toHex()

  let contract = CompoundOrderContract.bind(event.params._order)
  entity.marketCollateralFactor = contract.getMarketCollateralFactor()

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
  entity.outputAmount = event.params._earnedDAIAmount
  entity.save()

  updateTotalFunds(event.address)

  let manager = Manager.load(event.params._sender.toHex())
  manager.kairoBalance = manager.kairoBalance.plus(event.params._receivedKairo)
  manager.save()
}

export function handleCommissionPaid(event: CommissionPaidEvent): void {
  let entity = new CommissionRedemption(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.timestamp = event.block.timestamp
  entity.cycleNumber = event.params._cycleNumber
  entity.amountInDAI = event.params._commission
  entity.txHash = event.transaction.hash.toHex()
  entity.save()

  let manager = Manager.load(event.params._sender.toHex())
  manager.commissionHistory.push(entity.id)
  manager.lastCommissionRedemption = entity.cycleNumber
  manager.save()
}

export function handleTotalCommissionPaid(event: TotalCommissionPaidEvent): void {
  let entity = Fund.load("")
  entity.cycleTotalCommission = event.params._totalCommissionInDAI
  entity.save()
}

export function handleRegister(event: RegisterEvent): void {
  let entity = new Manager(event.params._manager.toHex())
  entity.kairoBalance = event.params._kairoReceived
  entity.kairoBalanceWithStake = event.params._kairoReceived
  entity.baseStake = event.params._kairoReceived
  entity.riskTaken = ZERO
  entity.riskThreshold = entity.baseStake.times(RISK_THRESHOLD_TIME)
  entity.lastCommissionRedemption = ZERO
  entity.upgradeSignal = false
  entity.save()

  updateTotalFunds(event.address)
}

export function handleSignaledUpgrade(event: SignaledUpgradeEvent): void {
  let manager = Manager.load(event.params._sender.toHex())
  manager.upgradeSignal = event.params._inSupport
  manager.save()
}

export function handleDeveloperInitiatedUpgrade(
  event: DeveloperInitiatedUpgradeEvent
): void {
  let entity = Fund.load("")
  entity.upgradeVotingActive = true
  entity.nextVersion = event.params._candidate.toHex()
  entity.save()
}

export function handleInitiatedUpgrade(event: InitiatedUpgradeEvent): void {
  let entity = Fund.load("")
  entity.upgradeVotingActive = true
  entity.save()
}

export function handleProposedCandidate(event: ProposedCandidateEvent): void {
  let entity = Fund.load("")
  let fund = BetokenFund.bind(event.address)
  let candidates = new Array<string>(5)
  let proposers = new Array<string>(5)
  for (let i = 0; i < 5; i++) {
    candidates[i] = fund.candidates(BigInt.fromI32(i)).toHex()
    proposers[i] = fund.proposers(BigInt.fromI32(i)).toHex()
  }
  entity.candidates = candidates
  entity.proposers = proposers 
  entity.save()
}

export function handleVoted(event: VotedEvent): void {
  let entity = Fund.load("")
  let fund = BetokenFund.bind(event.address)
  let forVotes = new Array<BigInt>(5)
  let againstVotes = new Array<BigInt>(5)
  for (let i = 0; i < 5; i++) {
    forVotes[i] = fund.forVotes(BigInt.fromI32(i))
    againstVotes[i] = fund.againstVotes(BigInt.fromI32(i))
  }
  entity.forVotes = forVotes
  entity.againstVotes = againstVotes
  entity.save()

  let manager = Manager.load(event.params._sender.toHex())
  let votes = new Array<string>(5)
  for (let i = 0; i < 5; i++) {
    votes[i] = VoteDirection[fund.managerVotes(fund.cycleNumber(), event.params._sender, BigInt.fromI32(i))]
  }
  manager.votes = votes
}

export function handleFinalizedNextVersion(
  event: FinalizedNextVersionEvent
): void {
  let entity = Fund.load("")
  entity.hasFinalizedNextVersion = true
  entity.nextVersion = event.params._nextVersion.toString()
  entity.save()
}

// block handler

import { EthereumBlock } from '@graphprotocol/graph-ts'

export function handleBlock(block: EthereumBlock): void {
  let fund = Fund.load("")
  for (let m = 0; m < fund.managers.length; m++) {
    let manager = Manager.load(fund.managers[m])
    // basic orders
    for (let o = 0; o < manager.basicOrders.length; o++) {
      let order = BasicOrder.load(manager.basicOrders[o])
      if (order.cycleNumber.equals(fund.cycleNumber)) {

      }
    }
    // compound orders
    for (let o = 0; o < manager.compoundOrders.length; o++) {
      let order = CompoundOrder.load(manager.compoundOrders[o])
      if (order.cycleNumber.equals(fund.cycleNumber) && !order.isSold) {
        let contract = CompoundOrderContract.bind(Address.fromString(order.orderAddress))
        order.collateralRatio = contract.getCurrentCollateralRatioInDAI()

        let currProfitObj = contract.getCurrentProfitInDAI() // value0: isNegative, value1: value
        order.currProfit = currProfitObj.value1.times(currProfitObj.value0 ? BigInt.fromI32(-1) : BigInt.fromI32(1))

        order.currCollateral = contract.getCurrentCollateralInDAI()
        order.currBorrow = contract.getCurrentBorrowInDAI()
        order.currCash = contract.getCurrentCashInDAI()
        order.save()
      }
    }
  }
}