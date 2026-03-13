from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict, Any, List
from models import TransactionType

class TransactionBase(BaseModel):
    date: str
    time: str
    symbol: str
    name: str
    type: TransactionType
    price: float
    shares: int
    fee: float
    tax: float

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)

class DashboardMetrics(BaseModel):
    total_cost: float
    total_value: float
    realized_pnl: float
    unrealized_pnl: float
    holdings: Dict[str, Any]
