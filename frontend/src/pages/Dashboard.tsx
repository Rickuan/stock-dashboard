import { TrendingUp, DollarSign, Activity, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { fetchDashboard } from '@/services/api';

const mockData = [
  { date: '2023-01', value: 1000000 },
  { date: '2023-02', value: 1050000 },
  { date: '2023-03', value: 1020000 },
  { date: '2023-04', value: 1100000 },
  { date: '2023-05', value: 1150000 },
  { date: '2023-06', value: 1250000 },
];

export function Dashboard() {
  const savedMethod = localStorage.getItem('costMethod') || 'AVERAGE';
  
  const { data: dashboard, isLoading, isError } = useQuery({
    queryKey: ['dashboard', savedMethod],
    queryFn: () => fetchDashboard(savedMethod)
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-24">
        <Loader2 className="h-10 w-10 animate-spin text-brand" />
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        無法讀取儀表板資料，請檢查後端連線狀態。
      </div>
    );
  }

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">資產總覽</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#0f4375] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-[#06182b]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand/10 dark:bg-brand-light/20 text-brand dark:text-brand-light rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-300">總投入成本</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(dashboard.total_cost)}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f4375] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-[#06182b]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-300">目前預估淨值</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(dashboard.total_value)}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f4375] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-[#06182b]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-300">未實現損益</p>
              <h3 className={`text-2xl font-bold ${dashboard.unrealized_pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                {dashboard.unrealized_pnl >= 0 ? "+" : ""}{formatCurrency(dashboard.unrealized_pnl)} 
                <span className="text-sm ml-2">({((dashboard.unrealized_pnl / (dashboard.total_cost || 1)) * 100).toFixed(2)}%)</span>
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0f4375] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-[#06182b] mt-8">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">資產走勢圖</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5c88b2" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#5c88b2" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#0f4375' }}
              />
              <Area type="monotone" dataKey="value" stroke="#5c88b2" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
