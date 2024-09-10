export function calculateSupportResistance(data: any[], lookback: number = 14, levels: number = 3) {
  const highs = data.map(d => d.high);
  const lows = data.map(d => d.low);

  const supportLevels: number[] = [];
  const resistanceLevels: number[] = [];

  for (let i = lookback; i < data.length; i++) {
    const localLow = Math.min(...lows.slice(i - lookback, i));
    const localHigh = Math.max(...highs.slice(i - lookback, i));

    if (lows[i] === localLow && !supportLevels.includes(localLow)) {
      supportLevels.push(localLow);
    }

    if (highs[i] === localHigh && !resistanceLevels.includes(localHigh)) {
      resistanceLevels.push(localHigh);
    }

    if (supportLevels.length >= levels && resistanceLevels.length >= levels) {
      break;
    }
  }

  return {
    support: supportLevels.slice(0, levels),
    resistance: resistanceLevels.slice(0, levels),
  };
}