import yfinance as yf
import pandas as pd
import os
import re
from datetime import datetime

def createName(kind, ticker, start, end, interval):
	return f"{ticker}_{start}_{end}_{interval}.csv"

def getDirName(kind, ticker):
	return f"output/{kind}/{ticker}"

# convert a time parameter formatted as 1m 5m 1h 1d 1mo 3mo 1y to a number of miliseconds
def convertPeriod(time):
	suffixes = {
		"m": 60,
		"h": 60 * 60,
		"d": 24 * 60 * 60,
		"mo": 30 * 24 * 60 * 60,
		"y": 365 * 24 * 60 * 60
	}

	repl = re.sub("(m|d|h|mo|y)", r" \g<1>", time)

	spl = repl.split(" ")
	amount = int(spl[0])
	suffix = spl[1]
	res = amount * suffixes[suffix]

	return res

def getData(actual_start, actual_end, inter):
	DIR = os.getcwd()
	TICKERS_FILE =  "output/tickers.csv"

	TICKERS_OFFSET = 674
	TICKERS_LIMIT = 500

	INTERVAL = inter

	TICKERS = pd.read_csv(os.path.join(DIR, TICKERS_FILE)).sort_values(
		by=["Market Cap"], ascending=False).iloc[TICKERS_OFFSET:TICKERS_LIMIT+TICKERS_OFFSET]["Symbol"].values

	print("downloading", TICKERS)

	data = yf.download(
		tickers=" ".join(TICKERS),
		interval=INTERVAL,
		start=actual_start,
		end=actual_end,
		group_by="ticker",
		auto_adjust=True,
		threads=8,
		actions=True,
		show_errors=True,
		progress=True)

	COLUMNS_OHLCV = ["Open", "High", "Low", "Close", "Volume"]
	COLUMNS_ACTIONS = ["Dividends", "Stock Splits"]
	for ticker in TICKERS:
		indexes = data[ticker].index.tolist()

		start = str(min(indexes)).replace(" ", "_").replace(":", "_")
		end = str(max(indexes)).replace(" ", "_").replace(":", "_")

		OCHLV_DIR = os.path.join(DIR, getDirName("ohclv", ticker))
		ACTIONS_DIR = os.path.join(DIR, getDirName("actions", ticker))

		os.path.exists(OCHLV_DIR) or os.makedirs(OCHLV_DIR)
		os.path.exists(ACTIONS_DIR) or os.makedirs(ACTIONS_DIR)

		# Store OHLCV
		df_ohlcv = data[ticker][COLUMNS_OHLCV]
		df_ohlcv.to_csv(os.path.join(OCHLV_DIR, createName(
			"ohclv", ticker, start, end, INTERVAL)))
		# Store actions
		df_actions = data[ticker][COLUMNS_ACTIONS]
		df_actions.to_csv(os.path.join(
			ACTIONS_DIR, createName("ohclv", ticker, start, end, INTERVAL)))

def fromOffsetPeriod(offset, period):
	start = int(datetime.now().timestamp() - offset - period)
	end = int(datetime.now().timestamp() - offset)

	actual_start = datetime.fromtimestamp(start).strftime("%Y-%m-%d")
	actual_end = datetime.fromtimestamp(end).strftime("%Y-%m-%d")

	return (actual_start, actual_end)
# get precise data
def getPrecise():
	PERIOD = convertPeriod("7d")
	
	for x in range(3,-1, -1):
		OFFSET = PERIOD * x

		start, end = fromOffsetPeriod(OFFSET, PERIOD)
		getData(start,end, "1m")
		


# getPrecise()

# get granular data
def getGranular():
	EARLIEST_START = "1900-01-01"
	END = datetime.now().strftime("%Y-%m-%d")

	getData(EARLIEST_START, END, "1d")

getPrecise()
getGranular()

# Load 1m interval for max period (1m)

# Load 1d interval for max period

# Load actions

# Store
