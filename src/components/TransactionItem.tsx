import React from 'react';
import { Transaction, TransactionType } from '../Transaction';

interface TransactionItemProps {
  transaction: Transaction;
  resultingBalance?: number;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  resultingBalance,
}) => {
  return (
    <div className="flex items-center justify-between p-2 border rounded">
      <div className="columns-3">
        <div>{transaction.effectiveDate.toLocaleDateString()}</div>
        <div>{transaction.entryDate.toLocaleDateString()}</div>
        <div>{transaction.type}</div>
        <div>{transaction.security}</div>
        <div>{transaction.quantity === 0 ? <span> </span> : transaction.quantity}</div>
        <div className={transaction.type === TransactionType.Sell || transaction.type === TransactionType.Crd ? 'text-green-600' : 'text-red-600'}>
          ${Math.abs(transaction.amount).toFixed(2)}
        </div>
      </div>
      {resultingBalance !== undefined && (
        <div className="text-right">
          <div className="text-sm text-gray-500">
            Balance: ${resultingBalance.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionItem;