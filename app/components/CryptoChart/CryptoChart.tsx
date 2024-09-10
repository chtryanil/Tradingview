'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createChart, ColorType, IChartApi, ISeriesApi, CrosshairMode } from 'lightweight-charts'
import { getChartData } from '../../utils/dataManager'

interface CryptoChartProps {
  chartData: any;
  symbol: string;
  timeFrame: string;
  selectedIndicators: string[];
}

export default function CryptoChart({ chartData, symbol, timeFrame, selectedIndicators }: CryptoChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { type: ColorType.Solid, color: '#1E222D' },
        textColor: '#D9D9D9',
      },
      grid: {
        vertLines: { color: '#2B2B43' },
        horzLines: { color: '#2B2B43' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: '#2B2B43',
      },
      timeScale: {
        borderColor: '#2B2B43',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current || !seriesRef.current || !chartData || !symbol || !timeFrame) return;

    try {
      const data = getChartData(chartData, symbol, timeFrame);
     

      if (data.length > 0) {
        seriesRef.current.setData(data);
        chartRef.current.timeScale().fitContent();
        setError(null);
      } else {
        setError(`No data available for the selected symbol (${symbol}) and timeframe (${timeFrame})`);
      }
    } catch (err) {
      console.error('Error loading chart data:', err);
      setError(`Failed to load chart data: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [chartData, symbol, timeFrame]);

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div ref={chartContainerRef} className="w-full h-full" />
  );
}