import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.scheduler import fetch_prices, PRICE_CACHE
import mock_data

print("Seeding DB with mock data...")
mock_data.seed_db()

print("Fetching prices...")
fetch_prices()

print("Current Price Cache:", PRICE_CACHE)
