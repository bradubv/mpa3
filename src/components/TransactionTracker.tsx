import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TransactionType, Transaction } from '../Transaction'
import TransactionItem from './TransactionItem'
import Balance from './Balance';

interface AppliedTransaction extends Transaction {
  resultingBalance: number;
  //TODO: should also calculate resultingPosition
}

const TransactionTracker: React.FC = () => {
  const [transactions] = useState<Transaction[]>([
    { id: 1, entryDate: new Date(2025, 0, 2), effectiveDate: new Date(2025, 0, 2), type: TransactionType.Crd, security: 'USD', description: '', quantity: 0, amount: 4000 },
    { id: 2, entryDate: new Date(2025, 0, 3), effectiveDate: new Date(2025, 0, 3), type: TransactionType.Buy, security: 'GOOGL', description: '', quantity: 6, amount: 2000 },
    { id: 3, entryDate: new Date(2025, 0, 9), effectiveDate: new Date(2025, 0, 9), type: TransactionType.Buy, security: 'AAPL', description: '', quantity: 5, amount: 1000 },
    { id: 4, entryDate: new Date(2025, 0, 10), effectiveDate: new Date(2025, 0, 10), type: TransactionType.Sell, security: 'GOOGL', description: '', quantity: 3, amount: 1500},
  ]);

  const [appliedTransactions, setAppliedTransactions] = useState<AppliedTransaction[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [highlightedField, setHighlightedField] = useState<string | null>(null);

  const applyTransaction = () => {
    const transaction = transactions.find(t => !appliedTransactions.some(at => at.id === t.id));
    if (!transaction) return;

    const newApplied = [...appliedTransactions, 
      { ...transaction, resultingBalance: balance + transaction.amount }
    ];
    setAppliedTransactions(newApplied);
    setBalance(balance + transaction.amount);
    
    setHighlightedField('balance');
    setTimeout(() => setHighlightedField(null), 3000);
  };

  const resetTransactions = () => {
    setAppliedTransactions([]);
    setBalance(0);
  };

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
            {transactions.filter(t => !appliedTransactions.some(at => at.id === t.id)).map((transaction) => (
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
          <CardTitle>Account History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Balance
              highlightedField={highlightedField}
              balance={balance}
            />
            <div className="mt-6">
              <div className="font-medium mb-2">Transaction History</div>
              <div className="space-y-2">
                {appliedTransactions.slice().reverse().map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    resultingBalance={transaction.resultingBalance}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionTracker;