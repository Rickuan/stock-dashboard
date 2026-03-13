import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDashboard, fetchTransactions } from '@/services/api';
import { HistoryTable } from './History';
import { Loader2, PieChart } from 'lucide-react';
import { CostMethod } from './Settings';

export function StockView() {
  const savedMethod = (localStorage.getItem('costMethod') || 'AVERAGE') as CostMethod;
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');

  const { data: dashboard, isLoading: dashLoading } = useQuery({
    queryKey: ['dashboard', savedMethod],
    queryFn: () => fetchDashboard(savedMethod)
  });

  const { data: transactions = [], isLoading: txLoading } = useQuery({
    queryKey: ['transactions', selectedSymbol],
    queryFn: () => fetchTransactions(selectedSymbol),
    enabled: !!selectedSymbol
  });

  const holdings = dashboard?.holdings || {};
  const symbols = Object.keys(holdings);
  const selectedData = selectedSymbol ? holdings[selectedSymbol] : null;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(val);

  if (dashLoading) {
    return (
      <div className="flex items-center justify-center p-24">
        <Loader2 className="h-10 w-10 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">個股表現</h2>
        
        <select 
          value={selectedSymbol}
          onChange={(e) => setSelectedSymbol(e.target.value)}
          className="bg-white dark:bg-[#0f4375] border border-slate-200 dark:border-[#06182b] text-slate-900 dark:text-white text-sm rounded-lg focus:ring-brand focus:border-brand block w-full md:w-64 p-2.5 outline-none shadow-sm"
        >
          <option value="" disabled>請選擇持有個股...</option>
          {symbols.map(sym => (
            <option key={sym} value={sym}>{sym}</option>
          ))}
        </select>
      </div>

      {!selectedSymbol ? (
        <div className="bg-white dark:bg-[#0f4375] p-12 rounded-2xl shadow-sm border border-slate-100 dark:border-[#06182b] text-center">
          <PieChart className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">尚未選擇個股，請由上方選單選取以查看詳細報表</p>
        </div>
      ) : selectedData ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#0f4375] p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-[#06182b]">
              <p className="text-sm text-slate-500 dark:text-slate-300 mb-1">庫存股數</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedData.shares} 股</h3>
            </div>
            <div className="bg-white dark:bg-[#0f4375] p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-[#06182b]">
              <p className="text-sm text-slate-500 dark:text-slate-300 mb-1">每股均價</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(selectedData.avg_cost)}</h3>
            </div>
            <div className="bg-white dark:bg-[#0f4375] p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-[#06182b]">
              <p className="text-sm text-slate-500 dark:text-slate-300 mb-1">今日股價</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(selectedData.current_price)}</h3>
            </div>
            <div className="bg-white dark:bg-[#0f4375] p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-[#06182b]">
              <p className="text-sm text-slate-500 dark:text-slate-300 mb-1">未實現損益</p>
              <h3 className={`text-xl font-bold ${selectedData.unrealized_pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                {selectedData.unrealized_pnl >= 0 ? "+" : ""}{formatCurrency(selectedData.unrealized_pnl)}
              </h3>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">歷史交易紀錄</h3>
            {txLoading ? (
              <div className="flex items-center justify-center p-12 bg-white dark:bg-[#0f4375] rounded-2xl border border-slate-100 dark:border-[#06182b]">
                <Loader2 className="h-8 w-8 animate-spin text-brand-light" />
              </div>
            ) : (
              <HistoryTable transactions={transactions} />
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
