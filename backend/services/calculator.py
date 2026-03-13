from typing import List, Dict, Any
import collections

# Using the SQLAlchemy Transaction model indirectly via dict or ORM objects
def calculate_average_cost(transactions: List[Any]) -> Dict[str, Dict[str, Any]]:
    """
    Calculate inventory and average unit cost per stock symbol.
    Logic:
      BUY: adds to total_shares, adds to total_cost. New avg_cost = total_cost / total_shares.
      SELL: subtracts from total_shares. total_cost is reduced proportionally using current avg_cost.
      DIVIDEND_STOCK: adds to total_shares, total_cost remains same. New avg_cost = total_cost / total_shares.
    """
    inventory = {}

    for tx in transactions:
        sym = tx.symbol
        if sym not in inventory:
            inventory[sym] = {"shares": 0, "total_cost": 0.0, "avg_cost": 0.0, "realized_pnl": 0.0}
        
        inv = inventory[sym]
        
        if tx.type == "BUY":
            cost = (tx.shares * tx.price) + tx.fee
            inv["total_cost"] += cost
            inv["shares"] += tx.shares
            inv["avg_cost"] = inv["total_cost"] / inv["shares"] if inv["shares"] > 0 else 0
            
        elif tx.type == "SELL":
            if inv["shares"] < tx.shares:
                # Oversold or missing history
                pass 
            
            # Realized PNL = (Sell Price * shares - fee - tax) - (Average Cost * shares)
            net_proceeds = (tx.price * tx.shares) - tx.fee - tx.tax
            cost_basis = inv["avg_cost"] * tx.shares
            pnl = net_proceeds - cost_basis
            
            inv["realized_pnl"] += pnl
            inv["shares"] -= tx.shares
            inv["total_cost"] = inv["shares"] * inv["avg_cost"]
            
        elif tx.type == "DIVIDEND_STOCK":
            inv["shares"] += tx.shares
            inv["avg_cost"] = inv["total_cost"] / inv["shares"] if inv["shares"] > 0 else 0
            
        elif tx.type == "DIVIDEND_CASH":
            inv["realized_pnl"] += tx.price  # Usually cash dividends are logged as price or a separate amount column

    return inventory


def calculate_fifo_cost(transactions: List[Any]) -> Dict[str, Dict[str, Any]]:
    """
    Calculate inventory and cost basis using First-In-First-Out (FIFO).
    Logic:
      Maintain a queue of buy lots: {"shares": X, "unit_cost": Y}.
      SELL: depletes the oldest lots first to calculate realized PNL and remaining cost basis.
    """
    inventory = {}
    
    # Organize by symbol
    txs_by_sym = collections.defaultdict(list)
    for tx in transactions:
        txs_by_sym[tx.symbol].append(tx)
        
    for sym, txs in txs_by_sym.items():
        buy_lots = collections.deque()
        realized_pnl = 0.0
        
        for tx in txs:
            if tx.type == "BUY":
                unit_cost = ((tx.price * tx.shares) + tx.fee) / tx.shares if tx.shares > 0 else 0
                buy_lots.append({"shares": tx.shares, "unit_cost": unit_cost})
                
            elif tx.type == "SELL":
                shares_to_sell = tx.shares
                net_proceeds_per_share = ((tx.price * tx.shares) - tx.fee - tx.tax) / tx.shares if tx.shares > 0 else 0
                
                while shares_to_sell > 0 and buy_lots:
                    oldest_lot = buy_lots[0]
                    if oldest_lot["shares"] <= shares_to_sell:
                        # Deplete the entire lot
                        shares_sold = oldest_lot["shares"]
                        cost_basis = shares_sold * oldest_lot["unit_cost"]
                        realized_pnl += (shares_sold * net_proceeds_per_share) - cost_basis
                        
                        shares_to_sell -= shares_sold
                        buy_lots.popleft()
                    else:
                        # Partially deplete the lot
                        shares_sold = shares_to_sell
                        cost_basis = shares_sold * oldest_lot["unit_cost"]
                        realized_pnl += (shares_sold * net_proceeds_per_share) - cost_basis
                        
                        oldest_lot["shares"] -= shares_sold
                        shares_to_sell = 0
            
            elif tx.type == "DIVIDEND_STOCK":
                # For stock dividends in FIFO, ideally they distribute across all existing lots to lower unit cost.
                # Simplified: add a new 0-cost lot.
                buy_lots.append({"shares": tx.shares, "unit_cost": 0.0})
                
            elif tx.type == "DIVIDEND_CASH":
                realized_pnl += tx.price
                
        # Calculate remaining inventory and cost
        current_shares = sum(lot["shares"] for lot in buy_lots)
        total_remaining_cost = sum(lot["shares"] * lot["unit_cost"] for lot in buy_lots)
        avg_cost = total_remaining_cost / current_shares if current_shares > 0 else 0
        
        inventory[sym] = {
            "shares": current_shares,
            "total_cost": total_remaining_cost,
            "avg_cost": avg_cost,
            "realized_pnl": realized_pnl
        }
        
    return inventory
