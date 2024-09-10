export function generateCandlestickData(basePrice: number, timeFrame: string) {
  const data = []
  let time = new Date()
  let open = basePrice
  let high = basePrice
  let low = basePrice
  let close = basePrice

  const candleCount = {
    '15m': 96,    // 24 hours
    '1h': 168,    // 7 days
    '4h': 168,    // 28 days
    '1d': 30,     // 30 days
    '7d': 52,     // 52 weeks
  }[timeFrame]

  const timeIncrement = {
    '15m': 15 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '4h': 4 * 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
  }[timeFrame]

  for (let i = 0; i < candleCount; i++) {
    open = close
    high = open * (1 + Math.random() * 0.03)
    low = open * (1 - Math.random() * 0.03)
    close = low + Math.random() * (high - low)

    data.push({
      time: time.getTime() / 1000,
      open: open,
      high: high,
      low: low,
      close: close,
    })

    time = new Date(time.getTime() - timeIncrement)
  }

  return data.reverse()
}