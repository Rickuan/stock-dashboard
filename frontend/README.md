# Stock Dashboard 股票記帳系統 - Frontend

這個專案是使用 React (搭配 Vite) 所建置的前端儀表板，用來視覺化呈現您的股票交易紀錄、庫存總值、歷史投入成本等資訊。
介面風格以 Google Material Design 為主，支援淺色（Light Mode）與深色（Dark Mode）主題切換。

## 系統需求
- Node.js (建議 v18 以上)
- Yarn 套件管理員 (如果尚未安裝，可執行 `npm install -g yarn`)

## 如何在本地開發與執行系統

您只需在 `frontend` 資料夾內執行下列指令，即可自動安裝好此專案所需的所有套件，並且啟動本地開發伺服器。這些操作完全隔離於此專案，**不會影響到您電腦上或其他專案的設定**。

### 1. 安裝系統套件
請打開終端機 (Terminal)，確認目前位於 `frontend` 目錄下，然後執行：
```bash
yarn install
```
這會根據 `package.json` 內的定義，將專案所需的 React, Vite, Tailwind CSS 等相關依賴全部安裝到 `node_modules` 中。

### 2. 啟動本地伺服器
安裝完成後，執行下列指令以啟動網頁：
```bash
yarn run dev
```
> 或者您也可以簡寫為 `yarn dev`

啟動成功後，終端機會顯示一個本地網址（通常是 `http://localhost:5173/`）。請使用瀏覽器開啟該網址即可開始使用 Dashboard。

## 備註
- 此專案目前包含了一個簡易的登入頁面（測試帳號：`admin` / `000`）。
- 您可以在「設定 (Settings)」頁面手動上傳歷史紀錄或生成測試假資料。
