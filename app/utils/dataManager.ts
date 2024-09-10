// dataManager.ts
let chartData: any = null;

export async function fetchChartData() {
  if (chartData) return chartData;

  try {
    const response = await fetch('/api/crypto-data');
    if (!response.ok) {
      throw new Error('Failed to fetch crypto data');
    }
    chartData = await response.json();
    console.log('Fetched chart data in dataManager:', chartData);
    return chartData;
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    throw error;
  }
}

export async function refreshChartData(symbol: string) {
  try {
    const response = await fetch(`/api/crypto-data/${symbol}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch crypto data for ${symbol}`);
    }
    const newData = await response.json();
    if (chartData && typeof chartData === 'object') {
      chartData[symbol] = newData[symbol];
    } else {
      chartData = newData;
    }
    
    return chartData[symbol];
  } catch (error) {
    console.error(`Error refreshing crypto data for ${symbol}:`, error);
    throw error;
  }
}

export function getChartData(chartData: any, symbol: string, timeFrame: string) {
  console.log('getChartData called with:', { symbol, timeFrame });
  console.log('Available symbols:', Object.keys(chartData));

  if (!chartData || !chartData[symbol]) {
    console.error('Missing data for symbol:', symbol);
    return [];
  }

  console.log('Available timeframes for', symbol, ':', Object.keys(chartData[symbol]));

  const timeFrameData = chartData[symbol][timeFrame];

  if (!timeFrameData || !Array.isArray(timeFrameData)) {
    console.error('Missing or invalid data for timeframe:', timeFrame);
    return [];
  }

  console.log('Data points for', symbol, timeFrame, ':', timeFrameData.length);

  // Convert data and handle duplicate timestamps
  const convertedData = timeFrameData.map((d: any) => ({
    time: new Date(d.Datetime).getTime() / 1000,
    open: parseFloat(d.Open),
    high: parseFloat(d.High),
    low: parseFloat(d.Low),
    close: parseFloat(d.Close)
  }));

  // Sort data by time
  convertedData.sort((a: any, b: any) => a.time - b.time);

  // Remove duplicates, keeping the last entry for each timestamp
  const uniqueData = convertedData.reduce((acc: any[], current: any) => {
    const existingEntry = acc.find(item => item.time === current.time);
    if (existingEntry) {
      // Replace existing entry with current one
      Object.assign(existingEntry, current);
    } else {
      acc.push(current);
    }
    return acc;
  }, []);

  console.log('Processed data points:', uniqueData.length);
  return uniqueData;
}

export function getAvailableSymbols(data: any) {
  return Object.keys(data);
}

export function getAvailableTimeframes(data: any, symbol: string) {
  if (!data[symbol]) {
    throw new Error(`No data available for ${symbol}`);
  }
  return Object.keys(data[symbol]);
}