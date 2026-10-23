"""Next-day stock price forecaster: naive baselines vs. ML models.

Data: plotly/datasets stockdata.csv, daily adjusted closes for AAPL, MSFT,
IBM, SBUX and the S&P 500 index (GSPC), Jan 2007 to Mar 2016.
https://raw.githubusercontent.com/plotly/datasets/master/stockdata.csv

Usage:
    python forecast.py                       # AAPL, last 250 trading days held out
    python forecast.py --ticker MSFT
    python forecast.py --csv prices.csv --ticker Close   # your own data (needs a Date column)
"""
import argparse
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.linear_model import Ridge

OUT = Path(__file__).parent
DATA_URL = "https://raw.githubusercontent.com/plotly/datasets/master/stockdata.csv"


def load(csv):
    src = csv or (OUT / "stockdata.csv" if (OUT / "stockdata.csv").exists() else DATA_URL)
    return pd.read_csv(src, parse_dates=["Date"]).sort_values("Date").set_index("Date")


def features(prices, market=None):
    """Features at day t use only prices up to t. Target is the log return t -> t+1."""
    r = np.log(prices).diff()
    X = pd.DataFrame(index=prices.index)
    for lag in range(5):
        X[f"ret_lag{lag}"] = r.shift(lag)
    X["ret_5d"] = r.rolling(5).sum()
    X["ret_20d"] = r.rolling(20).sum()
    X["vol_20d"] = r.rolling(20).std()
    X["dist_ma50"] = prices / prices.rolling(50).mean() - 1
    X["dow"] = prices.index.dayofweek
    if market is not None:
        mr = np.log(market).diff()
        X["mkt_ret"] = mr
        X["mkt_ret_5d"] = mr.rolling(5).sum()
    y = r.shift(-1)
    return X, y


def metrics(actual_price, pred_price, prev_price):
    err = actual_price - pred_price
    true_dir = np.sign(actual_price - prev_price)
    pred_dir = np.sign(pred_price - prev_price)
    moved = pred_dir != 0
    return {
        "MAE $": np.mean(np.abs(err)),
        "RMSE $": np.sqrt(np.mean(err ** 2)),
        "MAPE %": 100 * np.mean(np.abs(err) / actual_price),
        "Direction hit %": 100 * np.mean(true_dir[moved] == pred_dir[moved]) if moved.any() else np.nan,
    }


def run(df, ticker, holdout):
    prices = df[ticker]
    market = df["GSPC"] if "GSPC" in df and ticker != "GSPC" else None
    X, y = features(prices, market)
    ok = X.notna().all(axis=1) & y.notna()
    X, y = X[ok], y[ok]
    split = len(X) - holdout
    Xtr, ytr, Xte = X.iloc[:split], y.iloc[:split], X.iloc[split:]

    prev = prices.loc[Xte.index].to_numpy()                    # price on day t
    actual = prices.shift(-1).loc[Xte.index].to_numpy()        # price on day t+1
    drift = ytr.mean()

    preds = {
        "Naive (tomorrow = today)": prev,
        "Drift (avg daily return)": prev * np.exp(drift),
    }
    ridge = Ridge(alpha=1.0).fit(Xtr, ytr)
    preds["Ridge regression"] = prev * np.exp(ridge.predict(Xte))
    gbm = HistGradientBoostingRegressor(max_iter=300, learning_rate=0.03, max_depth=3,
                                        min_samples_leaf=50, random_state=0).fit(Xtr, ytr)
    preds["Gradient boosting"] = prev * np.exp(gbm.predict(Xte))

    table = pd.DataFrame({k: metrics(actual, p, prev) for k, p in preds.items()}).T
    dates = prices.index[prices.index.get_indexer(Xte.index) + 1]  # date being forecast
    return table, dates, actual, preds


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--csv", help="your own CSV with a Date column and one column per ticker")
    ap.add_argument("--ticker", default="AAPL")
    ap.add_argument("--holdout", type=int, default=250, help="trading days held out (~1 year)")
    args = ap.parse_args()
    df = load(args.csv)

    table, dates, actual, preds = run(df, args.ticker, args.holdout)
    print(f"{args.ticker}: next-day forecast, last {args.holdout} trading days\n")
    print(table.round(2).to_string())
    table.round(3).to_csv(OUT / f"metrics_{args.ticker}.csv")
    pd.DataFrame({"date": dates, "actual": actual, **{k: v.round(3) for k, v in preds.items()}}
                 ).to_csv(OUT / f"holdout_forecast_{args.ticker}.csv", index=False)

    if not args.csv:  # same experiment on every ticker in the public dataset
        rows = {}
        for t in df.columns:
            rmse = run(df, t, args.holdout)[0]["RMSE $"]
            rows[t] = rmse / rmse["Naive (tomorrow = today)"]
        rel = pd.DataFrame(rows).T.round(3)
        print("\nRMSE relative to naive (below 1.0 = better than naive):\n")
        print(rel.to_string())
        rel.to_csv(OUT / "rmse_vs_naive_all_tickers.csv")

    fig, (ax, ax2) = plt.subplots(2, 1, figsize=(11, 6.5), height_ratios=[2.2, 1], sharex=True)
    hist = df[args.ticker].loc[: dates[0]].iloc[-150:]
    ax.plot(hist.index, hist, color="#9aa0a6", lw=1, label="History")
    ax.plot(dates, actual, color="#202124", lw=1.3, label="Actual")
    ax.plot(dates, preds["Gradient boosting"], color="#1a73e8", lw=1, label="Gradient boosting")
    ax.axvline(dates[0], color="#9aa0a6", lw=0.8, ls=":")
    ax.set_ylabel(f"{args.ticker} adjusted close (\\$)")
    t = table["RMSE $"]
    ax.set_title(f"{args.ticker} next-day forecast  |  RMSE: boosting \\${t['Gradient boosting']:.2f}"
                 f" vs naive \\${t['Naive (tomorrow = today)']:.2f}", loc="left", fontsize=11)
    ax.legend(frameon=False, ncol=3, loc="upper left", fontsize=9)
    err_ml = np.abs(actual - preds["Gradient boosting"])
    err_nv = np.abs(actual - preds["Naive (tomorrow = today)"])
    ax2.plot(dates, pd.Series(err_nv - err_ml).rolling(20).mean(), color="#1a73e8", lw=1.2)
    ax2.axhline(0, color="#9aa0a6", lw=0.8)
    ax2.set_ylabel("Naive error minus\nboosting error (\\$)", fontsize=9)
    ax2.set_title("20-day rolling average; above 0 means the model beat naive", loc="left", fontsize=9)
    for a in (ax, ax2):
        for s in ("top", "right"):
            a.spines[s].set_visible(False)
    fig.tight_layout()
    fig.savefig(OUT / f"forecast_{args.ticker}.png", dpi=150)


if __name__ == "__main__":
    main()
