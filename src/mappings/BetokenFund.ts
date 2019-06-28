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
  FundCreated as FundCreatedEvent,
  BetokenFund,
} from "../../generated/BetokenFund/BetokenFund"

import { Transfer as TransferEvent } from "../../generated/BetokenFund/templates/MiniMeToken/MiniMeToken"

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
import { PositionToken } from '../../generated/BetokenFund/templates/PositionToken/PositionToken'
import { MiniMeToken } from '../../generated/BetokenFund/templates/MiniMeToken/MiniMeToken'
import { KyberNetwork } from "../../generated/BetokenFund/templates/KyberNetwork/KyberNetwork"
import { MiniMeToken as MiniMeTokenTemplate } from '../../generated/BetokenFund/templates'

import { BigInt, Address, EthereumEvent } from '@graphprotocol/graph-ts'

// Constants

let CyclePhase = new Array<string>()
CyclePhase.push('INTERMISSION')
CyclePhase.push('MANAGE')

let VoteDirection = new Array<string>()
VoteDirection.push('EMPTY')
VoteDirection.push('FOR')
VoteDirection.push('AGAINST')

import { PTOKENS, pTokenInfo } from '../fulcrum_tokens'
let RISK_THRESHOLD_TIME = BigInt.fromI32(3 * 24 * 60 * 60) // 3 days, in seconds
let ZERO = BigInt.fromI32(0)
let CALLER_REWARD = tenPow(18) // 10 ** 18 or 1 KRO
let PRECISION = tenPow(18)
let KYBER_ADDR = Address.fromString("0x818E6FECD516Ecc3849DAf6845e3EC868087B755")
let DAI_ADDR = Address.fromString("0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359")
let BETOKEN_ADDR = Address.fromString("0x4769890a00FB46cBd9C3F771Cc60FdEE439Bb230")
let FUND_ID = 'BetokenFund'

// Helpers

function isFulcrumTokenAddress(_tokenAddress: string): boolean {
  let result = PTOKENS.findIndex((x) => x.pTokens.findIndex((y) => y.address === _tokenAddress) != -1);
  return result != -1;
}

function assetPTokenAddressToInfo(_addr: string): pTokenInfo {
  let pTokens = PTOKENS[PTOKENS.findIndex((x) => x.pTokens.findIndex((y) => y.address === _addr) != -1)].pTokens;
  return pTokens[pTokens.findIndex((y) => y.address === _addr)]
}

function updateTotalFunds(fundAddress: Address, event: EthereumEvent): void {
  let fund = Fund.load(FUND_ID)
  let fundContract = BetokenFund.bind(fundAddress)
  let kairo = kairoContract(fundAddress)
  let shares = sharesContract(fundAddress)
  fund.totalFundsInDAI = fundContract.totalFundsInDAI()
  fund.kairoPrice = fundContract.kairoPrice()
  fund.kairoTotalSupply = kairo.totalSupply()
  fund.sharesPrice = fund.totalFundsInDAI.times(PRECISION).div(shares.totalSupply())
  fund.sharesTotalSupply = shares.totalSupply()

  let dp = new DataPoint('sharesPriceHistory-' + event.transaction.hash.toHex() + "-" + event.logIndex.toString())
  dp.timestamp = event.block.timestamp
  dp.value = fund.sharesPrice
  dp.save()

  fund.sharesPriceHistory.push(dp.id)
  fund.save()
}

function tenPow(exponent: number): BigInt {
  let result = BigInt.fromI32(1)
  for (let i = 0; i < exponent; i++) {
    result = result.times(BigInt.fromI32(10))
  }
  return result
}

function getPriceOfToken(tokenAddress: Address): BigInt {
  let kyber = KyberNetwork.bind(KYBER_ADDR)
  let result = kyber.getExpectedRate(tokenAddress, DAI_ADDR, tenPow(15))
  return result.value1
}

function kairoContract(fundAddress: Address): MiniMeToken {
  let fund = BetokenFund.bind(fundAddress)
  return MiniMeToken.bind(fund.controlTokenAddr())
}

function sharesContract(fundAddress: Address): MiniMeToken {
  let fund = BetokenFund.bind(fundAddress)
  return MiniMeToken.bind(fund.shareTokenAddr())
}

function getArrItem<T>(arr: Array<T>, idx: i32): T {
  let a = new Array<T>()
  a = a.concat(arr)
  return a[idx]
}

// Handlers

export function handleChangedPhase(event: ChangedPhaseEvent): void {
  let entity = Fund.load(FUND_ID);
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

  let caller = Manager.load(event.transaction.from.toHex())
  if (caller != null) {
    caller.kairoBalance = caller.kairoBalance.plus(CALLER_REWARD)
  }
  caller.save()

  for (let m: i32 = 0; m < entity.managers.length; m++) {
    let manager = Manager.load(getArrItem<string>(entity.managers, m))
    manager.baseStake = manager.kairoBalance
    manager.riskTaken = ZERO
    manager.riskThreshold = manager.baseStake.times(RISK_THRESHOLD_TIME)
    manager.save()
  }
}

