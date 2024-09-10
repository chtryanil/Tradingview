'use client'

import React, { useState, useRef, useEffect } from 'react'
import Header from './components/Header/Header'
import CryptoList from './components/CryptoList/CryptoList'
import CryptoInfo from './components/CryptoInfo/CryptoInfo'
import TimeFrameSelector from './components/TimeFrameSelector/TimeFrameSelector'
import CryptoChart from './components/CryptoChart/CryptoChart'
import { fetchChartData, getAvailableSymbols, getAvailableTimeframes } from './utils/dataManager'
import axios from 'axios';
import { fetchPricesAndChanges } from './utils/binanceApi';

export default function CryptoScreener() {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');
  const [timeFrame, setTimeFrame] = useState<string>('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showCryptoList, setShowCryptoList] = useState(true);
  const [chartData, setChartData] = useState<any>(null);
  const [availableSymbols, setAvailableSymbols] = useState<string[]>([]);
  const [availableTimeframes, setAvailableTimeframes] = useState<string[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [changes, setChanges] = useState<Record<string, number>>({});
  const screenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchChartData();
        setChartData(data);
        const symbols = getAvailableSymbols(data);
        setAvailableSymbols(symbols);
        if (symbols.length > 0) {
          setSelectedSymbol(symbols[0]);
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchPricesAndChangesData() {
      try {
        const { prices: newPrices, changes: newChanges } = await fetchPricesAndChanges(availableSymbols);
        setPrices(prevPrices => ({ ...prevPrices, ...newPrices }));
        setChanges(prevChanges => ({ ...prevChanges, ...newChanges }));
      } catch (error) {
        console.error('Error fetching prices and changes:', error);
      }
    }

    if (availableSymbols.length > 0) {
      fetchPricesAndChangesData();
      const interval = setInterval(fetchPricesAndChangesData, 5 * 60 * 1000); // Update every 5 minutes
      return () => clearInterval(interval);
    }
  }, [availableSymbols]);

  useEffect(() => {
    if (chartData && selectedSymbol) {
      const timeframes = getAvailableTimeframes(chartData, selectedSymbol);
      setAvailableTimeframes(timeframes);
      if (timeframes.length > 0) {
        setTimeFrame(timeframes[0]);
      }
    }
  }, [chartData, selectedSymbol]);

  useEffect(() => {
    const pollInterval = 15 * 60 * 1000; // Poll every 15 minutes

    const pollForNewData = async () => {
      try {
        const newData = await fetchChartData();
        setChartData(newData);
      } catch (error) {
        console.error('Error polling for new data:', error);
      }
    };

    const intervalId = setInterval(pollForNewData, pollInterval);

    return () => clearInterval(intervalId);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      screenRef.current?.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  if (!chartData) {
    return <div className="flex items-center justify-center h-screen bg-[#1E222D] text-white">Loading...</div>;
  }

  return (
    <div ref={screenRef} className="flex flex-col h-screen bg-[#1E222D] text-white">
      <Header 
        isFullScreen={isFullScreen} 
        toggleFullScreen={toggleFullScreen}
        showCryptoList={showCryptoList}
        setShowCryptoList={setShowCryptoList}
      />
      <main className="flex-1 flex overflow-hidden">
        {showCryptoList && (
          <CryptoList 
            symbols={availableSymbols}
            selectedSymbol={selectedSymbol} 
            setSelectedSymbol={setSelectedSymbol} 
            prices={prices}
            changes={changes}
          />
        )}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 flex justify-between items-center border-b border-[#2B2B43]">
            <CryptoInfo 
              selectedSymbol={selectedSymbol} 
              price={prices[selectedSymbol]} 
              change={changes[selectedSymbol]}
            />
            <TimeFrameSelector 
              timeFrame={timeFrame} 
              setTimeFrame={setTimeFrame}
              availableTimeframes={availableTimeframes}
            />
          </div>
          <div className="flex-1 p-4 flex flex-col overflow-hidden">
            {selectedSymbol && timeFrame && chartData ? (
              <div className="flex-1">
                <CryptoChart
                  key={`${selectedSymbol}-${timeFrame}`}
                  chartData={chartData}
                  symbol={selectedSymbol}
                  timeFrame={timeFrame}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                No data available for the selected symbol and timeframe
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}