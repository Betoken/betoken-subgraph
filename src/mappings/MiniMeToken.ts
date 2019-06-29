import { Transfer as TransferEvent } from "../../generated/BetokenProxy/templates/MiniMeToken/MiniMeToken"
import { MiniMeToken } from '../../generated/BetokenProxy/templates/MiniMeToken/MiniMeToken'
import { Investor } from "../../generated/schema"
import * as Utils from '../utils'

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