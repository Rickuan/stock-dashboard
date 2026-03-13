import os
import sys
import time
import shutil
import pandas as pd
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Ensure backend package can be imported
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import SessionLocal
from models import Transaction, TransactionType

INBOX_DIR = "/Users/kuan.yen/Desktop/stock-dashboard/data_inbox"
ARCHIVE_DIR = "/Users/kuan.yen/Desktop/stock-dashboard/data_archive"

os.makedirs(INBOX_DIR, exist_ok=True)
os.makedirs(ARCHIVE_DIR, exist_ok=True)

class CSVHandler(FileSystemEventHandler):
    def process_file(self, file_path):
        if not file_path.endswith('.csv'):
            return
            
        print(f"Detected new CSV file: {file_path}")
        try:
            # Expected headers: Date,Time,Symbol,Name,Type,Price,Shares,Fee,Tax
            df = pd.read_csv(file_path)
            
            db = SessionLocal()
            for _, row in df.iterrows():
                try:
                    # Map to Transaction model
                    tx = Transaction(
                        date=str(row['Date']),
                        time=str(row['Time']),
                        symbol=str(row['Symbol']),
                        name=str(row['Name']),
                        type=TransactionType(row['Type']),
                        price=float(row['Price']),
                        shares=int(row['Shares']),
                        fee=float(row.get('Fee', 0)),
                        tax=float(row.get('Tax', 0))
                    )
                    db.add(tx)
                except Exception as e:
                    print(f"Failed to load row: {row}. Error: {e}")
            
            db.commit()
            db.close()
            print(f"Successfully imported data from {file_path}")
            
            # Archive file
            file_name = os.path.basename(file_path)
            archive_path = os.path.join(ARCHIVE_DIR, file_name)
            
            if os.path.exists(archive_path):
                # add timestamp to duplicate files
                archive_path += f".{int(time.time())}"
                
            shutil.move(file_path, archive_path)
            print(f"Archived file to {archive_path}")
            
        except Exception as e:
            print(f"Failed to process {file_path}: {e}")

    def on_created(self, event):
        if not event.is_directory:
            # Wait briefly to ensure file is fully written before processing
            time.sleep(1)
            self.process_file(event.src_path)

def start_watcher():
    event_handler = CSVHandler()
    observer = Observer()
    observer.schedule(event_handler, INBOX_DIR, recursive=False)
    observer.start()
    print(f"Started monitoring folder: {INBOX_DIR}")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

if __name__ == "__main__":
    start_watcher()
