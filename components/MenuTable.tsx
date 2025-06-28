
import React from 'react';
import { OrderItem, SortConfig, SortableKey } from '../types';

interface MenuTableProps {
  items: OrderItem[];
  onItemChange: (id: string, field: 'quantityOrdered' | 'quantityReceived', value: string) => void;
  processing: boolean;
  requestSort: (key: SortableKey) => void;
  sortConfig: SortConfig;
}

const MenuTable: React.FC<MenuTableProps> = ({ items, onItemChange, processing, requestSort, sortConfig }) => {
  if (items.length === 0) {
    return null;
  }

  const SortIndicator: React.FC<{ direction: 'ascending' | 'descending' }> = ({ direction }) => (
    <span className="text-gray-500 text-xs ml-1">{direction === 'ascending' ? '▲' : '▼'}</span>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                <button
                  onClick={() => requestSort('name')}
                  className="w-full flex items-center gap-1 text-left focus:outline-none"
                  aria-label="Sort by product name"
                >
                  商品名
                  {sortConfig.key === 'name' && <SortIndicator direction={sortConfig.direction} />}
                </button>
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                 <button
                  onClick={() => requestSort('price')}
                  className="w-full flex items-center gap-1 justify-end focus:outline-none"
                  aria-label="Sort by price"
                >
                  価格 (円)
                  {sortConfig.key === 'price' && <SortIndicator direction={sortConfig.direction} />}
                </button>
              </th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                注文数
              </th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                受取済数
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                小計 (円)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">{item.name}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-right">{item.price.toLocaleString()}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  <input
                    type="number"
                    min="0"
                    value={item.quantityOrdered}
                    onChange={(e) => onItemChange(item.id, 'quantityOrdered', e.target.value)}
                    className="w-20 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-center disabled:bg-gray-100"
                    disabled={processing}
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  <input
                    type="number"
                    min="0"
                    value={item.quantityReceived}
                    onChange={(e) => onItemChange(item.id, 'quantityReceived', e.target.value)}
                    className="w-20 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-center disabled:bg-gray-100"
                    disabled={processing}
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-right">
                  {(item.price * item.quantityOrdered).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuTable;