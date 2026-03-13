import os
import sys

# Add the backend directory to python path if running as standalone
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, engine, Base
from models import Transaction, TransactionType

# Create tables
Base.metadata.create_all(bind=engine)

def seed_db():
    db = SessionLocal()
    
    print("Seeding database with mock transactions...")

    mock_txs = [
        Transaction(
            date='2023-10-01', time='09:05', symbol='2330', name='台積電',
            type=TransactionType.BUY, price=540, shares=1000, fee=769, tax=0
        ),
        Transaction(
            date='2023-10-15', time='11:20', symbol='0050', name='元大台灣50',
            type=TransactionType.BUY, price=125.5, shares=2000, fee=357, tax=0
        ),
        Transaction(
            date='2023-11-05', time='13:15', symbol='2330', name='台積電',
            type=TransactionType.SELL, price=580, shares=1000, fee=826, tax=1740
        ),
        Transaction(
            date='2024-03-01', time='14:00', symbol='2330', name='台積電',
            type=TransactionType.DIVIDEND_CASH, price=0, shares=1000, fee=0, tax=0
            # Note: real apps might handle DIVIDEND_CASH amount differently (e.g., using `price` or `fee` column for cash mount)
        ),
        Transaction(
            date='2024-03-01', time='14:00', symbol='2330', name='台積電',
            type=TransactionType.BUY, price=800, shares=5000, fee=0, tax=0
        ),
        Transaction(
            date='2024-04-01', time='14:00', symbol='2330', name='台積電',
            type=TransactionType.BUY, price=1000, shares=1000, fee=0, tax=0
        ),
        Transaction(
            date='2024-05-01', time='14:00', symbol='2330', name='台積電',
            type=TransactionType.BUY, price=1010, shares=1000, fee=0, tax=0
        ),
        Transaction(
            date='2024-05-01', time='14:00', symbol='2330', name='台積電',
            type=TransactionType.SELL, price=1050, shares=2000, fee=0, tax=0
        ),
        Transaction(
            date='2024-05-02', time='14:00', symbol='2330', name='台積電',
            type=TransactionType.SELL, price=1090, shares=3000, fee=0, tax=0
        )
    ]

    for tx in mock_txs:
        db.add(tx)
    
    db.commit()
    db.close()
    print("Seeding complete.")

if __name__ == "__main__":
    seed_db()