export function handleDeposit(event: DepositEvent): void {
  let investor = Investor.load(event.transaction.from.toHex())
  if (investor == null) {
    investor = new Investor(event.transaction.from.toHex())
    let fund = BetokenFund.bind(event.address)
    let shares = MiniMeToken.bind(fund.shareTokenAddr())
    investor.sharesBalance = shares.balanceOf(Address.fromString(investor.id))
    investor.depositWithdrawHistory = new Array<string>()
    investor.save()
  }

  let entity = new DepositWithdraw(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.amountInDAI = event.params._daiAmount
  entity.timestamp = event.params._timestamp
  entity.isDeposit = true
  entity.txHash = event.transaction.hash.toHex()
  entity.save()

  investor.depositWithdrawHistory.push(entity.id)
  investor.save()

  updateTotalFunds(event.address, event)
}

export function handleWithdraw(event: WithdrawEvent): void {
  let investor = Investor.load(event.transaction.from.toHex())
  if (investor == null) {
    investor = new Investor(event.transaction.from.toHex())
    let fund = BetokenFund.bind(event.address)
    let shares = MiniMeToken.bind(fund.shareTokenAddr())
    investor.sharesBalance = shares.balanceOf(Address.fromString(investor.id))
    investor.depositWithdrawHistory = new Array<string>()
    investor.save()
  }

  let entity = new DepositWithdraw(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.amountInDAI = event.params._daiAmount
  entity.timestamp = event.params._timestamp
  entity.isDeposit = false
  entity.txHash = event.transaction.hash.toHex()
  entity.save()

  investor.depositWithdrawHistory.push(entity.id)
  investor.save()

  updateTotalFunds(event.address, event)
}

export function handleCreatedInvestment(event: CreatedInvestmentEvent): void {
  let id = event.params._id.toString() + '-' + event.params._cycleNumber.toString()
  if (isFulcrumTokenAddress(event.params._tokenAddress.toHex())) {
    let entity = new FulcrumOrder(id);
    entity.isShort = assetPTokenAddressToInfo(event.params._tokenAddress.toHex()).type;
    entity.idx = event.params._id
    entity.cycleNumber = event.params._cycleNumber
    entity.tokenAddress = event.params._tokenAddress.toHex()
    entity.tokenAmount = event.params._tokenAmount
    entity.stake = event.params._stakeInWeis
    entity.buyPrice = event.params._buyPrice
    entity.sellPrice = ZERO
    entity.buyTime = event.block.timestamp
    entity.sellTime = ZERO
    entity.isSold = false
    let pToken = PositionToken.bind(event.params._tokenAddress)
    entity.liquidationPrice = pToken.liquidationPrice()
    entity.save()
  } else {
    let entity = new BasicOrder(id);
    entity.idx = event.params._id
    entity.cycleNumber = event.params._cycleNumber
    entity.tokenAddress = event.params._tokenAddress.toHex()
    entity.tokenAmount = event.params._tokenAmount
    entity.stake = event.params._stakeInWeis
    entity.buyPrice = event.params._buyPrice
    entity.sellPrice = ZERO
    entity.buyTime = event.block.timestamp
    entity.sellTime = ZERO
    entity.isSold = false
    entity.save()
  }

  let manager = Manager.load(event.params._sender.toHex())
  if (isFulcrumTokenAddress(event.params._tokenAddress.toHex())) {
    manager.fulcrumOrders.push(id)
  } else {
    manager.basicOrders.push(id)
  }
  manager.kairoBalance = manager.kairoBalance.minus(event.params._stakeInWeis)
  manager.save()
}

export function handleSoldInvestment(event: SoldInvestmentEvent): void {
  let id = event.params._id.toString() + '-' + event.params._cycleNumber.toString()
  if (isFulcrumTokenAddress(event.params._tokenAddress.toHex())) {
    let entity = FulcrumOrder.load(id);
    entity.isSold = true
    entity.sellTime = event.block.timestamp
    entity.sellPrice = event.params._sellPrice
    entity.save()
  } else {
    let entity = BasicOrder.load(id);
    entity.isSold = true
    entity.sellTime = event.block.timestamp
    entity.sellPrice = event.params._sellPrice
    entity.save()
  }
  
  updateTotalFunds(event.address, event)

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
  entity.sellTime = ZERO
  entity.isShort = event.params._orderType
  entity.orderAddress = event.params._order.toHex()
  entity.outputAmount = ZERO

  let contract = CompoundOrderContract.bind(event.params._order)
  entity.marketCollateralFactor = contract.getMarketCollateralFactor()
  entity.collateralRatio = contract.getCurrentCollateralRatioInDAI()
  let currProfitObj = contract.getCurrentProfitInDAI() // value0: isNegative, value1: value
  entity.currProfit = currProfitObj.value1.times(currProfitObj.value0 ? BigInt.fromI32(-1) : BigInt.fromI32(1))
  entity.currCollateral = contract.getCurrentCollateralInDAI()
  entity.currBorrow = contract.getCurrentBorrowInDAI()
  entity.currCash = contract.getCurrentCashInDAI()
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
  entity.outputAmount = event.params._earnedDAIAmount
  entity.save()

  updateTotalFunds(event.address, event)

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
  let entity = Fund.load(FUND_ID)
  entity.cycleTotalCommission = event.params._totalCommissionInDAI
  entity.save()
}

export function handleRegister(event: RegisterEvent): void {
  let entity = new Manager(event.params._manager.toHex())
  entity.kairoBalance = event.params._kairoReceived
  entity.kairoBalanceWithStake = event.params._kairoReceived
  entity.kairoBalanceWithStakeHistory = new Array<string>()
  entity.baseStake = event.params._kairoReceived
  entity.riskTaken = ZERO
  entity.riskThreshold = entity.baseStake.times(RISK_THRESHOLD_TIME)
  entity.lastCommissionRedemption = ZERO
  entity.basicOrders = new Array<string>()
  entity.fulcrumOrders = new Array<string>()
  entity.compoundOrders = new Array<string>()
  entity.commissionHistory = new Array<string>()
  entity.votes = new Array<string>()
  entity.upgradeSignal = false
  entity.save()

  updateTotalFunds(event.address, event)
}

export function handleSignaledUpgrade(event: SignaledUpgradeEvent): void {
  let manager = Manager.load(event.params._sender.toHex())
  manager.upgradeSignal = event.params._inSupport
  manager.save()
}

export function handleDeveloperInitiatedUpgrade(
  event: DeveloperInitiatedUpgradeEvent
): void {
  let entity = Fund.load(FUND_ID)
  entity.upgradeVotingActive = true
  entity.nextVersion = event.params._candidate.toHex()
  entity.save()
}

export function handleInitiatedUpgrade(event: InitiatedUpgradeEvent): void {
  let entity = Fund.load(FUND_ID)
  entity.upgradeVotingActive = true
  entity.save()
}

export function handleProposedCandidate(event: ProposedCandidateEvent): void {
  let entity = Fund.load(FUND_ID)
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
  let entity = Fund.load(FUND_ID)
  let fund = BetokenFund.bind(event.address)
  let forVotes = new Array<BigInt>()
  let againstVotes = new Array<BigInt>()
  for (let i = 0; i < 5; i++) {
    forVotes.push(fund.forVotes(BigInt.fromI32(i)))
    againstVotes.push(fund.againstVotes(BigInt.fromI32(i)))
  }
  entity.forVotes = forVotes
  entity.againstVotes = againstVotes
  entity.save()

  let manager = Manager.load(event.params._sender.toHex())
  let votes = new Array<string>()
  for (let i = 0; i < 5; i++) {
    votes.push(VoteDirection[fund.managerVotes(fund.cycleNumber(), event.params._sender, BigInt.fromI32(i))])
  }
  manager.votes = votes
}

export function handleFinalizedNextVersion(
  event: FinalizedNextVersionEvent
): void {
  let entity = Fund.load(FUND_ID)
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
    from.sharesBalance = contract.balanceOf(event.params._from)
    from.save()
    investor.sharesBalance = contract.balanceOf(to)
    investor.save()
  }
}

// init fund handler

export function initFund(event: FundCreatedEvent): void {
  // initialize fund entity
  let fund = BetokenFund.bind(BETOKEN_ADDR)
  let kairo = MiniMeToken.bind(fund.controlTokenAddr())
  let shares = MiniMeToken.bind(fund.shareTokenAddr())
  let entity = new Fund(FUND_ID)
  entity.totalFundsInDAI = fund.totalFundsInDAI()
  entity.kairoPrice = fund.kairoPrice()
  entity.kairoTotalSupply = kairo.totalSupply()
  entity.sharesPrice = entity.totalFundsInDAI.times(PRECISION).div(shares.totalSupply())
  entity.sharesTotalSupply = shares.totalSupply()
  entity.sharesPriceHistory = new Array<string>()
  entity.cycleTotalCommission = ZERO
  entity.managers = new Array<string>()
  entity.hasFinalizedNextVersion = false
  entity.upgradeVotingActive = false
  entity.nextVersion = ""
  entity.proposers = new Array<string>()
  entity.candidates = new Array<string>()
  entity.forVotes = new Array<BigInt>()
  entity.againstVotes = new Array<BigInt>()
  entity.upgradeSignalStrength = ZERO
  entity.save()

  MiniMeTokenTemplate.create(fund.shareTokenAddr())
}

// block handler

import { EthereumBlock } from '@graphprotocol/graph-ts'

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