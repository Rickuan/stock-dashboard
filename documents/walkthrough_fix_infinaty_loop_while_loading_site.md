# Walkthrough: Fixing Price Endpoints

I have successfully diagnosed and fixed the issue where current stock prices could not be fetched.

## Changes Made
- Identified the bug in [backend/services/scheduler.py](file:///Users/kuan.yen/Desktop/stock-dashboard/backend/services/scheduler.py) within the [fetch_yahoo_finance_prices()](file:///Users/kuan.yen/Desktop/stock-dashboard/backend/services/scheduler.py#34-55) function.
- The original function was missing both a [symbols](file:///Users/kuan.yen/Desktop/stock-dashboard/backend/services/scheduler.py#16-22) parameter and a loop, incorrectly executing for a hardcoded formatting string `{yf_sym}` which resulted in total failure.
- Rewrote the [fetch_yahoo_finance_prices](file:///Users/kuan.yen/Desktop/stock-dashboard/backend/services/scheduler.py#34-55) function to correctly accept a list of symbols, construct valid Yahoo Finance URLs (auto-appending `.TW` for local TWSE fallbacks), and return a dictionary of successfully fetched prices.
- Updated the [fetch_prices()](file:///Users/kuan.yen/Desktop/stock-dashboard/backend/services/scheduler.py#56-88) wrapper to properly compute `yahoo_symbols` (those not found in `twse_data`) and pass them to the new handler.

## Verification & Validation
- **TWSE Endpoint:** Seeded mock tracking data for Taiwanese stocks (like 0050 and 2330) and confirmed the system successfully matched and retrieved prices natively from the TWSE OpenAPI without invoking Yahoo Finance.
- **Yahoo Finance Endpoint:** Generated a mock holding for `AAPL` and verified it properly fell back to the Yahoo Finance API, retrieving and caching the accurate live price of $255.76.
- The cached `PRICE_CACHE` is completely intact and matches precisely expected results when requested by the `/api/dashboard` view.

---

# Walkthrough: Fixing Frontend Infinite Loading

Following the backend price fetching fixes, the frontend application exhibited an "infinite loading loop" and failed to render the Dashboard.

## Changes Made
- **Diagnosis**: 
  - Investigated the network logs and Vite proxy configuration ([vite.config.ts](file:///Users/kuan.yen/Desktop/stock-dashboard/frontend/vite.config.ts)).
  - Found that the frontend was trying to request data natively (`http://localhost:8000`), which bypassed the frontend proxy entirely.
  - The API requests crashed into an HTTP 500 error because Node 17+ defaults `localhost` to the IPv6 loopback (`::1`), whereas the Python Uvicorn backend bound only to IPv4 (`127.0.0.1`).
- **Fix**:
  - Removed the hardcoded `localhost:8000` base URL from [frontend/src/services/api.ts](file:///Users/kuan.yen/Desktop/stock-dashboard/frontend/src/services/api.ts) to defer mapping to the proxy.
  - Established a proxy route in [vite.config.ts](file:///Users/kuan.yen/Desktop/stock-dashboard/frontend/vite.config.ts) mapping `/api` explicitly to `http://127.0.0.1:8000` avoiding the IPv6 Node refusal issue.

## Verification & Validation
- Ran the `yarn dev` client and authenticated into the application.
- Verified that all components no longer hang indefinitely and reliably render the Chart and metrics (Total Value, Unrealized PnL).
- Tests explicitly proved the backend endpoints return a `200 OK` status and valid JSON to the client.

### Visual Confirmation
Here are screenshots proving the dashboard now loads data successfully:
![Dashboard Loaded Success](/Users/kuan.yen/.gemini/antigravity/brain/22aa4f7c-9188-4f39-bbb5-f48e6b4907ff/dashboard_loaded_1773389150775.png)
![Stock details for 2330](/Users/kuan.yen/.gemini/antigravity/brain/22aa4f7c-9188-4f39-bbb5-f48e6b4907ff/stock_page_2330_1773389241850.png)

### End-to-End Workflow Recording
You can watch the full automated browser investigation and verification flow below:
![Verification browser recording](/Users/kuan.yen/.gemini/antigravity/brain/22aa4f7c-9188-4f39-bbb5-f48e6b4907ff/verify_dashboard_loading_fixed_1773389113532.webp)

With these changes, the frontend will accurately display real-time/latest price values to users across the dashboard and individual stock views.
