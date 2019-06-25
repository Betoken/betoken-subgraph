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
  OwnershipTransferred as OwnershipTransferredEvent
} from "../generated/Contract/Contract"
import {
  ChangedPhase,
  Deposit,
  Withdraw,
  CreatedInvestment,
  SoldInvestment,
  CreatedCompoundOrder,
  SoldCompoundOrder,
  RepaidCompoundOrder,
  CommissionPaid,
  TotalCommissionPaid,
  Register,
  SignaledUpgrade,
  DeveloperInitiatedUpgrade,
  InitiatedUpgrade,
  ProposedCandidate,
  Voted,
  FinalizedNextVersion,
  OwnershipTransferred
} from "../generated/schema"

export function handleChangedPhase(event: ChangedPhaseEvent): void {
  let entity = new ChangedPhase(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._cycleNumber = event.params._cycleNumber
  entity._newPhase = event.params._newPhase
  entity._timestamp = event.params._timestamp
  entity._totalFundsInDAI = event.params._totalFundsInDAI
  entity.save()
}

export function handleDeposit(event: DepositEvent): void {
  let entity = new Deposit(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._cycleNumber = event.params._cycleNumber
  entity._sender = event.params._sender
  entity._tokenAddress = event.params._tokenAddress
  entity._tokenAmount = event.params._tokenAmount
  entity._daiAmount = event.params._daiAmount
  entity._timestamp = event.params._timestamp
  entity.save()
}

export function handleWithdraw(event: WithdrawEvent): void {
  let entity = new Withdraw(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._cycleNumber = event.params._cycleNumber
  entity._sender = event.params._sender
  entity._tokenAddress = event.params._tokenAddress
  entity._tokenAmount = event.params._tokenAmount
  entity._daiAmount = event.params._daiAmount
  entity._timestamp = event.params._timestamp
  entity.save()
}

export function handleCreatedInvestment(event: CreatedInvestmentEvent): void {
  let entity = new CreatedInvestment(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._cycleNumber = event.params._cycleNumber
  entity._sender = event.params._sender
  entity._id = event.params._id
  entity._tokenAddress = event.params._tokenAddress
  entity._stakeInWeis = event.params._stakeInWeis
  entity._buyPrice = event.params._buyPrice
  entity._costDAIAmount = event.params._costDAIAmount
  entity.save()
}

export function handleSoldInvestment(event: SoldInvestmentEvent): void {
  let entity = new SoldInvestment(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._cycleNumber = event.params._cycleNumber
  entity._sender = event.params._sender
  entity._investmentId = event.params._investmentId
  entity._receivedKairo = event.params._receivedKairo
  entity._sellPrice = event.params._sellPrice
  entity._earnedDAIAmount = event.params._earnedDAIAmount
  entity.save()
}

export function handleCreatedCompoundOrder(
  event: CreatedCompoundOrderEvent
): void {
  let entity = new CreatedCompoundOrder(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._cycleNumber = event.params._cycleNumber
  entity._sender = event.params._sender
  entity._order = event.params._order
  entity._orderType = event.params._orderType
  entity._tokenAddress = event.params._tokenAddress
  entity._stakeInWeis = event.params._stakeInWeis
  entity._costDAIAmount = event.params._costDAIAmount
  entity.save()
}

export function handleSoldCompoundOrder(event: SoldCompoundOrderEvent): void {
  let entity = new SoldCompoundOrder(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._cycleNumber = event.params._cycleNumber
  entity._sender = event.params._sender
  entity._order = event.params._order
  entity._orderType = event.params._orderType
  entity._tokenAddress = event.params._tokenAddress
  entity._receivedKairo = event.params._receivedKairo
  entity._earnedDAIAmount = event.params._earnedDAIAmount
  entity.save()
}

export function handleRepaidCompoundOrder(
  event: RepaidCompoundOrderEvent
): void {
  let entity = new RepaidCompoundOrder(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._cycleNumber = event.params._cycleNumber
  entity._sender = event.params._sender
  entity._order = event.params._order
  entity._repaidDAIAmount = event.params._repaidDAIAmount
  entity.save()
}

export function handleCommissionPaid(event: CommissionPaidEvent): void {
  let entity = new CommissionPaid(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._cycleNumber = event.params._cycleNumber
  entity._sender = event.params._sender
  entity._commission = event.params._commission
  entity.save()
}

export function handleTotalCommissionPaid(
  event: TotalCommissionPaidEvent
): void {
  let entity = new TotalCommissionPaid(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._cycleNumber = event.params._cycleNumber
  entity._totalCommissionInDAI = event.params._totalCommissionInDAI
  entity.save()
}

export function handleRegister(event: RegisterEvent): void {
  let entity = new Register(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._manager = event.params._manager
  entity._block = event.params._block
  entity._donationInDAI = event.params._donationInDAI
  entity.save()
}

export function handleSignaledUpgrade(event: SignaledUpgradeEvent): void {
  let entity = new SignaledUpgrade(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._cycleNumber = event.params._cycleNumber
  entity._sender = event.params._sender
  entity._inSupport = event.params._inSupport
  entity.save()
}

export function handleDeveloperInitiatedUpgrade(
  event: DeveloperInitiatedUpgradeEvent
): void {
  let entity = new DeveloperInitiatedUpgrade(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._cycleNumber = event.params._cycleNumber
  entity._candidate = event.params._candidate
  entity.save()
}

export function handleInitiatedUpgrade(event: InitiatedUpgradeEvent): void {
  let entity = new InitiatedUpgrade(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._cycleNumber = event.params._cycleNumber
  entity.save()
}

export function handleProposedCandidate(event: ProposedCandidateEvent): void {
  let entity = new ProposedCandidate(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._cycleNumber = event.params._cycleNumber
  entity._voteID = event.params._voteID
  entity._sender = event.params._sender
  entity._candidate = event.params._candidate
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
