import React from 'react';

interface BalanceProps {
  highlightedField: string;
  balance: number;
}

const Balance: React.FC<BalanceProps> = ({
  highlightedField,
  balance,
}) => {
  return (
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
  );
};

export default Balance;