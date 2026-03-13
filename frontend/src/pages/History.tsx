import { Transaction, TransactionType } from '@/types/transaction';

export function HistoryTable({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="bg-white dark:bg-[#0f4375] rounded-2xl shadow-sm border border-slate-100 dark:border-[#06182b] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-[#06182b] border-b border-slate-100 dark:border-[#0f4375]">
              <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">日期</th>
              <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">時間</th>
              <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">代號/名稱</th>
              <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">買賣</th>
              <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">成交價</th>
              <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">股數</th>
              <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">手續費/稅</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#06182b]">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-[#06182b]/50 transition-colors">
                <td className="p-4 text-sm text-slate-900 dark:text-slate-300">{tx.date}</td>
                <td className="p-4 text-sm text-slate-500 dark:text-slate-400">{tx.time}</td>
                <td className="p-4 text-sm">
                  <span className="font-medium text-slate-900 dark:text-slate-200">{tx.symbol}</span>
                  <span className="ml-2 text-slate-500 dark:text-slate-400">{tx.name}</span>
                </td>
                <td className="p-4 text-sm">
                  <span className={`px-2 py-1 rounded-md text-xs font-semibold ${tx.type === TransactionType.BUY ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}>
                    {tx.type === TransactionType.BUY ? '買進' : '賣出'}
                  </span>
                </td>
                <td className="p-4 text-sm text-right text-slate-900 dark:text-slate-200 font-medium">{tx.price}</td>
                <td className="p-4 text-sm text-right text-slate-900 dark:text-slate-200">{tx.shares}</td>
                <td className="p-4 text-sm text-right text-slate-500 dark:text-slate-400">
                  {tx.fee} / {tx.tax}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function History() {
  const transactions: Transaction[] = [
    { id: 1, date: '2023-10-01', time: '09:05', symbol: '2330', name: '台積電', type: TransactionType.BUY, price: 540, shares: 1000, fee: 769, tax: 0 },
    { id: 2, date: '2023-10-15', time: '11:20', symbol: '0050', name: '元大台灣50', type: TransactionType.BUY, price: 125.5, shares: 2000, fee: 357, tax: 0 },
    { id: 3, date: '2023-11-05', time: '13:15', symbol: '2330', name: '台積電', type: TransactionType.SELL, price: 580, shares: 1000, fee: 826, tax: 1740 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">交易紀錄</h2>
      <HistoryTable transactions={transactions} />
    </div>
  );
}
