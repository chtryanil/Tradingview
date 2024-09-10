import axios from 'axios';

const BINANCE_API_URL = 'https://api.binance.com/api/v3';

interface BinanceTickerData {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
}

export async function fetchPricesAndChanges(symbols: string[]) {
  try {
    const response = await axios.get(`${BINANCE_API_URL}/ticker/24hr`);
    const allTickers: BinanceTickerData[] = response.data;

    const prices: Record<string, number> = {};
    const changes: Record<string, number> = {};

    symbols.forEach(symbol => {
      // Convert symbol format: 'BTC-USD' -> 'BTCUSDT'
      const binanceSymbol = symbol.replace('-', '').replace('USD', 'USDT');
      const ticker = allTickers.find(t => t.symbol === binanceSymbol);
      
      if (ticker) {
        prices[symbol] = parseFloat(ticker.lastPrice);
        changes[symbol] = parseFloat(ticker.priceChangePercent);
      } else {
        console.warn(`No data received for ${symbol} (Binance symbol: ${binanceSymbol})`);
      }
    });

    console.log('Processed prices:', prices);
    console.log('Processed changes:', changes);

    return { prices, changes };
  } catch (error) {
    console.error('Error fetching prices and changes from Binance:', error);
    throw error;
  }
}