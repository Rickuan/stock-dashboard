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

def fetch_prices():
    """
    Fetch current stock prices for all holdings. 
    This uses Yahoo Finance unofficial API endpoint as a free robust alternative for TSWE.
    E.g. 2330.TW
    """
    symbols = get_unique_symbols()
    if not symbols:
        print("No stocks in portfolio to fetch prices for.")
        return

    print(f"[{datetime.now()}] Fetching prices for {symbols}...")
    for sym in symbols:
        # Convert simple TW identifier to Yahoo Finance identifier (assumes .TW list mostly)
        yf_sym = f"{sym}.TW"
        url = f"https://query1.finance.yahoo.com/v8/finance/chart/{yf_sym}?interval=1d&range=1d"
        headers = {'User-Agent': 'Mozilla/5.0'}
        try:
            res = requests.get(url, headers=headers)
            if res.status_code == 200:
                data = res.json()
                meta = data['chart']['result'][0]['meta']
                current_price = meta['regularMarketPrice']
                PRICE_CACHE[sym] = current_price
                print(f"Updated {sym}: ${current_price}")
            else:
                print(f"Failed to fetch {sym}, status {res.status_code}")
        except Exception as e:
            print(f"Error fetching {sym}: {e}")

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
