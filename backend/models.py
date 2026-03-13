from sqlalchemy import Column, Integer, String, Float, Enum
import enum
from database import Base

class TransactionType(str, enum.Enum):
    BUY = "BUY"
    SELL = "SELL"
    DIVIDEND_CASH = "DIVIDEND_CASH"
    DIVIDEND_STOCK = "DIVIDEND_STOCK"
    CAPITAL_REDUCTION = "CAPITAL_REDUCTION"

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String, index=True)
    time = Column(String)
    symbol = Column(String, index=True)
    name = Column(String)
    type = Column(Enum(TransactionType))
    price = Column(Float)
    shares = Column(Integer)
    fee = Column(Float)
    tax = Column(Float)
