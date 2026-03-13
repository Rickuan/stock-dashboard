from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import shutil
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

import models
import schemas
from database import engine, get_db
from services.calculator import calculate_average_cost, calculate_fifo_cost
from services.scheduler import PRICE_CACHE, fetch_prices

# Create DB tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Stock Dashboard API")

# Setup CORS to allow React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/transactions", response_model=List[schemas.Transaction])
def read_transactions(skip: int = 0, limit: int = 100, symbol: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Transaction)
    if symbol:
        query = query.filter(models.Transaction.symbol == symbol)
    transactions = query.offset(skip).limit(limit).all()
    return transactions

@app.delete("/api/transactions")
def delete_all_transactions(db: Session = Depends(get_db)):
    db.query(models.Transaction).delete()
    db.commit()
    return {"message": "All transactions deleted"}

@app.post("/api/transactions/mock")
def create_mock_data():
    import mock_data
    mock_data.seed_db()
    # Trigger an immediate price refresh since new symbols might have been added
    logger.info("Triggering price fetch for mock data...")
    fetch_prices()
    return {"message": "Mock data correctly generated and seeded"}

@app.post("/api/login")
def login(credentials: dict):
    # Hardcoded fake login endpoint to mimic future auth service
    username = credentials.get("username")
    password = credentials.get("password")
    
    if username == "admin" and password == "000":
        return {"token": "fake-jwt-token"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/api/upload-csv")
async def upload_csv(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    inbox_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data_inbox")
    os.makedirs(inbox_dir, exist_ok=True)
    
    file_path = os.path.join(inbox_dir, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    logger.info(f"File {file.filename} was successfully saved to {inbox_dir}.")
    # The watcher.py will automatically pick it up and process it.
    return {"message": f"Successfully uploaded {file.filename} to processing queue"}

@app.get("/api/dashboard", response_model=schemas.DashboardMetrics)
def get_dashboard(method: str = "AVERAGE", db: Session = Depends(get_db)):
    transactions = db.query(models.Transaction).all()
    
    if method == "FIFO":
        inventory = calculate_fifo_cost(transactions)
    else:
        inventory = calculate_average_cost(transactions)
        
    total_cost = 0.0
    total_value = 0.0
    total_realized_pnl = 0.0
    
    holdings = {}
    
    for sym, inv in inventory.items():
        if inv["shares"] > 0 or inv["realized_pnl"] != 0:
            shares = inv["shares"]
            avg_cost = inv["avg_cost"]
            current_price = PRICE_CACHE.get(sym, avg_cost) # Fallback to avg_cost if no price yet
            
            cost_basis = inv["total_cost"]
            current_value = shares * current_price
            
            unrealized_pnl = current_value - cost_basis
            
            total_cost += cost_basis
            total_value += current_value
            total_realized_pnl += inv["realized_pnl"]
            
            holdings[sym] = {
                "shares": shares,
                "avg_cost": avg_cost,
                "current_price": current_price,
                "cost_basis": cost_basis,
                "current_value": current_value,
                "unrealized_pnl": unrealized_pnl,
                "unrealized_pnl_percent": (unrealized_pnl / cost_basis * 100) if cost_basis > 0 else 0,
                "realized_pnl": inv["realized_pnl"]
            }
            
    return schemas.DashboardMetrics(
        total_cost=total_cost,
        total_value=total_value,
        realized_pnl=total_realized_pnl,
        unrealized_pnl=total_value - total_cost,
        holdings=holdings
    )
