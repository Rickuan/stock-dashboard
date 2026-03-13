# Backend implementation WorkLog

這份文件記錄了 `stock-dashboard` 後端專案的實作規劃與預計步驟。

## 📍 技術選型 (Tech Stack)
*   **語言框架**: Python 3.10+ & FastAPI （高效能、自動生成 API 文件）
*   **資料庫**: SQLite （搭配 SQLAlchemy ORM，本地方便管理與備份）
*   **資料處理**: Pandas （計算投資組合淨值、處理歷史平均與 FIFO 成本）
*   **監控與排程**: 
    *   `watchdog`: 監控 `data_inbox/` 目錄，有人放 CSV 自動匯入並備份。
    *   `APScheduler`: 排程更新當前股價（盤中每小時、盤後收盤價）。

## 📂 預計的目錄結構
```text
stock-dashboard/
├── documents/
│   └── WorkLog.md            <-- 本文件
├── data_inbox/               <-- 存放要匯入的歷史交易 CSV 檔 (被 git 忽略)
├── frontend/                 <-- 已完成
└── backend/                  <-- 即將建立
    ├── main.py               # FastAPI 進入點
    ├── database.py           # SQLite 連線設定
    ├── models.py             # SQLAlchemy 資料表定義 (Transaction, DailyPrice 等)
    ├── schemas.py            # Pydantic 資料驗證模組 (API Response)
    ├── crud.py               # 資料庫操作邏輯
    ├── services/
    │   ├── watcher.py        # 自動監聽目錄的服務
    │   ├── scheduler.py      # 負責抓取股價的排程服務
    │   └── calculator.py     # 負責處理 FIFO 與平均成本計算
    └── requirements.txt
```

---

## ✅ 實作步驟 (Action Items)

### Phase 1: 基礎建設與資料庫設計
- [x] 1. 建立 `backend` 與 `data_inbox` 目錄，設定 Python 虛擬環境 (`venv`)。
- [x] 2. 撰寫 `requirements.txt` 並安裝所需依賴。
- [x] 3. 實作 `database.py` 與 `models.py`，定義 `Transaction` 資料表 (包含你前台定義的所有欄位，並支援 `TransactionType` ENUM)。

### Phase 2: 核心 API 開發
- [x] 4. 建立 `main.py` 與 `schemas.py`。
- [x] 5. 實作取得交易紀錄的 API (`GET /api/transactions`) 讓前台呼叫。
- [x] 6. 實作簡易登入驗證 API (`POST /api/login`)，暫時 hardcode 帳密以替換前端的假登入。

### Phase 3: 自動化工具與計算核心
- [x] 7. **目錄監聽服務 (`watcher.py`)**: 撰寫腳本監聽 `data_inbox/`，自動將 CSV 轉成資料庫物件。
- [x] 8. **報價排程服務 (`scheduler.py`)**: 撰寫腳本抓取 Yahoo Finance/Twstock 的個股盤中/盤後報價。
- [x] 9. **成本計算服務 (`calculator.py`)**: 實作歷史平均與先進先出(FIFO) 的演算法。

### Phase 4: 整合前台顯示
- [ ] 10. 實作 Dashboard 總覽專用的 API (`GET /api/dashboard`)，回傳計算後的資產淨值與損益。
- [ ] 11. 實作 個股表現 專用的 API (`GET /api/stock/{symbol}`)。
- [ ] 12. 修改前端程式片斷，將 Axios / Fetch 接上 FastAPI。
