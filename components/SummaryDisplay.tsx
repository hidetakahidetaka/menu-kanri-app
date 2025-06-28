
import React from 'react';

interface SummaryDisplayProps {
  totalAmount: number;
  totalQuantityOrdered: number;
  totalQuantityReceived: number;
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ totalAmount, totalQuantityOrdered, totalQuantityReceived }) => {
  return (
    <div className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">注文概要</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-white/10 rounded-lg">
          <span className="text-lg font-medium">合計金額:</span>
          <span className="text-2xl font-semibold">{totalAmount.toLocaleString()} 円</span>
        </div>
        <div className="flex justify-between items-center p-4 bg-white/10 rounded-lg">
          <span className="text-lg font-medium">合計注文数:</span>
          <span className="text-2xl font-semibold">{totalQuantityOrdered.toLocaleString()} 点</span>
        </div>
        <div className="flex justify-between items-center p-4 bg-white/10 rounded-lg">
          <span className="text-lg font-medium">合計受取済数:</span>
          <span className="text-2xl font-semibold">{totalQuantityReceived.toLocaleString()} 点</span>
        </div>
      </div>
    </div>
  );
};

export default SummaryDisplay;
