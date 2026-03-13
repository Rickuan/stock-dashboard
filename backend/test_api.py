import requests

def test_twse():
    url = "https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL"
    try:
        res = requests.get(url, timeout=10)
        print("TWSE status:", res.status_code)
        if res.status_code == 200:
            data = res.json()
            if len(data) > 0:
                print("TWSE sample item:", data[0].get("Code"), data[0].get("ClosingPrice"))
    except Exception as e:
        print("TWSE Error:", e)

def test_yahoo(sym):
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{sym}?interval=1d&range=1d"
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
    try:
        res = requests.get(url, headers=headers, timeout=10)
        print(f"Yahoo status for {sym}:", res.status_code)
        if res.status_code == 200:
            data = res.json()
            meta = data['chart']['result'][0]['meta']
            price = meta['regularMarketPrice']
            print(f"Yahoo price for {sym}:", price)
    except Exception as e:
        print(f"Yahoo Error for {sym}:", e)

test_twse()
test_yahoo("AAPL")
test_yahoo("2330.TW")
