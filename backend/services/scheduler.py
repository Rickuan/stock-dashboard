import sys
import os
import time
import requests
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import SessionLocal
from models import Transaction

# In-memory cache for stock prices
PRICE_CACHE = {}

def get_unique_symbols():
    db = SessionLocal()
    # Distinct symbols
    symbols = db.query(Transaction.symbol).distinct().all()
    db.close()
    return [s[0] for s in symbols]

def fetch_twse_prices():
    url = "https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL"
    try:
        res = requests.get(url, timeout=10)
        if res.status_code == 200:
            data = res.json()
            return {item["Code"]: float(item["ClosingPrice"]) for item in data if "Code" in item and "ClosingPrice" in item and item["ClosingPrice"] != ""}
    except Exception as e:
        print(f"Error fetching TWSE openapi: {e}")
    return {}

def fetch_yahoo_finance_prices():
    url = "https://query1.finance.yahoo.com/v8/finance/chart/{yf_sym}?interval=1d&range=1d"
    headers = {'User-Agent': 'Mozilla/5.0'}
    try:
        res = requests.get(url, headers=headers, timeout=10)
        if res.status_code == 200:
            data = res.json()
            meta = data['chart']['result'][0]['meta']
            price = meta['regularMarketPrice']
            print(f"Updated {sym} from Yahoo Finance: ${price}")
        else:
            print(f"Failed to fetch {sym} from Yahoo Finance, status {res.status_code}")
    except Exception as e:
        print(f"Error fetching {sym} from Yahoo Finance: {e}")
    return {}

def fetch_prices():
    """
    Fetch current stock prices for all holdings. 
    This uses TWSE OpenAPI endpoint first, and falls back to Yahoo Finance.
    """
    symbols = get_unique_symbols()
    if not symbols:
        print("No stocks in portfolio to fetch prices for.")
        return

    print(f"[{datetime.now()}] Fetching prices for {symbols}...")
    
    twse_data = fetch_twse_prices()
    yahoo_data = fetch_yahoo_finance_prices()

    for sym in symbols:
        price = None
        # Try TWSE first
        if sym in twse_data:
            price = twse_data[sym]
            print(f"Updated {sym} from TWSE: ${price}")
        else:
            price = yahoo_data[sym]
            print(f"Updated {sym} from Yahoo Finance: ${price}")

        if price is not None:
            PRICE_CACHE[sym] = price

    print(f"[{datetime.now()}] Price cache updated: {PRICE_CACHE}")

def start_scheduler():
    scheduler = BackgroundScheduler()
    # Runs Monday to Friday, between 9 and 14, every 1 hour (as requested)
    scheduler.add_job(fetch_prices, 'cron', day_of_week='mon-fri', hour='9-14')
    # Run once at 14:30 for final close
    scheduler.add_job(fetch_prices, 'cron', day_of_week='mon-fri', hour='14', minute='30')
    scheduler.start()
    
    # Do an initial fetch on startup
    fetch_prices()
    
    return scheduler

if __name__ == "__main__":
    scheduler = start_scheduler()
    try:
        while True:
            time.sleep(2)
    except KeyboardInterrupt:
        scheduler.shutdown()
