import { Transaction, TransactionType } from './Transaction';
import { Holding } from './Holding';

export interface AppliedTransaction extends Transaction {
  resultingBalance: number;
  resultingQuantity?: number;
}

export interface AccountState {
  balance: number; // TODO: handle multiple currencies
  holdings: Holding[];
  appliedTransactions: AppliedTransaction[];
}

export class TransactionProcessor {
  private getTransactionCashEffect(transaction: Transaction): number {
    switch (transaction.type) {
      case TransactionType.Crd: // Credit/Deposit
        return transaction.amount;
      case TransactionType.Buy: // Purchase
        return -transaction.amount;
      case TransactionType.Sell: // Sale (cash proceeds)
        return transaction.amount;
      case TransactionType.Deb: // Debit/Withdrawal
        return -transaction.amount;
      default:
        return 0;
    }
  }

  private getTransactionPositionEffect(transaction: Transaction): number {
    switch (transaction.type) {
      case TransactionType.Buy: // Purchase
        return transaction.quantity;
      case TransactionType.Sell: // Sale
        return -transaction.quantity;
      default:
        return 0;
    }
  }

  private findHolding(holdings: Holding[], security: string): Holding | undefined {
    return holdings.find(h => h.security === security);
  }

  applyTransaction(
    currentState: AccountState, 
    transaction: Transaction
  ): AccountState {
    const cashEffect = this.getTransactionCashEffect(transaction);
    const newBalance = currentState.balance + cashEffect;
    let newQuantity: number = 0;

    // if this transaction is a buy or sell, update holdings
    if (transaction.type === TransactionType.Buy || transaction.type === TransactionType.Sell) {
      const existingHolding = this.findHolding(currentState.holdings, transaction.security);
        if (existingHolding) {
          // TODO: reject transactions that would make quantity negative
          existingHolding.quantity += this.getTransactionPositionEffect(transaction);
          newQuantity = existingHolding.quantity;

          // If quantity goes to zero, remove the holding
          if (existingHolding.quantity === 0) {
            currentState.holdings = currentState.holdings.filter(h => h.security !== transaction.security);
          }
        } else {
          //TODO: reject long sales of security sold not held
          const holding: Holding = {
            security: transaction.security,
            quantity: transaction.type === TransactionType.Buy ? transaction.quantity : 0,
            longShort: 'L' //TODO: handle short sales eventually
          };
          newQuantity = holding.quantity
          currentState.holdings.push(holding);
        }
    }

    const appliedTransaction: AppliedTransaction = {
      ...transaction,
      resultingBalance: newBalance,
      resultingQuantity: newQuantity
    };

    return {
      balance: newBalance,
      holdings: currentState.holdings,
      appliedTransactions: [...currentState.appliedTransactions, appliedTransaction]
    };
  }

  resetAccount(): AccountState {
    return {
      balance: 0,
      holdings: [],
      appliedTransactions: []
    };
  }

  //TODO: should process transactions in date & time order.
  getNextPendingTransaction(
    allTransactions: Transaction[], 
    appliedTransactions: AppliedTransaction[]
  ): Transaction | null {
    return allTransactions.find(t => 
      !appliedTransactions.some(at => at.id === t.id)
    ) || null;
  }
}