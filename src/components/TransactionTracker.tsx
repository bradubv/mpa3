import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Transaction {
  id: number;
  description: string;
  amount: number;
}

interface AppliedTransaction extends Transaction {
  timestamp: Date;
  resultingBalance: number;
}

const TransactionTracker: React.FC = () => {
  const [transactions] = useState<Transaction[]>([
    { id: 1, description: 'Initial Deposit', amount: 1000 },
    { id: 2, description: 'Rent Payment', amount: -800 },
    { id: 3, description: 'Salary', amount: 2000 },
    { id: 4, description: 'Grocery Shopping', amount: -150 },
    { id: 5, description: 'Utility Bill', amount: -100 },
  ]);

  const [appliedTransactions, setAppliedTransactions] = useState<AppliedTransaction[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [highlightedField, setHighlightedField] = useState<string | null>(null);

  const applyTransaction = (transaction: Transaction) => {
    if (appliedTransactions.some(t => t.id === transaction.id)) return;

    const newApplied = [...appliedTransactions, 
      { ...transaction, timestamp: new Date(), resultingBalance: balance + transaction.amount }
    ];
    setAppliedTransactions(newApplied);
    setBalance(balance + transaction.amount);
    
    setHighlightedField('balance');
    setTimeout(() => setHighlightedField(null), 1000);
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
          <div className="flex flex-col gap-2">
            {transactions.filter(t => !appliedTransactions.some(at => at.id === t.id)).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-2 border rounded"
              >
                <div>
                  <div className="font-medium">{transaction.description}</div>
                  <div className={transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                    ${Math.abs(transaction.amount).toFixed(2)}
                  </div>
                </div>
                <Button
                  onClick={() => applyTransaction(transaction)}
                  variant="outline"
                >
                  Apply
                </Button>
              </div>
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
            <div
              className={`p-4 border rounded transition-colors duration-300 ${
                highlightedField === 'balance' ? 'bg-blue-100' : 'bg-white'
              }`}
            >
              <div className="font-medium">Current Balance</div>
              <div className={balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                ${balance.toFixed(2)}
              </div>
            </div>

            <div className="mt-6">
              <div className="font-medium mb-2">Transaction History</div>
              <div className="space-y-2">
                {appliedTransactions.slice().reverse().map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-2 border rounded flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-sm text-gray-500">
                        {transaction.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                        ${Math.abs(transaction.amount).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Balance: ${transaction.resultingBalance.toFixed(2)}
                      </div>
                    </div>
                  </div>
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