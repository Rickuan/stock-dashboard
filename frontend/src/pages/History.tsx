import { useQuery } from '@tanstack/react-query';
import { fetchTransactions } from '@/services/api';
import { Transaction, TransactionType } from '@/types/transaction';
import { Loader2 } from 'lucide-react';

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
  const { data: transactions = [], isLoading, isError } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => fetchTransactions()
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">交易紀錄</h2>
      
      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-light" />
        </div>
      ) : isError ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          無法取得交易紀錄，請確定後端伺服器有正常運行。
        </div>
      ) : (
        <HistoryTable transactions={transactions} />
      )}
    </div>
  );
}
