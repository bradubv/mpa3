import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TransactionType, Transaction } from '../Transaction'
import TransactionItem from './TransactionItem'
import Balance from './Balance';
import { TransactionProcessor, AppliedTransaction, AccountState } from '../TransactionProcessor';

const TransactionTracker: React.FC = () => {
  const [processor] = useState<TransactionProcessor>(new TransactionProcessor());

  const [transactions] = useState<Transaction[]>([
    { id: 1, entryDate: new Date(2025, 0, 2), effectiveDate: new Date(2025, 0, 2), type: TransactionType.Crd, security: 'USD', description: '', quantity: 0, amount: 4000 },
    { id: 2, entryDate: new Date(2025, 0, 3), effectiveDate: new Date(2025, 0, 3), type: TransactionType.Buy, security: 'GOOGL', description: '', quantity: 6, amount: 2000 },
    { id: 3, entryDate: new Date(2025, 0, 9), effectiveDate: new Date(2025, 0, 9), type: TransactionType.Buy, security: 'AAPL', description: '', quantity: 5, amount: 1000 },
    { id: 4, entryDate: new Date(2025, 0, 10), effectiveDate: new Date(2025, 0, 10), type: TransactionType.Sell, security: 'GOOGL', description: '', quantity: 3, amount: 1500},
  ]);

  const [accountState, setAccountState] = useState<AccountState>({
    balance: 0,
    holdings: [],
    appliedTransactions: []
  });
  //const [appliedTransactions, setAppliedTransactions] = useState<AppliedTransaction[]>([]);
  //const [balance, setBalance] = useState<number>(0);
  const [highlightedField, setHighlightedField] = useState<string | null>(null);

  const applyTransaction = () => {
    const nextTransaction = processor.getNextPendingTransaction(transactions, accountState.appliedTransactions);
    if (!nextTransaction) return;

    const newState = processor.applyTransaction(accountState, nextTransaction);
    setAccountState(newState);

    setHighlightedField('balance');  //TODO: Processor should return which fields changed
    setTimeout(() => setHighlightedField(null), 3000);
  };

  const resetTransactions = () => {
    const newState = processor.resetAccount();
    setAccountState(newState);
  };

  const pendingTransactions = transactions.filter(t => !accountState.appliedTransactions.some(at => at.id === t.id));

  return (
    <div className="flex gap-8 p-4 w-full max-w-6xl mx-auto">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Pending Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={applyTransaction}
            variant="primary"
            className="mt-4"
          >
            Apply Transaction
          </Button>
          <div className="flex flex-col gap-2">
            {pendingTransactions.map((transaction) => (
              <TransactionItem
              key={transaction.id}
              transaction={transaction}
            />
            ))}
            <Button 
              onClick={resetTransactions}
              variant="secondary"
              className="mt-4"
            >
              Reset All
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Current Account State</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Balance
              highlightedField={highlightedField}
              balance={accountState.balance}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Processed Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mt-6">
            <div className="space-y-2">
              {accountState.appliedTransactions.slice().reverse().map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  resultingBalance={transaction.resultingBalance}
                  resultingQuantity={transaction.resultingQuantity}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default TransactionTracker;