import { useState } from 'react';

export function Settings() {
  const [costMethod, setCostMethod] = useState<'FIFO' | 'AVERAGE'>('AVERAGE');

  const handleMockData = () => {
    alert("已自動生成模擬資料 (Mock Data)");
  };

  const handleUploadClick = () => {
    alert("模擬匯出上傳");
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
              onClick={() => setCostMethod('AVERAGE')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                costMethod === 'AVERAGE'
                  ? 'bg-brand text-white shadow-md dark:bg-brand-light dark:text-brand-darkest'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-[#06182b] dark:text-slate-300 dark:hover:bg-opacity-80'
              }`}
            >
              歷史平均成本
            </button>
            <button
              onClick={() => setCostMethod('FIFO')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                costMethod === 'FIFO'
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
            <button
              onClick={handleUploadClick}
              className="px-6 py-3 rounded-lg font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-[#06182b] dark:bg-[#0f4375] dark:text-slate-300 dark:hover:bg-[#06182b] transition-all"
            >
              手動上傳歷史紀錄 (CSV)
            </button>
            <button
              onClick={handleMockData}
              className="px-6 py-3 rounded-lg font-medium bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 transition-all"
            >
              自動生成 Mock Data
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
