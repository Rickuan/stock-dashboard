import { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadHistoryCsv, deleteTransactions, updateMockData } from '@/services/api';
import { Loader2 } from 'lucide-react';

export type CostMethod = 'FIFO' | 'AVERAGE';

export function Settings() {
  const [costMethod, setCostMethod] = useState<CostMethod>('AVERAGE');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const saved = localStorage.getItem('costMethod') as CostMethod;
    if (saved === 'FIFO' || saved === 'AVERAGE') setCostMethod(saved);
  }, []);

  const handleCostMethodChange = (method: CostMethod) => {
    setCostMethod(method);
    localStorage.setItem('costMethod', method);
    // Invalidate dashboard queries to fetch again
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const uploadMutation = useMutation({
    mutationFn: uploadHistoryCsv,
    onSuccess: () => {
      alert("上傳成功！檔案已進入背景處理隊列。");
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error) => {
      console.error("CSV Upload failed:", error);
      alert("上傳失敗，請確認是否為合法的 CSV 格式。");
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        alert('只能上傳 CSV 檔案');
        return;
      }
      uploadMutation.mutate(file);
    }
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const updateMockMutation = useMutation({
    mutationFn: updateMockData,
    onSuccess: () => {
      alert("Mock Data 更新成功！");
      queryClient.invalidateQueries();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTransactions,
    onSuccess: () => {
      alert("所有資料已刪除！");
      queryClient.invalidateQueries();
    }
  });

  const handleMockData = () => {
    updateMockMutation.mutate();
  };

  const handleDeleteData = () => {
    if (confirm("確定要刪除所有的交易紀錄嗎？此動作無法復原。")) {
      deleteMutation.mutate();
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">系統設定</h2>

      <div className="bg-white dark:bg-[#0f4375] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-[#06182b] space-y-8">

        {/* Cost Calculation Setting */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">成本與損益計算方式</h3>
          <div className="flex gap-4">
            <button
              onClick={() => handleCostMethodChange('AVERAGE')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${costMethod === 'AVERAGE'
                ? 'bg-brand text-white shadow-md dark:bg-brand-light dark:text-brand-darkest'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-[#06182b] dark:text-slate-300 dark:hover:bg-opacity-80'
                }`}
            >
              歷史平均成本
            </button>
            <button
              onClick={() => handleCostMethodChange('FIFO')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${costMethod === 'FIFO'
                ? 'bg-brand text-white shadow-md dark:bg-brand-light dark:text-brand-darkest'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-[#06182b] dark:text-slate-300 dark:hover:bg-opacity-80'
                }`}
            >
              先進先出 (FIFO)
            </button>
          </div>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            {costMethod === 'AVERAGE'
              ? '將歷史總投入資金減去總拿回資金後除以當前股數來計算均價。'
              : '符合台灣多數券商的算法，每次賣出將對沖最早買進未實現的張數。'}
          </p>
        </div>

        <hr className="border-slate-100 dark:border-[#06182b]" />

        {/* Test Options / Data Injection */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">測試選項 (開發用)</h3>
          <div className="flex gap-4">
            <input
              type="file"
              accept=".csv"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button
              onClick={handleUploadClick}
              disabled={uploadMutation.isPending}
              className="px-6 py-3 flex items-center gap-2 rounded-lg font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-[#06182b] dark:bg-[#0f4375] dark:text-slate-300 dark:hover:bg-[#06182b] transition-all disabled:opacity-50"
            >
              {uploadMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              上傳歷史紀錄 (CSV)
            </button>
            <button
              onClick={handleDeleteData}
              disabled={deleteMutation.isPending}
              className="px-6 py-3 flex items-center gap-2 rounded-lg font-medium bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 transition-all disabled:opacity-50"
            >
              {deleteMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              刪除 Data
            </button>
            <button
              onClick={handleMockData}
              disabled={updateMockMutation.isPending}
              className="px-6 py-3 flex items-center gap-2 rounded-lg font-medium bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 transition-all disabled:opacity-50"
            >
              {updateMockMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              更新 Mock Data
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
