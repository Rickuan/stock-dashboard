import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal
from models import Transaction
from services.scheduler import fetch_prices, PRICE_CACHE

db = SessionLocal()
aapl_tx = Transaction(
    date="2026-01-01",
    time="10:00:00",
    symbol="AAPL",
    name="Apple",
    type="BUY",
    shares=10,
    price=150.0,
    fee=1.0,
    tax=0.0
)
db.add(aapl_tx)
db.commit()
db.close()

print("Fetching prices with AAPL in DB...")
fetch_prices()

print("Final Price Cache:", PRICE_CACHE)
