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
} from "../generated/BetokenFund/BetokenFund"

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
} from "../generated/schema"

import { BigInt } from '@graphprotocol/graph-ts'

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

const PTOKENS = require('./fulcrum_tokens.json');
const RISK_THRESHOLD_TIME = BigInt.fromI32(3 * 24 * 60 * 60) // 3 days, in seconds
const ZERO = BigInt.fromI32(0)

// Helpers

export const isUndefined = (x) => x == null;

export const isFulcrumTokenAddress = (_tokenAddress) => {
  const result = PTOKENS.find((x) => !isUndefined(x.pTokens.find((y) => y.address === _tokenAddress)));
  return !isUndefined(result);
}

export const assetPTokenAddressToInfo = (_addr) => {
  return PTOKENS.find((x) => !isUndefined(x.pTokens.find((y) => y.address === _addr))).pTokens.find((y) => y.address === _addr);
}

// Handlers

export function handleChangedPhase(event: ChangedPhaseEvent): void {
  let entity = Fund.load("0");
  entity.cycleNumber = event.params._cycleNumber
  entity.cyclePhase = CyclePhase[event.params._newPhase.toI32()]
  if (!entity.hasFinalizedNextVersion) {
    entity.candidates.length = 0
    entity.proposers.length = 0
    entity.forVotes.length = 0
    entity.againstVotes.length = 0
    entity.upgradeVotingActive = false
    entity.upgradeSignalStrength = ZERO
    entity.nextVersion = ""
  }
  entity.save()
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
}

export function handleCreatedInvestment(event: CreatedInvestmentEvent): void {
  let id = event.params._id.toString() + '-' + event.params._cycleNumber.toString()
  let entity;
  if (isFulcrumTokenAddress(event.params._tokenAddress)) {
    entity = new FulcrumOrder(id);
    entity.isShort = assetPTokenAddressToInfo(event.params._tokenAddress).type;
  } else {
    entity = new BasicOrder(id);
  }
  entity.idx = event.params._id
  entity.cycleNumber = event.params._cycleNumber
  entity.tokenAddress = event.params._tokenAddress
  entity.stake = event.params._stakeInWeis
  entity.buyPrice = event.params._buyPrice
  entity.buyTime = event.block.timestamp
  entity.save()

  let manager = Manager.load(event.params._sender.toHex())
  if (isFulcrumTokenAddress(event.params._tokenAddress)) {
    manager.fulcrumOrders.push(entity.id)
  } else {
    manager.basicOrders.push(entity.id)
  }
  manager.save()
}

export function handleSoldInvestment(event: SoldInvestmentEvent): void {
  let id = event.params._id.toString() + '-' + event.params._cycleNumber.toString()
  let entity;
  if (isFulcrumTokenAddress(event.params._tokenAddress)) {
    entity = FulcrumOrder.load(id);
  } else {
    entity = BasicOrder.load(id);
  }
  entity.isSold = true
  entity.save()
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
  entity.save()

  let manager = Manager.load(event.params._sender.toHex())
  manager.compoundOrders.push(entity.id)
  manager.save()
}

export function handleSoldCompoundOrder(event: SoldCompoundOrderEvent): void {
  let id = event.params._id.toString() + '-' + event.params._cycleNumber.toString()
  let entity = CompoundOrder.load(id)
  entity.isSold = true
  entity.save()
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
  manager.save()
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
}

export function handleSignaledUpgrade(event: SignaledUpgradeEvent): void {
  let manager = Manager.load(event.params._sender.toHex())
  manager.upgradeSignal = event.params._inSupport
  manager.save()
}

export function handleDeveloperInitiatedUpgrade(
  event: DeveloperInitiatedUpgradeEvent
): void {
  let entity = Fund.load("0")
  entity.upgradeVotingActive = true
  entity.nextVersion = event.params._candidate.toHex()
  entity.save()
}

export function handleInitiatedUpgrade(event: InitiatedUpgradeEvent): void {
  let entity = Fund.load("0")
  entity.upgradeVotingActive = true
  entity.save()
}

export function handleProposedCandidate(event: ProposedCandidateEvent): void {
  let entity = Fund.load("0")
  let voteID = event.params._voteID
  if (voteID.gt(BigInt.fromI32(entity.candidates.length - 1))) {
    // candidate for new chunk, push
    entity.candidates.push(event.params._candidate.toHex())
    entity.proposers.push(event.params._sender.toHex())
  } else {
    // update current chunk
    entity.candidates[voteID.toI32()] = event.params._candidate.toHex()
    entity.proposers[voteID.toI32()] = event.params._sender.toHex()
  }
  entity.save()
}

export function handleVoted(event: VotedEvent): void {
  let entity = new Voted(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._cycleNumber = event.params._cycleNumber
  entity._voteID = event.params._voteID
  entity._sender = event.params._sender
  entity._inSupport = event.params._inSupport
  entity._weight = event.params._weight
  entity.save()
}

export function handleFinalizedNextVersion(
  event: FinalizedNextVersionEvent
): void {
  let entity = new FinalizedNextVersion(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._cycleNumber = event.params._cycleNumber
  entity._nextVersion = event.params._nextVersion
  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner
  entity.save()
}
