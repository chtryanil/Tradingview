import yfinance as yf
import json
from datetime import datetime, timedelta
import time
import pandas as pd
import os
import pytz

def fetch_crypto_data(symbol, start_date, end_date, interval):
    ticker = yf.Ticker(symbol)
    data = ticker.history(start=start_date, end=end_date, interval=interval)
    return data.reset_index().to_dict(orient='records')

def json_serial(obj):
    if isinstance(obj, (datetime, pd.Timestamp)):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

def load_existing_data(data_file):
    if os.path.exists(data_file):
        with open(data_file, 'r') as f:
            return json.load(f)
    return {}

def ensure_utc(dt):
    if dt.tzinfo is None:
        return dt.replace(tzinfo=pytz.UTC)
    return dt.astimezone(pytz.UTC)

def get_last_update_time(data, symbol, timeframe):
    if symbol in data and timeframe in data[symbol] and data[symbol][timeframe]:
        last_entry = data[symbol][timeframe][-1]['Datetime']
        if isinstance(last_entry, str):
            return ensure_utc(pd.to_datetime(last_entry))
        elif isinstance(last_entry, (int, float)):
            return ensure_utc(pd.to_datetime(last_entry, unit='s'))
    return None

def main():
    crypto_symbols = ['BTC-USD', 'ETH-USD', 'AVAX-USD', 'AAVE-USD', 'QNT-USD', 'BNB-USD', 'XRP-USD', 'ADA-USD', 'DOGE-USD', 'SOL-USD', 'MATIC-USD', 'DOT-USD']
    timeframes = {
        '15m': ('15m', timedelta(days=60)),  # 60 days of 15m data
        '1h': ('1h', timedelta(days=730)),   # 2 years of 1h data
    }

    data_file = 'crypto_data.json'

    try:
        while True:
            all_data = load_existing_data(data_file)
            current_time = ensure_utc(datetime.now())

            for symbol in crypto_symbols:
                if symbol not in all_data:
                    all_data[symbol] = {}

                for timeframe, (interval, max_history) in timeframes.items():
                    print(f"Fetching {symbol} data for {timeframe} timeframe...")
                    
                    if timeframe not in all_data[symbol]:
                        all_data[symbol][timeframe] = []

                    try:
                        last_update = get_last_update_time(all_data, symbol, timeframe)
                        
                        if last_update is None:
                            start_date = current_time - max_history
                        else:
                            start_date = last_update + timedelta(minutes=1)

                        if start_date >= current_time:
                            print(f"Data for {symbol} at {timeframe} is up to date.")
                            continue

                        new_data = fetch_crypto_data(symbol, start_date, current_time, interval)
                        
                        # Convert Datetime to UTC ISO format string
                        for entry in new_data:
                            entry['Datetime'] = ensure_utc(pd.to_datetime(entry['Datetime'])).isoformat()

                        all_data[symbol][timeframe].extend(new_data)
                        
                        # Remove data older than max_history
                        cutoff_date = current_time - max_history
                        all_data[symbol][timeframe] = [
                            d for d in all_data[symbol][timeframe]
                            if ensure_utc(pd.to_datetime(d['Datetime'])) > cutoff_date
                        ]
                    except Exception as e:
                        print(f"Error fetching data for {symbol} at {timeframe}: {str(e)}")
                    
                    time.sleep(1)  # Small delay to avoid overwhelming the API

            with open(data_file, 'w') as f:
                json.dump(all_data, f, default=json_serial)

            print(f"Data updated at {current_time}")
            time.sleep(3600)  # Sleep for 1 hour

    except KeyboardInterrupt:
        print("\nScript terminated by user. Saving data...")
        with open(data_file, 'w') as f:
            json.dump(all_data, f, default=json_serial)
        print("Data saved. Exiting.")

if __name__ == "__main__":
    main()